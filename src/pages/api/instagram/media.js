// Server-side proxy for Instagram Graph API.
// Keeps tokens off the client and adds basic caching.

let memoryCache = {
  ts: 0,
  limit: 0,
  items: null,
};

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function pickType(media) {
  const productType = String(media?.media_product_type || "").toUpperCase();
  const mediaType = String(media?.media_type || "").toUpperCase();
  if (productType === "REELS") return "Reel";
  if (mediaType === "VIDEO") return "Video";
  return "Post";
}

export default async function handler(req, res) {
  const igUserId = process.env.IG_USER_ID;
  const accessToken = process.env.IG_PAGE_ACCESS_TOKEN || process.env.IG_ACCESS_TOKEN;
  const graphVersion = process.env.META_GRAPH_VERSION || "v19.0";

  const limit = clampInt(req.query.limit, 1, 24, 12);
  const ttlMs = clampInt(process.env.IG_CACHE_TTL_MS, 60_000, 60 * 60 * 1000, DEFAULT_TTL_MS);

  if (!igUserId || !accessToken) {
    res.status(200).json({
      ok: false,
      reason: "missing_env",
      items: [],
      hint: "Set IG_USER_ID and IG_PAGE_ACCESS_TOKEN (or IG_ACCESS_TOKEN) in your .env",
    });
    return;
  }

  const now = Date.now();
  if (
    memoryCache.items &&
    memoryCache.limit === limit &&
    now - memoryCache.ts < ttlMs
  ) {
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
    res.status(200).json({ ok: true, source: "memory_cache", items: memoryCache.items });
    return;
  }

  try {
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_product_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "timestamp",
    ].join(",");

    const url = new URL(`https://graph.facebook.com/${graphVersion}/${igUserId}/media`);
    url.searchParams.set("fields", fields);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url.toString());
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      res.status(200).json({
        ok: false,
        reason: "graph_error",
        status: response.status,
        error: payload?.error || payload,
        items: [],
      });
      return;
    }

    const items = (payload?.data || [])
      .map((m) => ({
        id: m?.id,
        type: pickType(m),
        caption: typeof m?.caption === "string" ? m.caption : "",
        media_type: m?.media_type,
        media_product_type: m?.media_product_type,
        media_url: m?.media_url || "",
        thumbnail_url: m?.thumbnail_url || "",
        permalink: m?.permalink || "",
        timestamp: m?.timestamp || "",
      }))
      .filter((m) => m.id && m.permalink && (m.media_url || m.thumbnail_url));

    memoryCache = { ts: now, limit, items };

    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
    res.status(200).json({ ok: true, source: "graph_api", items });
  } catch (err) {
    res.status(200).json({
      ok: false,
      reason: "exception",
      error: err?.message || String(err),
      items: [],
    });
  }
}

