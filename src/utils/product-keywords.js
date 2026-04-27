import { isActiveProduct, isRetailProduct } from "@/utils/product-access";
import { toSlug } from "@/utils/slug";
import { MANUAL_RETAIL_KEYWORDS } from "@/data/pakistan-skincare-keywords";

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
  "in",
  "on",
  "of",
  "to",
  "by",
  "at",
  "or",
  "is",
  "as",
  "be",
  "it",
  "product",
  "products",
  "medical",
]);

const normalize = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value = "") =>
  normalize(value)
    .replace(/[^a-z0-9\s-]+/g, " ")
    .split(/[\s-]+/)
    .map((token) => token.trim())
    .filter(
      (token) => token.length >= 3 && token.length <= 32 && !STOP_WORDS.has(token) && !/^\d+$/.test(token)
    );

const unique = (items = []) => Array.from(new Set(items.filter(Boolean)));

const toKeywordPhrase = (value = "") => normalize(value).replace(/[^a-z0-9\s-]+/g, " ").trim();

const buildTitleNgrams = (title = "") => {
  const tokens = tokenize(title);
  const phrases = [];

  for (let n = 1; n <= 3; n += 1) {
    for (let i = 0; i <= tokens.length - n; i += 1) {
      const phrase = tokens.slice(i, i + n).join(" ").trim();
      if (!phrase || phrase.length < 4) continue;
      phrases.push(phrase);
    }
  }

  return unique(phrases);
};

export const getRetailActiveProducts = (products = []) =>
  products.filter((product) => isActiveProduct(product) && isRetailProduct(product));

export const getProductSearchText = (product = {}) =>
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

export const getProductKeywordCandidates = (product = {}) => {
  const title = toKeywordPhrase(product?.title || product?.name || "");
  const brand = toKeywordPhrase(product?.brand?.name || "");
  const category = toKeywordPhrase(product?.category?.name || product?.parent || "");
  const tags = Array.isArray(product?.tags) ? product.tags.map((tag) => toKeywordPhrase(tag)) : [];

  const phrases = [
    title,
    brand,
    category,
    brand && category ? `${brand} ${category}` : "",
    ...tags,
    ...buildTitleNgrams(title),
  ];

  return unique(
    phrases.filter(
      (phrase) =>
        phrase &&
        phrase.length >= 3 &&
        phrase.length <= 48 &&
        !STOP_WORDS.has(phrase) &&
        !/^\d+$/.test(phrase)
    )
  );
};

export const buildKeywordIndex = (
  products = [],
  { maxKeywords = 120, minProductMatches = 2 } = {}
) => {
  const retailProducts = getRetailActiveProducts(products);
  const map = new Map();

  retailProducts.forEach((product) => {
    const productId = String(product?._id || product?.id || "");
    if (!productId) return;

    const candidates = getProductKeywordCandidates(product);
    const searchText = getProductSearchText(product);
    candidates.forEach((keyword) => {
      const key = normalize(keyword);
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          keyword: key,
          slug: toSlug(key),
          productIds: new Set(),
          score: 0,
        });
      }

      const entry = map.get(key);
      entry.productIds.add(productId);
      entry.score += key.includes(" ") ? 2 : 1;
    });

    MANUAL_RETAIL_KEYWORDS.forEach((entryConfig) => {
      const key = normalize(entryConfig.keyword);
      const aliases = (entryConfig.aliases || []).map((alias) => normalize(alias)).filter(Boolean);
      const hasMatch =
        searchText.includes(key) || aliases.some((alias) => alias && searchText.includes(alias));

      if (!hasMatch) return;

      if (!map.has(key)) {
        map.set(key, {
          keyword: key,
          slug: toSlug(key),
          productIds: new Set(),
          score: 0,
        });
      }

      const entry = map.get(key);
      entry.productIds.add(productId);
      entry.score += 3;
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

export const findProductsByKeyword = (products = [], keyword = "") => {
  const normalizedKeyword = normalize(keyword);
  if (!normalizedKeyword) {
    return [];
  }

  const manualKeyword = MANUAL_RETAIL_KEYWORDS.find(
    (entry) => normalize(entry.keyword) === normalizedKeyword
  );

  return getRetailActiveProducts(products).filter((product) => {
    const text = getProductSearchText(product);

    if (text.includes(normalizedKeyword)) {
      return true;
    }

    if (manualKeyword) {
      return (manualKeyword.aliases || []).some((alias) => text.includes(normalize(alias)));
    }

    return false;
  });
};

export const resolveKeywordFromSlug = (slugValue = "") =>
  normalize(slugValue).replace(/-/g, " ").trim();
