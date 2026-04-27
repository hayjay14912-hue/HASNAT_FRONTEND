import { toSlug } from "@/utils/slug";

const DEFAULT_SITE_URL = "https://www.neesmedical.com";
const DEFAULT_CATEGORY = "Skincare";
const LOCAL_DELIVERY_SUFFIX = "Same-day delivery in Lahore, Pakistan.";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

const truncateText = (value = "", maxLength = 160) => {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};

export const getSiteUrl = () =>
  normalizeText(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL)
    .replace(/^http:\/\//i, "https://")
    .replace(/\/+$/, "");

export const ensureAbsoluteUrl = (url = "") => {
  const value = normalizeText(url);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const siteUrl = getSiteUrl();
  if (value.startsWith("/")) {
    return `${siteUrl}${value}`;
  }

  return `${siteUrl}/${value}`;
};

export const getProductCategoryName = (product) =>
  normalizeText(product?.category?.name || product?.parent || DEFAULT_CATEGORY) || DEFAULT_CATEGORY;

export const getProductName = (product) =>
  normalizeText(product?.title || product?.name || "Product") || "Product";

export const getProductPrimaryDescription = (product) =>
  normalizeText(
    product?.short_description ||
      product?.shortDescription ||
      product?.description ||
      product?.longDescription ||
      ""
  );

export const getProductMetaTitle = (product) => {
  const customMetaTitle = normalizeText(product?.seo?.metaTitle || "");
  if (customMetaTitle) return customMetaTitle;
  const productName = getProductName(product);
  return `${productName} Price in Pakistan | NEES Medical`;
};

export const getProductMetaDescription = (product) => {
  const customMetaDescription = normalizeText(product?.seo?.metaDescription || "");
  if (customMetaDescription) return truncateText(customMetaDescription, 160);

  const productName = getProductName(product);
  const primaryDescription = getProductPrimaryDescription(product);
  const pricing = getProductPricing(product);

  if (pricing.isBogo) {
    const bundlePriceText = `PKR ${pricing.bundlePrice.toFixed(2)}`;
    return truncateText(
      `Buy ${productName} from NEES Medical Pakistan at ${bundlePriceText} for ${pricing.bundleSize} pieces. ${LOCAL_DELIVERY_SUFFIX}`,
      160
    );
  }

  if (pricing.hasSalePrice) {
    const salePriceText = `PKR ${pricing.salePrice.toFixed(2)}`;
    const basePriceText = `PKR ${pricing.basePrice.toFixed(2)}`;
    return truncateText(
      `Buy ${productName} from NEES Medical Pakistan at ${salePriceText} (was ${basePriceText}). ${LOCAL_DELIVERY_SUFFIX}`,
      160
    );
  }

  if (!primaryDescription) {
    return truncateText(
      `Buy ${productName} from NEES Medical Lahore, Pakistan. ${LOCAL_DELIVERY_SUFFIX}`,
      160
    );
  }

  if (/lahore|pakistan|same-day delivery/i.test(primaryDescription)) {
    return truncateText(primaryDescription, 160);
  }

  return truncateText(`${primaryDescription} ${LOCAL_DELIVERY_SUFFIX}`, 160);
};

const parseNumericDiscount = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : Number.NaN;
  }

  const normalized = normalizeText(value);
  if (!normalized) {
    return Number.NaN;
  }

  const sanitized = normalized.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  if (!sanitized) {
    return Number.NaN;
  }

  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

export const getProductPricing = (product = {}) => {
  const basePrice = parseNumericPrice(product?.price);
  const bogoEnabled = Boolean(product?.bogoOffer?.enabled);
  const bogoBundleSize = Math.max(1, parseNumericPrice(product?.bogoOffer?.bundleSize) || 1);
  const bogoBundlePrice = parseNumericPrice(product?.bogoOffer?.bundlePrice);

  if (bogoEnabled && Number.isFinite(bogoBundlePrice) && bogoBundlePrice > 0) {
    return {
      hasBasePrice: Number.isFinite(basePrice) && basePrice > 0,
      hasSalePrice: false,
      basePrice: Number.isFinite(basePrice) ? basePrice : Number.NaN,
      salePrice: bogoBundlePrice,
      discountValue: Number.NaN,
      isBogo: true,
      bundleSize: bogoBundleSize,
      bundlePrice: bogoBundlePrice,
    };
  }

  const discountValue = parseNumericDiscount(product?.discount);

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return {
      hasBasePrice: false,
      hasSalePrice: false,
      basePrice: Number.NaN,
      salePrice: Number.NaN,
      discountValue: Number.NaN,
      isBogo: false,
      bundleSize: 1,
      bundlePrice: Number.NaN,
    };
  }

  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return {
      hasBasePrice: true,
      hasSalePrice: false,
      basePrice,
      salePrice: basePrice,
      discountValue: 0,
      isBogo: false,
      bundleSize: 1,
      bundlePrice: Number.NaN,
    };
  }

  let computedSale = basePrice;

  // Treat discount values below 100 as percentages; otherwise, absolute currency.
  if (discountValue < 100) {
    computedSale = basePrice - (basePrice * discountValue) / 100;
  } else if (discountValue < basePrice) {
    computedSale = basePrice - discountValue;
  }

  const salePrice = Number(Math.max(0, computedSale).toFixed(2));
  const hasSalePrice = salePrice > 0 && salePrice < basePrice;

  return {
    hasBasePrice: true,
    hasSalePrice,
    basePrice,
    salePrice,
    discountValue,
    isBogo: false,
    bundleSize: 1,
    bundlePrice: Number.NaN,
  };
};

