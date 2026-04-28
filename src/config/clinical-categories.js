import { toSlug } from "@/utils/slug";

export const CLINICAL_CATEGORY_ORDER = [
  "Exosomes",
  "Injectables",
  "Chemical Peels",
  "Fillers",
  "Permanent Makeup",
  "BB Glow Treatment",
];

export const CLINICAL_CATEGORY_MENU = [
  { title: "All Clinical Products", link: "/professional" },
  { title: "Dermatologist Store", link: "/dermatologist-store-pakistan" },
  { title: "Exosome Products", link: "/exosome-products-pakistan" },
  ...CLINICAL_CATEGORY_ORDER.map((name) => ({
    title: name,
    link: `/professional?category=${toSlug(name)}`,
  })),
];

export const getClinicalCategoryName = (product) => {
  const categoryName = String(product?.category?.name || "").trim();
  if (categoryName) return categoryName;
  const childrenName = String(product?.children || "").trim();
  if (childrenName) return childrenName;
  return "Uncategorized";
};
