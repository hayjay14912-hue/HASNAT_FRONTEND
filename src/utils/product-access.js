import {
  ACTIVE_VALUES,
  DEVICE_KEYWORDS,
  DEVICE_PRODUCT_IDS,
  DEVICE_VALUES,
  INACTIVE_VALUES,
  PROFESSIONAL_KEYWORDS,
  PROFESSIONAL_PRODUCT_IDS,
  PROFESSIONAL_VALUES,
  RETAIL_VALUES,
} from "@/config/product-segmentation";

const normalize = (value) => String(value || "").toLowerCase().trim();

const asArray = (value) => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const hasKeyword = (text, keywords) => {
  const normalizedText = normalize(text);
  if (!normalizedText) {
    return false;
  }
  return keywords.some((keyword) => normalizedText.includes(normalize(keyword)));
};

const collectText = (product) => {
  if (!product) {
    return "";
  }

  const blocks = [
    product.title,
    product.description,
    product.shortDescription,
    product.longDescription,
    product?.brand?.name,
    product?.category?.name,
    product?.category?.parent,
    product?.children,
    product?.parent,
    ...(asArray(product.tags) || []),
  ];

  return blocks.filter(Boolean).join(" ");
};

const extractTypeSignals = (product) => {
  if (!product) {
    return [];
  }

  return [
    product.catalogCategory,
    product.businessCategory,
    product.productCategoryType,
    product.marketType,
    product.channel,
    product.audience,
    product.productAudience,
    product.accessType,
    product.saleMode,
    product.productType,
    product.type,
    product.segment,
    product.categorySegment,
    product?.category?.type,
  ]
    .map((value) => normalize(value))
    .filter(Boolean);
};

const extractPublishSignals = (product) => {
  if (!product) {
    return [];
  }

  return [
    product.productStatus,
    product.publishStatus,
    product.lifecycleStatus,
    product.recordStatus,
    product.visibilityStatus,
    product.state,
    product.activeState,
    product.adminStatus,
    product.status,
  ]
    .map((value) => normalize(value))
    .filter(Boolean);
};

export const getProductPublishState = (product) => {
  if (!product) {
    return "active";
  }

  const stockStatus = normalize(product.status);
  if (stockStatus === "discontinued") {
    return "inactive";
  }

  if (typeof product.isActive === "boolean") {
    return product.isActive ? "active" : "inactive";
  }

  if (typeof product.enabled === "boolean") {
    return product.enabled ? "active" : "inactive";
  }

  const signals = extractPublishSignals(product);

  if (signals.some((signal) => INACTIVE_VALUES.includes(signal))) {
    return "inactive";
  }

  if (signals.some((signal) => ACTIVE_VALUES.includes(signal))) {
    return "active";
  }

  return "active";
};

export const isActiveProduct = (product) => getProductPublishState(product) === "active";

export const getProductAudience = (product) => {
  if (!product) {
    return "retail";
  }

  if (DEVICE_PRODUCT_IDS.includes(product._id)) {
    return "device";
  }

  if (PROFESSIONAL_PRODUCT_IDS.includes(product._id)) {
    return "professional";
  }

  const signals = extractTypeSignals(product);

  if (signals.some((signal) => DEVICE_VALUES.includes(signal))) {
    return "device";
  }

  if (signals.some((signal) => PROFESSIONAL_VALUES.includes(signal))) {
    return "professional";
  }

  if (signals.some((signal) => RETAIL_VALUES.includes(signal))) {
    return "retail";
  }

  if (product.isDevice || product.deviceOnly) {
    return "device";
  }

  if (product.professionalUseOnly || product.inquiryOnly || product.isInquiryOnly) {
    return "professional";
  }

  const searchableText = collectText(product);

  if (hasKeyword(searchableText, DEVICE_KEYWORDS)) {
    return "device";
  }

  if (hasKeyword(searchableText, PROFESSIONAL_KEYWORDS)) {
    return "professional";
  }

  return "retail";
};

// Unified storefront mode: all active products are listed under the main shop.
export const isRetailProduct = (product) => isActiveProduct(product);

// Legacy segmented routes are retained, but no product is blocked from cart by audience.
export const isProfessionalProduct = () => false;

export const isDeviceProduct = () => false;

export const isPurchasableOnline = (product) => isActiveProduct(product);

export const getProfessionalTrustMeta = (product) => {
  const manufacturer =
    product?.manufacturer || product?.brand?.name || product?.company || "Verified Manufacturer";
  const origin =
    product?.origin || product?.countryOfOrigin || product?.importCountry || "Imported Product";

  const certifications = asArray(
    product?.certifications || product?.compliance || product?.qualityMarks
  ).filter(Boolean);

  return {
    manufacturer,
    origin,
    certifications: certifications.length > 0
      ? certifications
      : ["Regulatory Documentation Available", "Quality Verification on Request"],
  };
};
