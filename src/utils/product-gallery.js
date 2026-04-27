const toCleanImage = (item) => {
  if (!item) return null;
  if (typeof item === "string") {
    const img = item.trim();
    return img ? { img } : null;
  }
  if (typeof item === "object" && typeof item.img === "string") {
    const img = item.img.trim();
    return img ? { ...item, img } : null;
  }
  return null;
};

export const buildProductGallery = (productItem) => {
  const primaryImg = typeof productItem?.img === "string" ? productItem.img.trim() : "";
  const rawGallery = Array.isArray(productItem?.imageURLs) ? productItem.imageURLs : [];
  const cleanedGallery = rawGallery.map(toCleanImage).filter(Boolean);

  if (!primaryImg && cleanedGallery.length === 0) return [];

  // Guard for bad data: if only one gallery image exists but it differs from primary,
  // keep primary only (prevents stale images from another product appearing in quick view).
  if (primaryImg && cleanedGallery.length === 1 && cleanedGallery[0].img !== primaryImg) {
    return [{ ...cleanedGallery[0], img: primaryImg }];
  }

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
