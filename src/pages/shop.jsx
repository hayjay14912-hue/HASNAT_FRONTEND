import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery, useGetShopProductsQuery } from "@/redux/features/productApi";
import { useGetShowCategoryQuery } from "@/redux/features/categoryApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopLoader from "@/components/loader/shop/shop-loader";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";
import { normalizeQuerySlug, resolveRetailCategoryQuery, toSlug } from "@/utils/slug";

const ShopFilterOffCanvas = dynamic(
  () => import("@/components/common/shop-filter-offcanvas"),
  { ssr: false }
);

const SHOP_CACHE_KEY = "nees:shop:retail-products:v1";

const getProductsFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
};

const readShopCache = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(SHOP_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeShopCache = (products) => {
  if (typeof window === "undefined") return;
  if (!Array.isArray(products) || products.length === 0) return;
  try {
    window.sessionStorage.setItem(SHOP_CACHE_KEY, JSON.stringify(products));
  } catch {
    // ignore storage quota/private mode failures
  }
};

const ShopPage = () => {
  const router = useRouter();
  const { query } = router;
  const selectedCategorySlug = resolveRetailCategoryQuery(query?.category);
  const {
    data: shopProducts,
    isError: isShopError,
    isLoading: isShopLoading,
    isFetching: isShopFetching,
  } = useGetShopProductsQuery();
  const shopProductList = getProductsFromPayload(shopProducts);
  const shouldFetchAllFallback = !isShopLoading && !isShopFetching && shopProductList.length === 0;
  const {
    data: allProducts,
    isError: isAllError,
    isLoading: isAllLoading,
    isFetching: isAllFetching,
  } = useGetAllProductsQuery(undefined, {
    skip: !shouldFetchAllFallback,
  });
  const allProductList = getProductsFromPayload(allProducts);
  const { data: categoriesData } = useGetShowCategoryQuery(undefined, {
    skip: !selectedCategorySlug,
  });
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [cachedProducts, setCachedProducts] = useState([]);

  useEffect(() => {
    setCachedProducts(readShopCache());
  }, []);

  useEffect(() => {
    const liveProducts = shopProductList.length > 0 ? shopProductList : allProductList;
    if (liveProducts.length > 0) {
      writeShopCache(liveProducts);
      setCachedProducts(liveProducts);
    }
  }, [shopProductList, allProductList]);

  const sourceProducts = shopProductList.length > 0
    ? shopProductList
    : allProductList.length > 0
      ? allProductList
      : cachedProducts;
  const isLoading = isShopLoading || isShopFetching || (shouldFetchAllFallback && (isAllLoading || isAllFetching));
  const isError = isShopError && (!shouldFetchAllFallback || isAllError);

  // Load the maximum price once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && sourceProducts.length > 0) {
      const retailProducts = sourceProducts.filter(
        (item) => isActiveProduct(item) && isRetailProduct(item)
      );
      const maxPrice = retailProducts.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, sourceProducts]);

  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setCurrPage(1);
    setSelectValue(e.value);
  };

  // other props
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };
  // decide what to render
  let content = null;
  const selectedCategoryLabel = selectedCategorySlug
    ? selectedCategorySlug.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
    : "";
  const pageTitle = selectedCategoryLabel
    ? `${selectedCategoryLabel} Products`
    : "Shop Skincare Products";
  const pageDescription = selectedCategoryLabel
    ? `Browse ${selectedCategoryLabel} products from NEES Medical. Compare formulas, benefits, and pricing with clear product details and fast checkout.`
    : "Browse NEES Medical retail skincare products by category, concern, and ingredient with transparent pricing and trusted formulations.";
  const canonical = selectedCategorySlug ? `/shop?category=${selectedCategorySlug}` : "/shop";

  if (isLoading && sourceProducts.length === 0) {
    content = <ShopLoader loading={isLoading}/>;
  }
  if (!isLoading && isError && sourceProducts.length === 0) {
    content = <div className="pb-80 text-center"><ErrorMsg msg="There was an error" /></div>;
  }
  if (!isLoading && !isError && sourceProducts.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if ((!isLoading || sourceProducts.length > 0) && sourceProducts.length > 0) {
    const retailProducts = sourceProducts.filter(
      (item) => isActiveProduct(item) && isRetailProduct(item)
    );
    if (retailProducts.length === 0) {
      content = <ErrorMsg msg="No retail products found!" />;
    } else {
      // products
      let product_items = retailProducts;
      // select short filtering
      if (selectValue) {
        if (selectValue === "Recommended") {
          product_items = retailProducts;
        } else if (selectValue === "Price: Low to High") {
          product_items = retailProducts
            .slice()
            .sort((a, b) => Number(a.price) - Number(b.price));
        } else if (selectValue === "Price: High to Low") {
          product_items = retailProducts
            .slice()
            .sort((a, b) => Number(b.price) - Number(a.price));
        } else if (selectValue === "Newest") {
          product_items = retailProducts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (selectValue === "Promotions") {
          product_items = retailProducts.filter((p) => p.discount > 0);
        } else {
          product_items = retailProducts;
        }
      }
      // price filter
      product_items = product_items.filter(
        (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
      );

      // status filter
      if (query.status) {
        if (query.status === "on-sale") {
          product_items = product_items.filter((p) => p.discount > 0);
        } else if (query.status === "in-stock") {
          product_items = product_items.filter((p) => p.status === "in-stock");
        }
      }

      // category filter
      const selectedCategory = resolveRetailCategoryQuery(query.category);
      if (selectedCategory) {
        const categoryItems = Array.isArray(categoriesData?.result)
          ? categoriesData.result
          : [];
        const matchedCategory = categoryItems.find(
          (category) => toSlug(category?.parent || category?.name) === selectedCategory
        );
        const categoryProductIds = new Set(
          (matchedCategory?.products || [])
            .map((entry) =>
              String(
                typeof entry === "string"
                  ? entry
                  : entry?._id || entry?.id || ""
              )
            )
            .filter(Boolean)
        );

        product_items = product_items.filter((p) => {
          const productCategoryId = String(p?.category?.id || p?.category?._id || "");
          const productCategorySlug = toSlug(p?.category?.name);
          const productId = String(p?._id || p?.id || "");

          if (categoryProductIds.has(productId)) return true;
          if (productCategorySlug && productCategorySlug === selectedCategory) return true;
          if (!productCategoryId && !productCategorySlug) {
            return toSlug(p?.parent) === selectedCategory;
          }
          return false;
        });
      }

      // category filter
      if (query.subCategory) {
        const selectedSubCategory = normalizeQuerySlug(query.subCategory);

        product_items = product_items.filter(
          (p) =>
            toSlug(p?.children) === selectedSubCategory
        );
      }

      // color filter
      if (query.color) {
        const selectedColor = normalizeQuerySlug(query.color);
        product_items = product_items.filter((product) => {
          for (let i = 0; i < product.imageURLs.length; i++) {
            const color = product.imageURLs[i]?.color;
            if (
              color &&
              toSlug(color?.name) === selectedColor
            ) {
              return true; // match found, include product in result
            }
          }
          return false; // no match found, exclude product from result
        });
      }

      // brand filter
      if (query.brand) {
        const selectedBrand = normalizeQuerySlug(query.brand);
        product_items = product_items.filter(
          (p) => toSlug(p?.brand?.name) === selectedBrand
        );
      }

      content = (
        <>
          <ShopArea
            all_products={retailProducts}
            products={product_items}
            otherProps={otherProps}
          />
          <ShopFilterOffCanvas
            all_products={retailProducts}
            otherProps={otherProps}
          />
        </>
      );
    }
  }
  return (
    <Wrapper>
      <SEO pageTitle={pageTitle} description={pageDescription} canonical={canonical} />
      <HeaderThree />
      <section className="aura-shop-hero">
        <div className="container aura-shop-container">
          <div className="aura-shop-hero-inner">
            <h1>Shop</h1>
            <div className="aura-shop-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Shop</span>
            </div>
          </div>
        </div>
      </section>
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;
