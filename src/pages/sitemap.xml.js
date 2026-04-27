import medicalDeviceData from "@/data/medical-device-data";
import blogData from "@/data/blog-data";
import {
  isActiveProduct,
  isProfessionalProduct,
  isRetailProduct,
} from "@/utils/product-access";
import { buildClinicalKeywordIndex } from "@/utils/clinical-keywords";
import { buildKeywordIndex } from "@/utils/product-keywords";
import { buildProductPath, getSiteUrl } from "@/utils/seo-utils";

const toIsoDate = (value) => {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
};

const makeUrlEntry = ({ loc, lastmod, changefreq = "daily", priority = "0.7" }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const getProductsPayload = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/api/product/all`);
    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    console.error("Failed to build sitemap from product API:", error);
    return [];
  }
};

const getBlogsPayload = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/api/blogs?status=published&limit=200`);
    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    console.error("Failed to build sitemap from blogs API:", error);
    return [];
  }
};

const buildSitemapXml = (urls = []) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

export const getServerSideProps = async ({ res }) => {
  const siteUrl = getSiteUrl();
  const nowIso = toIsoDate();

  const staticPages = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/shop", priority: "0.9", changefreq: "daily" },
    { path: "/professional", priority: "0.9", changefreq: "daily" },
    { path: "/dermatologist-store-pakistan", priority: "0.9", changefreq: "daily" },
    { path: "/exosome-products-pakistan", priority: "0.9", changefreq: "daily" },
    { path: "/asce-exosome-pakistan", priority: "0.9", changefreq: "daily" },
    { path: "/product-keywords", priority: "0.85", changefreq: "daily" },
    { path: "/products/keyword/sunscreen", priority: "0.9", changefreq: "daily" },
    { path: "/professional-keywords", priority: "0.85", changefreq: "daily" },
    { path: "/medical-devices", priority: "0.9", changefreq: "daily" },
    { path: "/glutanex-retinol-eye-cream", priority: "0.95", changefreq: "daily" },
    { path: "/visvisal", priority: "0.95", changefreq: "daily" },
    { path: "/contact", priority: "0.8", changefreq: "weekly" },
    { path: "/contact-sales", priority: "0.8", changefreq: "weekly" },
    { path: "/request-pricing", priority: "0.8", changefreq: "weekly" },
    { path: "/request-quote", priority: "0.8", changefreq: "weekly" },
    { path: "/blog", priority: "0.7", changefreq: "weekly" },
  ];

  const products = await getProductsPayload();
  const blogs = await getBlogsPayload();
  const activeProducts = products.filter((product) => isActiveProduct(product));

  const productUrls = activeProducts
    .filter((product) => isRetailProduct(product))
    .map((product) => ({
      path: buildProductPath(product),
      priority: "0.9",
      changefreq: "daily",
      lastmod: toIsoDate(product?.updatedAt || product?.createdAt),
    }));

  const professionalUrls = activeProducts
    .filter((product) => isProfessionalProduct(product))
    .map((product) => ({
      path: `/professional/${product?._id || product?.id || ""}`,
      priority: "0.8",
      changefreq: "daily",
      lastmod: toIsoDate(product?.updatedAt || product?.createdAt),
    }))
    .filter((entry) => !entry.path.endsWith("/"));

  const clinicalKeywordUrls = buildClinicalKeywordIndex(products, {
    maxKeywords: 240,
    minProductMatches: 1,
  }).map((entry) => ({
    path: `/professional/keyword/${entry.slug}`,
    priority: "0.8",
    changefreq: "daily",
    lastmod: nowIso,
  }));

  const productKeywordUrls = buildKeywordIndex(products, {
    maxKeywords: 200,
    minProductMatches: 1,
  }).map((entry) => ({
    path: `/products/keyword/${entry.slug}`,
    priority: "0.75",
    changefreq: "daily",
    lastmod: nowIso,
  }));

  const deviceUrls = medicalDeviceData.map((device) => ({
    path: `/medical-devices/${device.slug}`,
    priority: "0.85",
    changefreq: "weekly",
    lastmod: nowIso,
  }));

  const blogUrls = blogData
    .filter((entry) => entry.blog === "blog-postbox")
    .map((entry) => ({
      path: `/blog-details/${entry.id}`,
      priority: "0.75",
      changefreq: "weekly",
      lastmod: toIsoDate(entry?.date),
    }));

  const cmsBlogUrls = blogs
    .filter((entry) => String(entry?.workflow?.status || "").toLowerCase() === "published")
    .map((entry) => ({
      path: `/blog/${entry.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: toIsoDate(entry?.updatedAt || entry?.createdAt || entry?.workflow?.publishedAt),
    }))
    .filter((entry) => Boolean(entry?.path && entry.path !== "/blog/"));

  const deduped = new Map();
  [
    ...staticPages,
    ...productUrls,
    ...professionalUrls,
    ...clinicalKeywordUrls,
    ...productKeywordUrls,
    ...deviceUrls,
    ...blogUrls,
    ...cmsBlogUrls,
  ].forEach((entry) => {
    if (!entry?.path) return;
    if (!deduped.has(entry.path)) {
      deduped.set(entry.path, entry);
    }
  });

  const sitemapUrls = Array.from(deduped.values()).map((entry) =>
    makeUrlEntry({
      loc: `${siteUrl}${entry.path}`,
      lastmod: entry.lastmod || nowIso,
      changefreq: entry.changefreq || "daily",
      priority: entry.priority || "0.7",
    })
  );

  const xml = buildSitemapXml(sitemapUrls);

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=82800");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapXml() {
  return null;
}
