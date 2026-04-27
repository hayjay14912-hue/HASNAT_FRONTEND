import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ErrorMsg from "@/components/common/error-msg";
import SearchPrdLoader from "@/components/loader/search-prd-loader";
import SEO from "@/components/seo";
import Footer from "@/layout/footers/footer";
import HeaderThree from "@/layout/headers/header-3";
import Wrapper from "@/layout/wrapper";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { isActiveProduct } from "@/utils/product-access";
import { matchProductBySearch } from "@/utils/search";

const ShopFilterOffCanvas = dynamic(
  () => import("@/components/common/shop-filter-offcanvas"),
  { ssr: false }
);

const normalizeSearchValue = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getQueryString = (value) => (typeof value === "string" ? value.trim() : "");

export default function SearchPage({ query }) {
  const rawSearchText = getQueryString(query?.searchText || query?.text || query?.q);
  const rawProductType = getQueryString(query?.productType || query?.type);
  const pageTitle = rawSearchText
    ? `${rawSearchText} Search Results | NEES Medical`
    : "Search Skincare Products | NEES Medical";
  const pageDescription = rawSearchText
    ? `Explore NEES Medical products matching "${rawSearchText}" with price, availability, and delivery details.`
    : "Search NEES Medical skincare catalog by product name, category, and concern.";
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const activeProducts = products.data.filter((item) => isActiveProduct(item));
      const maxPrice = activeProducts.reduce((max, product) => {
        const price = Number(product?.price || 0);
        return price > max ? price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, products]);

  useEffect(() => {
    setCurrPage(1);
  }, [rawSearchText, rawProductType]);

  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  const selectHandleFilter = (e) => {
    setCurrPage(1);
    setSelectValue(e.value);
  };

  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };

  let content = null;

  if (isLoading) {
    content = <SearchPrdLoader loading={isLoading} />;
  }

  if (!isLoading && isError) {
    content = <div className="pb-80 text-center"><ErrorMsg msg="There was an error" /></div>;
  }

  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No products found!" />;
  }

  if (!isLoading && !isError && products?.data?.length > 0) {
    const all_products = products.data.filter((item) => isActiveProduct(item));
    let product_items = all_products;

    if (rawProductType) {
      const normalizedType = normalizeSearchValue(rawProductType);
      product_items = product_items.filter(
        (prd) => normalizeSearchValue(prd?.productType) === normalizedType
      );
    }

    if (rawSearchText) {
      product_items = product_items.filter((prd) =>
        matchProductBySearch(prd, rawSearchText)
      );
    }

    if (selectValue) {
      if (selectValue === "Recommended") {
        product_items = product_items.slice();
      } else if (selectValue === "Price: Low to High") {
        product_items = product_items
          .slice()
          .sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "Price: High to Low") {
        product_items = product_items
          .slice()
          .sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "Newest") {
        product_items = product_items
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectValue === "Promotions") {
        product_items = product_items.filter((p) => Number(p.discount || 0) > 0);
      }
    }

    product_items = product_items.filter((p) => {
      const price = Number(p?.price || 0);
      return price >= priceValue[0] && price <= priceValue[1];
    });

    content = (
      <>
        <ShopArea
          all_products={all_products}
          products={product_items}
          otherProps={otherProps}
        />
        <ShopFilterOffCanvas
          all_products={all_products}
          otherProps={otherProps}
        />
      </>
    );
  }

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical="/search"
        noIndex={true}
      />
      <HeaderThree />
      <section className="aura-shop-hero">
        <div className="container aura-shop-container">
          <div className="aura-shop-hero-inner">
            <h1>Shop</h1>
            <div className="aura-shop-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>{rawSearchText ? `Search: ${rawSearchText}` : "Search"}</span>
            </div>
          </div>
        </div>
      </section>
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
