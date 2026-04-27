import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetActiveBrandsQuery } from "@/redux/features/brandApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopBrandLoader from "@/components/loader/shop/shop-brand-loader";

const ProductBrand = ({setCurrPage,shop_right=false}) => {
  const { data: brands, isError, isLoading } = useGetActiveBrandsQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  // handle brand route 
  const handleBrandRoute = (brand) => {
    setCurrPage(1);
    router.push(
      `/${shop_right?'shop-right-sidebar':'shop'}?brand=${brand
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    )
    dispatch(handleFilterSidebarClose());
  }
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopBrandLoader loading={isLoading}/>;
  } else if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (!isLoading && !isError && brands?.result?.length === 0) {
    content = <ErrorMsg msg="No Brands found!" />;
  } else if (!isLoading && !isError && brands?.result?.length > 0) {
    const all_brands = brands.result;
    const sortedBrands = all_brands.slice().sort((a, b) => b.products.length - a.products.length);
    const brand_items = sortedBrands.slice(0,12);
    
    content = (
      <div className="tp-chip-group">
        {brand_items.map((b) => (
          <button key={b._id} onClick={() => handleBrandRoute(b.name)} type="button" className={`tp-chip ${router.query.brand === b.name.toLowerCase().replace("&", "").split(" ").join("-") ? 'active' : ''}`}>
            <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <Image src={b.logo} alt="brand" width={22} height={18} /> {b.name}
            </span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="tp-shop-widget mb-50 tp-form-pro">
        <h3 className="tp-shop-widget-title">Popular Brands</h3>
        <div className="tp-shop-widget-content ">
          {content}
        </div>
      </div>
    </>
  );
};

export default ProductBrand;
