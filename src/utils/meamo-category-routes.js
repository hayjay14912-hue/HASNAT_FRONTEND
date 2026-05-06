import { toSlug } from "@/utils/slug";

export const CATEGORY_ROUTE_LIST = [
  { name: "Botulinum Toxins", slug: "botulinums" },
  { name: "Dermal Fillers", slug: "dermal-fillers" },
  { name: "Korean Skin Boosters", slug: "korean-skin-boosters" },
  { name: "Body Fillers", slug: "body-fillers" },
  { name: "Numbing Cream", slug: "numbing-cream" },
  { name: "Devices & Disposables", slug: "devices-disposables" },
  { name: "Sets", slug: "sets" },
  { name: "Health Boosters", slug: "health-boosters" },
  { name: "Korean Skincare", slug: "korean-skincare" },
  { name: "Lifting Thread", slug: "lifting-thread" },
  { name: "Clearance", slug: "clearance" },
  { name: "Contouring Serums", slug: "contouring-serums" },
  { name: "Newly Curated", slug: "newly-curated" },
  { name: "Meamo Labs", slug: "meamo-labs" },
  { name: "Collagen Stimulators", slug: "collagen-stimulators" },
  { name: "CE Certified", slug: "ce-certified" },
  { name: "Microneedling", slug: "microneedling" },
  { name: "Hair Treatment", slug: "hair-treatment" },
];

const slugByName = new Map(
  CATEGORY_ROUTE_LIST.map((entry) => [toSlug(entry.name), entry.slug])
);
const nameBySlug = new Map(
  CATEGORY_ROUTE_LIST.map((entry) => [entry.slug, entry.name])
);

export const buildCategoryRoute = (name) => {
  const safeNameSlug = toSlug(name);
  const routeSlug = slugByName.get(safeNameSlug) || safeNameSlug;
  return routeSlug ? `/${routeSlug}` : "/";
};

export const resolveCategoryNameBySlug = (slug) => {
  const normalized = String(slug || "").trim().toLowerCase();
  return nameBySlug.get(normalized) || "";
};

export const isKnownCategorySlug = (slug) => Boolean(resolveCategoryNameBySlug(slug));
