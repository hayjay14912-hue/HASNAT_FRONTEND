import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
// internal
import { Filter } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import {handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";

const ShopTopRight = ({selectHandleFilter}) => {
  const dispatch = useDispatch()
  return (
    <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
      <div className="tp-shop-top-select">
        <NiceSelect
          options={[
            { value: "Recommended", text: "Recommended" },
            { value: "Price: Low to High", text: "Price: Low to High" },
            { value: "Price: High to Low", text: "Price: High to Low" },
            { value: "Newest", text: "Newest" },
            { value: "Promotions", text: "Promotions" },
          ]}
          defaultCurrent={0}
          onChange={selectHandleFilter}
          name="Recommended"
        />
      </div>
      <div className="tp-shop-top-filter">
        <button onClick={()=> dispatch(handleFilterSidebarOpen())} type="button" className="tp-filter-btn">
          <span>
            <Filter />
          </span>
          {" "}Filter
        </button>
      </div>
      <div className="tp-shop-top-filter tp-shop-top-b2b-link">
        <Link href="/request-pricing" className="tp-filter-btn">
          Product Inquiry
        </Link>
      </div>
    </div>
  );
};

export default ShopTopRight;
