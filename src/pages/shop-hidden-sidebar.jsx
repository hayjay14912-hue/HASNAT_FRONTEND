import React, { useState,useEffect } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import ShopHiddenSidebarArea from "@/components/shop/shop-hidden-sidebar-area";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import Footer from "@/layout/footers/footer";
import ShopHiddenLoader from "@/components/loader/shop/shop-hidden-loader";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";

const ShopHiddenSidebarPage = () => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [priceValue, setPriceValue] = useState([0, 0]);

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

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setCurrPage(1);
    setSelectValue(e.value);
  };
  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1)
    setPriceValue(val);
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

  if (isLoading) {
    content = <ShopHiddenLoader loading={isLoading}  />;
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
        if (selectValue === "Default Sorting") {
          product_items = retailProducts;
        } else if (selectValue === "Low to High") {
          product_items = retailProducts
            .slice()
            .sort((a, b) => Number(a.price) - Number(b.price));
        } else if (selectValue === "High to Low") {
          product_items = retailProducts
            .slice()
            .sort((a, b) => Number(b.price) - Number(a.price));
        } else if (selectValue === "New Added") {
          product_items = retailProducts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (selectValue === "On Sale") {
          product_items = retailProducts.filter((p) => p.discount > 0);
        } else {
          product_items = retailProducts;
        }
      }

      content = (
        <>
          <ShopHiddenSidebarArea
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
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Hidden Sidebar" subtitle="Shop Hidden Sidebar" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopHiddenSidebarPage;