export const getProductSeoKeywords = (product = {}) => {
  const customKeywords = Array.isArray(product?.seo?.keywords)
    ? product.seo.keywords.map((entry) => normalizeText(entry)).filter(Boolean)
    : [];
  if (customKeywords.length > 0) {
    return Array.from(new Set(customKeywords)).join(", ");
  }

  const productName = getProductName(product);
  const categoryName = getProductCategoryName(product);
  const brandName =
    normalizeText(product?.brand?.name || product?.manufacturer || product?.company) || "NEES Medical";
  const normalizedProductName = normalizeText(productName);
  const productTagTerms = Array.isArray(product?.tags)
    ? product.tags.map((tag) => normalizeText(tag)).filter(Boolean)
    : [];

  const spellingAliases = [];
  if (normalizedProductName.includes("glutanex")) {
    spellingAliases.push(
      normalizedProductName.replace(/glutanex/g, "gluatenx"),
      "snow white cream glutanex",
      "snow white cream gluatenx"
    );
  }

  const terms = [
    productName,
    `${productName} price in pakistan`,
    `${productName} lahore`,
    `${productName} original`,
    `${productName} buy online pakistan`,
    `${brandName} ${productName}`.replace(/\s+/g, " ").trim(),
    `${categoryName} pakistan`,
    `${categoryName} lahore`,
    `${brandName} pakistan`,
    ...productTagTerms,
    ...spellingAliases,
    "nees medical skincare",
  ]
    .map((entry) => normalizeText(entry))
    .filter(Boolean);

  return Array.from(new Set(terms)).join(", ");
};

const getImageBenefit = (product) => {
  const firstTag = Array.isArray(product?.tags)
    ? normalizeText(product.tags.find((tag) => normalizeText(tag)))
    : "";

  if (firstTag) {
    return truncateText(firstTag, 48);
  }

  const primaryDescription = getProductPrimaryDescription(product);
  if (!primaryDescription) {
    return "Clinical skincare support";
  }

  const firstSentence = primaryDescription.split(/[.!?]/)[0];
  return truncateText(firstSentence || primaryDescription, 48);
};

export const getProductImageAlt = (product) => {
  const productName = getProductName(product);
  const benefit = getImageBenefit(product);
  return `${productName} - ${benefit} - NEES Medical Lahore`;
};

export const buildProductSlug = (product = {}) => {
  const explicitSlug = toSlug(product?.slug || "");
  if (explicitSlug) {
    return explicitSlug;
  }

  const id = normalizeText(product?._id || product?.id);
  const nameSlug = toSlug(product?.title || product?.name || "product");

  if (nameSlug) {
    return nameSlug;
  }

  return id || "product";
};

export const buildProductPath = (product = {}) => `/product/${buildProductSlug(product)}`;

export const buildProductPathFromValues = ({ id = "", title = "", slug = "" } = {}) => {
  const normalizedSlug = toSlug(slug || title || "");
  if (normalizedSlug) {
    return `/product/${normalizedSlug}`;
  }

  const safeId = normalizeText(id);
  if (safeId) {
    return `/product/${safeId}`;
  }

  return "/shop";
};

export const extractProductIdFromSlug = (slugValue) => {
  const rawSlug = Array.isArray(slugValue) ? slugValue[0] : slugValue;
  const slug = normalizeText(rawSlug).toLowerCase();

  if (!slug) {
    return "";
  }

  if (/^[a-f0-9]{24}$/i.test(slug)) {
    return slug;
  }

  const slugParts = slug.split("-");
  const tail = slugParts[slugParts.length - 1] || "";
  if (/^[a-f0-9]{24}$/i.test(tail)) {
    return tail;
  }

  const matches = slug.match(/[a-f0-9]{24}/gi);
  if (!matches || matches.length === 0) {
    return "";
  }

  return matches[matches.length - 1];
};

