export const toSlug = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeQuerySlug = (value) =>
  toSlug(Array.isArray(value) ? value[0] : value);

const RETAIL_CATEGORY_QUERY_ALIASES = {
  "discover-skincare": "",
};

export const resolveRetailCategoryQuery = (value) => {
  const normalized = normalizeQuerySlug(value);
  if (!normalized) return "";
  if (Object.prototype.hasOwnProperty.call(RETAIL_CATEGORY_QUERY_ALIASES, normalized)) {
    return RETAIL_CATEGORY_QUERY_ALIASES[normalized];
  }
  return normalized;
};
