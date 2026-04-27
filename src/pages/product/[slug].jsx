import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import Wrapper from "@/layout/wrapper";
import ErrorMsg from "@/components/common/error-msg";
import { useGetProductQuery } from "@/redux/features/productApi";
import ProductDetailsBreadcrumb from "@/components/breadcrumb/product-details-breadcrumb";
import ProductDetailsArea from "@/components/product-details/product-details-area";
import PrdDetailsLoader from "@/components/loader/prd-details-loader";
import { isActiveProduct } from "@/utils/product-access";
import {
  buildProductPath,
  buildProductPathFromValues,
  buildProductStructuredData,
  extractProductIdFromSlug,
  getProductMetaDescription,
  getProductSeoKeywords,
  getProductMetaTitle,
} from "@/utils/seo-utils";
import { toSlug } from "@/utils/slug";

const ProductDetailsBySlugPage = ({ query, initialProduct = null }) => {
  const slugValue = query?.slug;
  const productId = extractProductIdFromSlug(slugValue);
  const initialProductId = String(initialProduct?._id || initialProduct?.id || "")
    .trim()
    .toLowerCase();
  const shouldFetchLiveProduct = Boolean(productId) && initialProductId !== productId;

  const {
    data: fetchedProduct,
    isLoading,
    isError,
  } = useGetProductQuery(productId, { skip: !productId || !shouldFetchLiveProduct });

  const product = fetchedProduct || initialProduct || null;
  const pending = !product && isLoading;
  const requestFailed = !product && !isLoading && isError;

  const canonical = product
    ? buildProductPath(product)
    : buildProductPathFromValues({ id: productId, title: slugValue, slug: slugValue });
  const pageTitle = product ? getProductMetaTitle(product) : "Product | NEES Medical";
  const pageDescription = product
    ? getProductMetaDescription(product)
    : "Shop premium skincare in Lahore, Pakistan with same-day delivery on selected items.";
  const structuredData = buildProductStructuredData({
    product,
    canonicalPath: canonical,
  });

  let content = null;

  if (!productId && !product) {
    content = <ErrorMsg msg="Invalid product URL." />;
  } else if (pending) {
    content = <PrdDetailsLoader loading={isLoading} />;
  } else if (requestFailed) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (product) {
    if (!isActiveProduct(product)) {
      content = <ErrorMsg msg="This product is currently inactive." />;
    } else {
      content = (
        <>
          <ProductDetailsBreadcrumb
            category={product?.category?.name || "Products"}
            title={product.title}
          />
          <ProductDetailsArea productItem={product} />
        </>
      );
    }
  }

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical={canonical}
        image={product?.img}
        type="product"
        keywords={product ? getProductSeoKeywords(product) : ""}
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductDetailsBySlugPage;

export const getServerSideProps = async (context) => {
  const { query } = context;
  const slugValue = query?.slug;
  const safeSlug = String(Array.isArray(slugValue) ? slugValue[0] : slugValue || "").trim();
  const productId = extractProductIdFromSlug(safeSlug);

  if (!safeSlug) {
    return {
      notFound: true,
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return {
      props: {
        query,
        initialProduct: null,
      },
    };
  }

  try {
    let initialProduct = null;
    const collectProducts = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.products)) return payload.products;
      return [];
    };

    const bySlugResponse = await fetch(
      `${baseUrl}/api/product/single-product-by-slug/${encodeURIComponent(safeSlug)}`
    );

    if (bySlugResponse.ok) {
      initialProduct = await bySlugResponse.json();
    } else if (productId) {
      const byIdResponse = await fetch(`${baseUrl}/api/product/single-product/${productId}`);
      if (byIdResponse.ok) {
        initialProduct = await byIdResponse.json();
      }
    } else {
      const shopListResponse = await fetch(`${baseUrl}/api/product/shop-list`);
      if (shopListResponse.ok) {
        const shopListPayload = await shopListResponse.json();
        let shopProducts = collectProducts(shopListPayload);
        if (!shopProducts.length) {
          const allProductsResponse = await fetch(`${baseUrl}/api/product/all`);
          if (allProductsResponse.ok) {
            const allProductsPayload = await allProductsResponse.json();
            shopProducts = collectProducts(allProductsPayload);
          }
        }
        const requestedSlug = toSlug(safeSlug);
        const matchedProduct = shopProducts.find((item) => {
          const slugCandidate = toSlug(item?.slug || item?.title);
          return slugCandidate && slugCandidate === requestedSlug;
        });

        const matchedId = String(matchedProduct?._id || matchedProduct?.id || "");
        if (matchedId) {
          const byMatchedIdResponse = await fetch(
            `${baseUrl}/api/product/single-product/${encodeURIComponent(matchedId)}`
          );
          if (byMatchedIdResponse.ok) {
            initialProduct = await byMatchedIdResponse.json();
          }
        }
      }
    }

    if (!initialProduct || typeof initialProduct !== "object" || !isActiveProduct(initialProduct)) {
      return { notFound: true };
    }

    const requestedSlug = safeSlug;
    const canonicalPath = buildProductPath(initialProduct);
    const requestedPath = `/product/${requestedSlug}`;

    if (requestedSlug && requestedPath !== canonicalPath) {
      return {
        redirect: {
          destination: canonicalPath,
          permanent: true,
        },
      };
    }

    return {
      props: {
        query,
        initialProduct,
      },
    };
  } catch (error) {
    console.error("Failed to resolve product slug on server:", error);
    return {
      props: {
        query,
        initialProduct: null,
      },
    };
  }
};
