import { getClinicalCategoryName } from "@/config/clinical-categories";
import { getProfessionalTrustMeta } from "@/utils/product-access";
import {
  buildProductStructuredData,
  ensureAbsoluteUrl,
  getProductCategoryName,
  getProductMetaDescription,
  getProductName,
  getProductSeoKeywords,
  getSiteUrl,
} from "@/utils/seo-utils";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

const unique = (items = []) =>
  Array.from(new Set((Array.isArray(items) ? items : []).map((item) => normalizeText(item)).filter(Boolean)));

const sanitizeFaqItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => ({
      question: normalizeText(item?.question),
      answer: normalizeText(item?.answer),
    }))
    .filter((item) => item.question && item.answer);

export const getVisibleProfessionalFaqItems = (product) => {
  const existingFaqItems = sanitizeFaqItems(product?.faqItems);
  if (existingFaqItems.length > 0) {
    return existingFaqItems.slice(0, 6);
  }

  const productName = getProductName(product);

  return [
    {
      question: `How can I inquire about ${productName} from NEES Medical?`,
      answer:
        "Use the request pricing or sales contact options on this page to confirm current availability, pricing, and the right procurement path for your clinic or practice.",
    },
    {
      question: `Is ${productName} handled through professional inquiry?`,
      answer:
        "Yes. Clinical and professional-use products are handled through direct inquiry so the team can confirm product fit, current availability, and procurement details before order confirmation.",
    },
    {
      question: `What should I verify before buying ${productName} in Pakistan?`,
      answer:
        "Confirm current availability, packaging condition, batch details, intended use, and whether the product matches your clinic workflow before finalizing the order.",
    },
  ];
};

export const getProfessionalMetaTitle = (product) => {
  const customMetaTitle = normalizeText(product?.seo?.metaTitle);
  if (customMetaTitle) {
    return customMetaTitle;
  }

  return `${getProductName(product)} Professional Inquiry in Pakistan | NEES Medical`;
};

export const getProfessionalMetaDescription = (product) => {
  const customMetaDescription = normalizeText(product?.seo?.metaDescription);
  if (customMetaDescription) {
    return customMetaDescription;
  }

  if (!product) {
    return "Explore professional-use clinical products in Pakistan with dedicated support from NEES Medical.";
  }

  const productName = getProductName(product);
  const categoryName = getClinicalCategoryName(product);
  const trustMeta = getProfessionalTrustMeta(product);
  const baseDescription = normalizeText(getProductMetaDescription(product));

  if (baseDescription && baseDescription !== getProductMetaDescription({})) {
    return `${baseDescription} Professional inquiry support is available for clinics in Pakistan.`;
  }

  return `${productName} is available through NEES Medical for professional inquiry in Pakistan. Explore ${categoryName.toLowerCase()} details, sourcing support, and direct clinic sales assistance. ${trustMeta.origin}.`;
};

export const getProfessionalKeywords = (product) => {
  if (!product) {
    return "clinical products pakistan, professional injectables lahore";
  }

  const productName = getProductName(product);
  const categoryName = getClinicalCategoryName(product);
  const brandName = normalizeText(product?.brand?.name || product?.manufacturer || "NEES Medical");
  const baseKeywords = String(getProductSeoKeywords(product) || "")
    .split(",")
    .map((entry) => normalizeText(entry))
    .filter(Boolean);

  return unique([
    ...baseKeywords,
    `${productName} professional inquiry`,
    `${productName} clinic use`,
    `${productName} pakistan`,
    `${productName} lahore`,
    `${brandName} ${productName}`.trim(),
    `${categoryName} pakistan`,
    "clinical products pakistan",
    "professional injectables lahore",
    "clinic use only products",
  ]).join(", ");
};

export const getProfessionalH1 = (product) =>
  normalizeText(product?.seo?.h1 || product?.title || "Professional Product");

export const buildProfessionalProductStructuredData = ({ product, canonicalPath = "" } = {}) => {
  if (!product) {
    return undefined;
  }

  const canonicalUrl = ensureAbsoluteUrl(canonicalPath || `/professional/${product?._id || product?.id || ""}`);
  const siteUrl = getSiteUrl();
  const faqItems = getVisibleProfessionalFaqItems(product);
  const productSchema = buildProductStructuredData({ product, canonicalPath });
  const faqSchema = faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : undefined;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Professional Products",
        item: `${siteUrl}/professional`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: getProductCategoryName(product),
        item: `${siteUrl}/professional?category=${encodeURIComponent(
          String(getClinicalCategoryName(product) || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]+/g, "")
            .replace(/\s+/g, "-")
        )}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: getProductName(product),
        item: canonicalUrl,
      },
    ],
  };

  return [productSchema, faqSchema, breadcrumbSchema].filter(Boolean);
};

export const buildClinicalCatalogStructuredData = ({
  title = "Professional Clinical Products",
  description = "",
  canonicalPath = "/professional",
  products = [],
  categoryName = "",
} = {}) => {
  const siteUrl = getSiteUrl();
  const canonicalUrl = ensureAbsoluteUrl(canonicalPath);
  const safeProducts = (Array.isArray(products) ? products : []).filter(Boolean).slice(0, 36);
  const itemListElements = safeProducts.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteUrl}/professional/${product?._id || product?.id || ""}`,
    name: getProductName(product),
  }));

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: canonicalUrl,
    about: categoryName || "Professional Clinical Products",
    isPartOf: {
      "@type": "WebSite",
      name: "NEES Medical",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: safeProducts.length,
      itemListElement: itemListElements,
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${title} Listing`,
    numberOfItems: safeProducts.length,
    itemListElement: itemListElements,
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How are professional products handled on NEES Medical?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Professional and clinical products are handled through direct inquiry so the team can confirm availability, product fit, and procurement details for licensed clinics and advanced buyers in Pakistan.",
        },
      },
      {
        "@type": "Question",
        name: "Can I browse multiple clinical product categories on this page?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The professional catalog groups clinical products by category and also links buyers to keyword-specific routes for higher-intent searches.",
        },
      },
      {
        "@type": "Question",
        name: "What should I confirm before ordering a clinical product?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Confirm current availability, intended use, packaging condition, and any clinic-specific procurement requirements before finalizing the order.",
        },
      },
    ],
  };

  return [collectionPage, itemList, faq];
};
