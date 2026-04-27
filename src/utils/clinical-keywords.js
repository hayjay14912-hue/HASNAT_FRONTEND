import { isActiveProduct } from "@/utils/product-access";
import { toSlug } from "@/utils/slug";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "you",
  "our",
  "are",
  "was",
  "were",
  "have",
  "has",
  "had",
  "can",
  "all",
  "new",
  "best",
  "buy",
  "shop",
  "online",
  "medical",
  "clinic",
  "clinical",
  "pakistan",
  "lahore",
  "for",
  "and",
  "the",
]);

const normalize = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\s+/g, " ")
    .trim();

const unique = (items = []) => Array.from(new Set((items || []).filter(Boolean)));

const tokenize = (value = "") =>
  normalize(value)
    .replace(/[^a-z0-9\s+-]+/g, " ")
    .split(/[\s-]+/)
    .map((token) => token.trim())
    .filter(
      (token) =>
        token.length >= 3 &&
        token.length <= 32 &&
        !STOP_WORDS.has(token) &&
        !/^\d+$/.test(token)
    );

const toPhrase = (value = "") => normalize(value).replace(/[^a-z0-9\s+-]+/g, " ").trim();

const CLINICAL_MANUAL_KEYWORDS = [
  "dermaqual",
  "dermaqual pakistan",
  "dermaqual exosome",
  "dermaqual exocell",
  "dermaqual mesotherapy",
  "asce exosome",
  "asce+ exosome",
  "asce exobio exosome",
  "exosome serum",
  "exosome products pakistan",
  "pdrn skin booster",
  "botulax 100 units",
  "rx ha filler",
  "hyaluronic acid filler",
  "mesotherapy products",
  "mesotherapy serums pakistan",
  "skin booster for clinics",
  "professional injectables",
  "clinic use only products",
];

export const getClinicalActiveProducts = (products = []) =>
  (Array.isArray(products) ? products : []).filter((product) => {
    if (!isActiveProduct(product)) return false;

    const productType = normalize(product?.productType);
    if (productType === "clinical") return true;

    if (product?.inquiryOnly || product?.isInquiryOnly || product?.professionalUseOnly) {
      return true;
    }

    return false;
  });

const getClinicalSearchText = (product = {}) =>
  normalize(
    [
      product?.title,
      product?.name,
      product?.brand?.name,
      product?.category?.name,
      product?.parent,
      product?.short_description,
      product?.shortDescription,
      product?.description,
      ...(Array.isArray(product?.tags) ? product.tags : []),
    ]
      .filter(Boolean)
      .join(" ")
  );

const getProductCandidates = (product = {}) => {
  const title = toPhrase(product?.title || product?.name || "");
  const brand = toPhrase(product?.brand?.name || "");
  const category = toPhrase(product?.category?.name || product?.parent || "");

  const tokens = tokenize(title);
  const ngrams = [];

  for (let n = 1; n <= 3; n += 1) {
    for (let i = 0; i <= tokens.length - n; i += 1) {
      const phrase = tokens.slice(i, i + n).join(" ");
      if (phrase.length >= 4) {
        ngrams.push(phrase);
      }
    }
  }

  return unique([
    title,
    brand,
    category,
    brand && category ? `${brand} ${category}` : "",
    ...ngrams,
  ]).filter((phrase) => phrase && phrase.length <= 56 && !STOP_WORDS.has(phrase));
};

export const buildClinicalKeywordIndex = (
  products = [],
  { maxKeywords = 120, minProductMatches = 1 } = {}
) => {
  const clinicalProducts = getClinicalActiveProducts(products);
  const map = new Map();

  clinicalProducts.forEach((product) => {
    const productId = String(product?._id || product?.id || "");
    if (!productId) return;

    const searchText = getClinicalSearchText(product);

    const candidates = [...getProductCandidates(product), ...CLINICAL_MANUAL_KEYWORDS].map(normalize);

    candidates.forEach((keyword) => {
      if (!keyword || keyword.length < 3) return;

      if (!map.has(keyword)) {
        map.set(keyword, {
          keyword,
          slug: toSlug(keyword),
          productIds: new Set(),
          score: 0,
        });
      }

      const entry = map.get(keyword);

      if (searchText.includes(keyword)) {
        entry.productIds.add(productId);
        entry.score += keyword.includes(" ") ? 3 : 1;
      } else if (
        keyword === "asce exobio exosome" &&
        (searchText.includes("asce") || searchText.includes("exosome"))
      ) {
        entry.productIds.add(productId);
        entry.score += 2;
      }
    });
  });

  return Array.from(map.values())
    .filter((entry) => entry.slug && entry.productIds.size >= minProductMatches)
    .sort((a, b) => {
      if (b.productIds.size !== a.productIds.size) return b.productIds.size - a.productIds.size;
      if (b.score !== a.score) return b.score - a.score;
      return a.keyword.localeCompare(b.keyword);
    })
    .slice(0, maxKeywords)
    .map((entry) => ({
      keyword: entry.keyword,
      slug: entry.slug,
      productCount: entry.productIds.size,
      score: entry.score,
      productIds: Array.from(entry.productIds),
    }));
};

export const resolveClinicalKeywordFromSlug = (slugValue = "") =>
  normalize(slugValue).replace(/-/g, " ").trim();

export const findClinicalProductsByKeyword = (products = [], keyword = "") => {
  const normalizedKeyword = normalize(keyword);
  if (!normalizedKeyword) return [];

  const clinicalProducts = getClinicalActiveProducts(products);

  return clinicalProducts.filter((product) => {
    const text = getClinicalSearchText(product);
    if (text.includes(normalizedKeyword)) return true;

    if (
      normalizedKeyword === "asce exobio exosome" &&
      (text.includes("asce") || text.includes("exosome"))
    ) {
      return true;
    }

    return false;
  });
};
