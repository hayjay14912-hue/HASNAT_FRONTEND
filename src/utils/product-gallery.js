const normalizeUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (raw.startsWith("//")) {
    return `https:${raw}`;
  }

  if (
    raw.startsWith("/") ||
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return raw;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}\//i.test(raw)) {
    return `https://${raw}`;
  }

  return raw;
};

const readObjectImageUrl = (item) => {
  if (!item || typeof item !== "object") return "";

  const directCandidate =
    item.img ??
    item.url ??
    item.src ??
    item.image ??
    item.imageUrl ??
    item.originalSrc ??
    item.original ??
    item.secure_url ??
    item.thumbnail ??
    item.medium ??
    item.large ??
    item.path;

  if (typeof directCandidate === "string") {
    return directCandidate;
  }

  const nestedCandidate =
    item.file?.url ??
    item.asset?.url ??
    item.node?.url ??
    item.media?.url ??
    item.media?.src ??
    item.image?.url ??
    item.image?.src;

  return typeof nestedCandidate === "string" ? nestedCandidate : "";
};

const toCleanImage = (item) => {
  if (!item) return null;

  if (typeof item === "string") {
    const img = normalizeUrl(item);
    return img ? { img } : null;
  }

  if (typeof item === "object") {
    const img = normalizeUrl(readObjectImageUrl(item));
    return img ? { ...item, img } : null;
  }

  return null;
};

export const buildProductGallery = (productItem) => {
  const primaryImg = normalizeUrl(productItem?.img);
  const rawGallerySources = [
    Array.isArray(productItem?.imageURLs) ? productItem.imageURLs : [],
    Array.isArray(productItem?.images) ? productItem.images : [],
    Array.isArray(productItem?.gallery) ? productItem.gallery : [],
    Array.isArray(productItem?.media) ? productItem.media : [],
  ];
  const cleanedGallery = rawGallerySources.flat().map(toCleanImage).filter(Boolean);

  if (!primaryImg && cleanedGallery.length === 0) return [];

  const seen = new Set();
  const merged = [];
  const pushUnique = (item) => {
    if (!item?.img || seen.has(item.img)) return;
    seen.add(item.img);
    merged.push(item);
  };

  if (primaryImg) {
    const existingPrimary = cleanedGallery.find((item) => item.img === primaryImg);
    pushUnique(existingPrimary || { img: primaryImg });
  }

  cleanedGallery.forEach(pushUnique);

  if (merged.length === 0 && primaryImg) {
    merged.push({ img: primaryImg });
  }

  return merged;
};
