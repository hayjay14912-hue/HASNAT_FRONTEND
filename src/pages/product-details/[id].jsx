import React from 'react';
// internal
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductQuery } from '@/redux/features/productApi';
import ProductDetailsBreadcrumb from '@/components/breadcrumb/product-details-breadcrumb';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import PrdDetailsLoader from '@/components/loader/prd-details-loader';
import { isActiveProduct } from "@/utils/product-access";
import {
  buildProductPath,
  buildProductPathFromValues,
  buildProductStructuredData,
  getProductMetaDescription,
  getProductMetaTitle,
} from "@/utils/seo-utils";

const ProductDetailsPage = ({ query }) => {
  const { data: product, isLoading, isError } = useGetProductQuery(query.id);
  const canonical = product
    ? buildProductPath(product)
    : buildProductPathFromValues({ id: query?.id });
  const pageTitle = product ? getProductMetaTitle(product) : "Product | NEES Medical";
  const pageDescription = product
    ? getProductMetaDescription(product)
    : "Shop premium skincare in Lahore, Pakistan with same-day delivery on selected items.";
  const structuredData = buildProductStructuredData({
    product,
    canonicalPath: canonical,
  });
  // decide what to render
  let content = null;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && product) {
    if (!isActiveProduct(product)) {
      content = <ErrorMsg msg="This product is currently inactive." />;
      return (
        <Wrapper>
          <SEO
            pageTitle={pageTitle}
            description={pageDescription}
            canonical={canonical}
            image={product?.img}
            type="product"
            structuredData={structuredData}
          />
          <HeaderTwo style_2={true} />
          {content}
          <Footer primary_style={true} />
        </Wrapper>
      );
    }
    content = (
      <>
        <ProductDetailsBreadcrumb category={product?.category?.name || "Products"} title={product.title} />
        <ProductDetailsArea productItem={product} />
      </>
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
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductDetailsPage;

export const getServerSideProps = async (context) => {
  const { query } = context;
  const productId = typeof query?.id === "string" ? query.id.trim() : "";
  let redirectPath = productId ? `/product/${productId}` : "";

  if (productId && process.env.NEXT_PUBLIC_API_BASE_URL) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/single-product/${productId}`
      );
      if (response.ok) {
        const product = await response.json();
        if (product && typeof product === "object") {
          redirectPath = buildProductPath(product);
        }
      }
    } catch (error) {
      console.error("Failed to resolve product slug redirect:", error);
    }
  }

  if (productId) {
    return {
      redirect: {
        destination: redirectPath,
        permanent: true,
      },
    };
  }

  return {
    props: {
      query,
    },
  };
};
