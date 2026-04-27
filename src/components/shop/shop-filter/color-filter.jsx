import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopColorLoader from "@/components/loader/shop/color-filter-loader";

const ColorFilter = ({ setCurrPage, shop_right = false, allProducts = [] }) => {
  const shouldUseFallbackQuery = allProducts.length === 0;
  const { data: products, isError, isLoading } = useGetAllProductsQuery(undefined, {
    skip: !shouldUseFallbackQuery,
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const productItems = shouldUseFallbackQuery ? products?.data || [] : allProducts;

  // handle color 
  const handleColor = (clr) => {
    setCurrPage(1);
    router.push(
      `/${shop_right?'shop-right-sidebar':'shop'}?color=${clr
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
    dispatch(handleFilterSidebarClose());
  };
  // decide what to render
  let content = null;

  if (shouldUseFallbackQuery && isLoading) {
    content = <ShopColorLoader loading={isLoading}/>;
  }
  if (shouldUseFallbackQuery && !isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!shouldUseFallbackQuery && productItems.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (shouldUseFallbackQuery && !isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (productItems.length > 0) {
    let allColor = [];
    const colorCount = {};
    productItems.forEach((product) => {
      let uniqueColor = new Set((product.imageURLs || []).map((item) => item?.color));
      allColor = [...new Set([...allColor, ...uniqueColor])];

      (product.imageURLs || []).forEach((item) => {
        const colorName = item?.color?.name;
        if (!colorName) return;
        colorCount[colorName] = (colorCount[colorName] || 0) + 1;
      });
    });

    const seen = {};
    const uniqueColors = [];
    allColor.forEach((color) => {
      if (!color || !color.name || seen[color.name]) return;
      seen[color.name] = true;
      uniqueColors.push(color);
    });
    content = uniqueColors.map((item, i) => {
      if (item) {
        return (
          <li key={i}>
            <div className="tp-shop-widget-checkbox-circle">
              <input
                type="checkbox"
                id={item.name}
                checked={
                  router.query.color ===
                  item.name.toLowerCase().replace("&", "").split(" ").join("-")
                    ? "checked"
                    : false
                }
                readOnly
              />
              <label
                onClick={() => handleColor(item.name)}
                htmlFor={item.name}
              >
                {item.name}
              </label>
              <span
                style={{ backgroundColor: `${item.clrCode}` }}
                className="tp-shop-widget-checkbox-circle-self"
              ></span>
            </div>
            <span className="tp-shop-widget-checkbox-circle-number">
              {colorCount[item?.name] || 0}
            </span>
          </li>
        );
      }
    });
  }

  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">Filter by Color</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-checkbox-circle-list">
            <ul>{content}</ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorFilter;
