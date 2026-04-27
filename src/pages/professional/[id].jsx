import React from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import ErrorMsg from "@/components/common/error-msg";
import { useGetProductQuery } from "@/redux/features/productApi";
import ProfessionalDetailLayout from "@/components/b2b/professional-detail-layout";
import {
  getProfessionalTrustMeta,
  isActiveProduct,
  isProfessionalProduct,
} from "@/utils/product-access";
import {
  buildProductStructuredData,
  getProductMetaDescription,
  getProductName,
} from "@/utils/seo-utils";
import { getClinicalCategoryName } from "@/config/clinical-categories";

const getProfessionalMetaTitle = (product) => {
  const productName = getProductName(product);
  return `${productName} Professional Inquiry in Pakistan | NEES Medical`;
};

const getProfessionalMetaDescription = (product) => {
  if (!product) {
    return "Explore professional-use clinical products in Lahore, Pakistan with dedicated support.";
  }

  const productName = getProductName(product);
  const categoryName = getClinicalCategoryName(product);
  const trustMeta = getProfessionalTrustMeta(product);

  return `${productName} is available through NEES Medical for professional inquiry in Pakistan. Explore ${categoryName.toLowerCase()} details, sourcing support, and direct clinic sales assistance. ${trustMeta.origin}.`;
};

const getProfessionalKeywords = (product) => {
  if (!product) {
    return "clinical products pakistan, professional injectables lahore";
  }

  const productName = getProductName(product);
  const categoryName = getClinicalCategoryName(product);
  const brandName = String(product?.brand?.name || product?.manufacturer || "NEES Medical").trim();

  return [
    productName,
    `${productName} pakistan`,
    `${productName} professional inquiry`,
    `${productName} lahore`,
    `${brandName} ${productName}`.trim(),
    `${categoryName} pakistan`,
    `${categoryName} lahore`,
    "clinical products pakistan",
    "professional injectables lahore",
    "clinic use only products",
  ]
    .filter(Boolean)
    .join(", ");
};

const ProfessionalProductDetailPage = ({ query }) => {
  const { data: product, isLoading, isError } = useGetProductQuery(query.id);
  const pageTitle = product ? getProfessionalMetaTitle(product) : "Professional Product";
  const pageDescription = product
    ? getProfessionalMetaDescription(product)
    : "Explore professional-use clinical products in Lahore, Pakistan with dedicated support.";
  const pageKeywords = getProfessionalKeywords(product);
  const canonical = query?.id ? `/professional/${query.id}` : "/professional";
  const productStructuredData = buildProductStructuredData({ product, canonicalPath: canonical });
  const faqStructuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How can I inquire about ${getProductName(product)} from NEES Medical?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "Use the direct sales contact options on this page to request pricing, availability, and professional product guidance from NEES Medical.",
            },
          },
          {
            "@type": "Question",
            name: "Is this product handled through professional inquiry?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Professional-use products are handled through direct inquiry so the team can confirm fit, current availability, and procurement details before order confirmation.",
            },
          },
        ],
      }
    : null;
  const structuredData = faqStructuredData
    ? [productStructuredData, faqStructuredData].filter(Boolean)
    : productStructuredData;

  let content = null;

  if (isLoading) {
    content = <p className="text-center">Loading product details...</p>;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error loading this product." />;
  }

  if (!isLoading && !isError && product) {
    content = isActiveProduct(product) && isProfessionalProduct(product) ? (
      <ProfessionalDetailLayout product={product} />
    ) : (
      <ErrorMsg msg="This product is inactive or not categorized under professional use." />
    );
  }

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical={canonical}
        image={product?.img}
        type="product"
        keywords={pageKeywords}
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Professional Product" subtitle="Professional Details" bg_clr={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProfessionalProductDetailPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