export const getProductSchemaAvailability = (status) => {
  const normalizedStatus = normalizeText(status)
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (
    [
      "in-stock",
      "instock",
      "active",
      "available",
      "published",
      "live",
      "instocknow",
    ].includes(normalizedStatus) ||
    normalizedStatus.includes("in-stock") ||
    normalizedStatus.includes("available")
  ) {
    return "https://schema.org/InStock";
  }

  if (
    [
      "out-of-stock",
      "outofstock",
      "sold-out",
      "unavailable",
      "not-available",
    ].includes(normalizedStatus) ||
    normalizedStatus.includes("out-of-stock") ||
    normalizedStatus.includes("sold-out")
  ) {
    return "https://schema.org/OutOfStock";
  }

  if (
    ["preorder", "pre-order", "backorder", "back-order", "coming-soon"].includes(
      normalizedStatus
    ) ||
    normalizedStatus.includes("pre-order")
  ) {
    return "https://schema.org/PreOrder";
  }

  if (["discontinued", "inactive", "retired", "archived"].includes(normalizedStatus)) {
    return "https://schema.org/Discontinued";
  }

  return "https://schema.org/InStock";
};

const getProductImageList = (product) => {
  const images = [];

  if (normalizeText(product?.img)) {
    images.push(product.img);
  }

  if (Array.isArray(product?.imageURLs)) {
    product.imageURLs.forEach((entry) => {
      const imageUrl = normalizeText(entry?.img || entry);
      if (imageUrl) {
        images.push(imageUrl);
      }
    });
  }

  return Array.from(new Set(images));
};

const parseNumericPrice = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : Number.NaN;
  }

  const normalized = normalizeText(value);
  if (!normalized) {
    return Number.NaN;
  }

  const sanitized = normalized.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  if (!sanitized) {
    return Number.NaN;
  }

  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

export const buildProductStructuredData = ({ product, canonicalPath = "" } = {}) => {
  if (!product) {
    return undefined;
  }

  const canonicalUrl = ensureAbsoluteUrl(canonicalPath || buildProductPath(product));
  const pricing = getProductPricing(product);
  const hasNumericPrice = pricing.hasBasePrice;

  const reviews = Array.isArray(product?.reviews)
    ? product.reviews.filter((review) => Number.isFinite(Number(review?.rating)))
    : [];

  const reviewCount = reviews.length;
  const aggregateRating =
    reviewCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: Number(
            (
              reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviewCount
            ).toFixed(1)
          ),
          reviewCount,
        }
      : undefined;

  const offers = hasNumericPrice
    ? {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: (
          pricing.isBogo
            ? pricing.bundlePrice
            : pricing.hasSalePrice
              ? pricing.salePrice
              : pricing.basePrice
        ).toFixed(2),
        availability: getProductSchemaAvailability(product?.status),
        url: canonicalUrl,
        itemCondition: "https://schema.org/NewCondition",
        priceSpecification: pricing.isBogo
          ? [
              {
                "@type": "UnitPriceSpecification",
                priceCurrency: "PKR",
                price: pricing.bundlePrice.toFixed(2),
                referenceQuantity: {
                  "@type": "QuantitativeValue",
                  value: pricing.bundleSize,
                },
              },
            ]
          : pricing.hasSalePrice
          ? [
              {
                "@type": "UnitPriceSpecification",
                priceCurrency: "PKR",
                price: pricing.salePrice.toFixed(2),
              },
              {
                "@type": "UnitPriceSpecification",
                priceCurrency: "PKR",
                price: pricing.basePrice.toFixed(2),
                priceType: "https://schema.org/ListPrice",
              },
            ]
          : undefined,
        seller: {
          "@type": "Organization",
          name: "NEES Medical",
        },
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    brand: {
      "@type": "Brand",
      name:
        normalizeText(product?.brand?.name || product?.manufacturer || product?.company) ||
        "NEES Medical",
    },
    name: getProductName(product),
    url: canonicalUrl,
    image: getProductImageList(product).map((imageUrl) => ensureAbsoluteUrl(imageUrl)),
    description: getProductMetaDescription(product),
    sku: normalizeText(product?.sku) || undefined,
    category: getProductCategoryName(product),
    offers,
    aggregateRating,
  };
};
