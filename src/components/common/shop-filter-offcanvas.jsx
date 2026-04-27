import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryFilter from "../shop/shop-filter/category-filter";
import PriceFilter from "../shop/shop-filter/price-filter";
import StatusFilter from "../shop/shop-filter/status-filter";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ResetButton from "../shop/shop-filter/reset-button";

const ShopFilterOffCanvas = ({
  all_products,
  otherProps,
  right_side = false,
}) => {
  const { priceFilterValues, setCurrPage } = otherProps;
  const { filterSidebar } = useSelector((state) => state.shopFilter);
  const dispatch = useDispatch();

  // max price
  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  return (
    <>
      <div className={`tp-filter-offcanvas-area aura-shop-filter-drawer ${filterSidebar ? "offcanvas-opened" : ""}`}>
        <div className="tp-filter-offcanvas-wrapper">
          <div className="tp-filter-offcanvas-close">
            <button
              type="button"
              onClick={() => dispatch(handleFilterSidebarClose())}
              className="tp-filter-offcanvas-close-btn filter-close-btn"
            >
              <i className="fa-solid fa-xmark"></i>
              {" "}Close
            </button>
          </div>
          <div className="tp-shop-sidebar aura-shop-filter-sidebar">
            <div className="aura-shop-filter-head">
              <h3>Refine Your Selection</h3>
              <p>Filter by concern, status, and price.</p>
            </div>
            {/* filter */}
            <PriceFilter
              priceFilterValues={priceFilterValues}
              maxPrice={maxPrice}
            />
            {/* status */}
            <StatusFilter setCurrPage={setCurrPage} shop_right={right_side} />
            {/* categories */}
            <CategoryFilter setCurrPage={setCurrPage} shop_right={right_side} />
            {/* reset filter */}
            <ResetButton shop_right={right_side} />
          </div>
        </div>
      </div>

      {/* overlay start */}
      <div
        onClick={() => dispatch(handleFilterSidebarClose())}
        className={`body-overlay ${filterSidebar ? "opened" : ""}`}
      ></div>
      {/* overlay end */}
    </>
  );
};

export default ShopFilterOffCanvas;
