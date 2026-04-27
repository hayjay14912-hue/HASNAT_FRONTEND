import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { useGetShowCategoryQuery } from "@/redux/features/categoryApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopRightArea from "@/components/shop/shop-right-area";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";
import { normalizeQuerySlug, resolveRetailCategoryQuery, toSlug } from "@/utils/slug";

const ShopRightSidebarPage = () => {
  const { query } = useRouter();
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const { data: categoriesData } = useGetShowCategoryQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  // Load the maximum price once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const retailProducts = products.data.filter(
        (item) => isActiveProduct(item) && isRetailProduct(item)
      );
      const maxPrice = retailProducts.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, products]);

  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1)
    setPriceValue(val);
  };

  // selectHandleFilter
  const selectHandleFilter = e => {
    setCurrPage(1);
    setSelectValue(e.value)
  }

  // other props 
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  }
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} shopRight={true}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const retailProducts = products.data.filter(
      (item) => isActiveProduct(item) && isRetailProduct(item)
    );

    if (retailProducts.length === 0) {
      content = <ErrorMsg msg="No retail products found!" />;
    } else {
      // products
      let product_items = retailProducts;
      // select short filtering
      if (selectValue) {
        if (selectValue === 'Default Sorting') {
          product_items = retailProducts
        }
        else if (selectValue === 'Low to High') {
          product_items = retailProducts.slice().sort((a, b) => Number(a.price) - Number(b.price));
        }
        else if (selectValue === 'High to Low') {
          product_items = retailProducts.slice().sort((a, b) => Number(b.price) - Number(a.price));
        }
        else if (selectValue === 'New Added') {
          product_items = retailProducts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        else if (selectValue === 'On Sale') {
          product_items = retailProducts.filter(p => p.discount > 0);
        }
        else {
          product_items = retailProducts
        }
      }
      // price filter
      product_items = product_items.filter(
        (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
      );

      // status filter
      if (query.status) {
        if (query.status === 'on-sale') {
          product_items = product_items.filter(p => p.discount > 0)
        }
        else if (query.status === 'in-stock') {
          product_items = product_items.filter(p => p.status === 'in-stock')
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

      // color filter
      if (query.color) {
        const selectedColor = normalizeQuerySlug(query.color);
        product_items = product_items.filter(product => {
          for (let i = 0; i < product.imageURLs.length; i++) {
            const color = product.imageURLs[i]?.color;
            if (color && toSlug(color?.name) === selectedColor) {
              return true; // match found, include product in result
            }
          }
          return false; // no match found, exclude product from result
        })
      }

      // brand filter
      if (query.brand) {
        const selectedBrand = normalizeQuerySlug(query.brand);
        product_items = product_items.filter(p => toSlug(p?.brand?.name) === selectedBrand)
      }

      content = (
        <>
          <ShopRightArea
            all_products={retailProducts}
            products={product_items}
            otherProps={otherProps}
            right_side={true}
          />
          <ShopFilterOffCanvas
            all_products={retailProducts}
            otherProps={otherProps}
            right_side={true}
          />
        </>
      );
    }
  }
  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Right Sidebar" subtitle="Shop Right Sidebar" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopRightSidebarPage;
