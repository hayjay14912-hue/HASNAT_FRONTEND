import { getProductSearchText } from "@/utils/product-keywords";

const normalize = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const compact = (value = "") => normalize(value).replace(/\s+/g, "");

const tokens = (value = "") => normalize(value).split(" ").filter(Boolean);

const isSubsequence = (needle = "", haystack = "") => {
  if (!needle || !haystack) return false;
  let pointer = 0;
  for (let index = 0; index < haystack.length; index += 1) {
    if (needle[pointer] === haystack[index]) {
      pointer += 1;
      if (pointer === needle.length) {
        return true;
      }
    }
  }
  return false;
};

const hasCompoundWordMatch = (singleTerm = "", haystackWords = []) => {
  if (singleTerm.length < 6 || haystackWords.length < 2) return false;

  for (let i = 0; i < haystackWords.length; i += 1) {
    const first = haystackWords[i];
    if (first.length < 3 || !singleTerm.startsWith(first)) continue;

    const remaining = singleTerm.slice(first.length);
    if (remaining.length < 3) continue;

    for (let j = i + 1; j < haystackWords.length; j += 1) {
      const next = haystackWords[j];
      if (next.length < 3) continue;
      if (remaining === next || remaining.startsWith(next) || next.startsWith(remaining)) {
        return true;
      }
    }
  }

  return false;
};

const getProductTitle = (product = {}) =>
  String(product?.title || product?.name || "").trim();

export const matchProductBySearch = (product = {}, rawTerm = "") => {
  const normalizedTerm = normalize(rawTerm);
  if (!normalizedTerm) return true;

  const normalizedHaystack = normalize(getProductSearchText(product));
  if (!normalizedHaystack) return false;

  const compactTerm = compact(normalizedTerm);
  const compactHaystack = compact(normalizedHaystack);
  const termTokens = tokens(normalizedTerm);
  const haystackWords = tokens(normalizedHaystack);
  const normalizedTitle = normalize(getProductTitle(product));
  const compactTitle = compact(normalizedTitle);

  if (normalizedHaystack.includes(normalizedTerm)) return true;
  if (compactTerm && compactHaystack.includes(compactTerm)) return true;

  if (termTokens.length > 0 && termTokens.every((token) => normalizedHaystack.includes(token))) {
    return true;
  }

  if (
    termTokens.length > 0 &&
    termTokens.every((token) => haystackWords.some((word) => word.startsWith(token) || token.startsWith(word)))
  ) {
    return true;
  }

  if (termTokens.length === 1 && hasCompoundWordMatch(termTokens[0], haystackWords)) {
    return true;
  }

  if (compactTerm.length >= 5 && compactTitle && isSubsequence(compactTerm, compactTitle)) {
    return true;
  }

  return false;
};

const getSuggestionScore = (product = {}, rawTerm = "") => {
  const normalizedTerm = normalize(rawTerm);
  if (!normalizedTerm) return 0;

  const normalizedTitle = normalize(getProductTitle(product));
  const normalizedHaystack = normalize(getProductSearchText(product));
  const compactTerm = compact(normalizedTerm);
  const compactTitle = compact(normalizedTitle);
  const compactHaystack = compact(normalizedHaystack);
  const termTokens = tokens(normalizedTerm);

  let score = 0;

  if (normalizedTitle === normalizedTerm) score += 260;
  if (normalizedTitle.startsWith(normalizedTerm)) score += 220;
  if (normalizedTitle.includes(normalizedTerm)) score += 180;
  if (normalizedHaystack.includes(normalizedTerm)) score += 130;
  if (compactTerm && compactTitle.includes(compactTerm)) score += 120;
  if (compactTerm && compactHaystack.includes(compactTerm)) score += 90;

  if (termTokens.length > 0 && termTokens.every((token) => normalizedTitle.includes(token))) {
    score += 75;
  }

  if (termTokens.length > 0 && termTokens.every((token) => normalizedHaystack.includes(token))) {
    score += 50;
  }

  if (termTokens.length === 1 && hasCompoundWordMatch(termTokens[0], tokens(normalizedHaystack))) {
    score += 60;
  }

  if (compactTerm.length >= 5 && compactTitle && isSubsequence(compactTerm, compactTitle)) {
    score += 40;
  }

  return score;
};

export const getProductSearchSuggestions = (products = [], rawTerm = "", limit = 6) => {
  const normalizedTerm = normalize(rawTerm);
  if (!normalizedTerm || normalizedTerm.length < 2) return [];

  return (Array.isArray(products) ? products : [])
    .filter((product) => matchProductBySearch(product, normalizedTerm))
    .map((product) => ({
      product,
      score: getSuggestionScore(product, normalizedTerm),
      title: getProductTitle(product).toLowerCase(),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.title.localeCompare(b.title);
    })
    .slice(0, limit)
    .map((entry) => entry.product);
};

