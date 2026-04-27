import React, { useState } from "react";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { HomeThreePrdTwoLoader } from "@/components/loader";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";

// tabs
const tabs = ["Best Seller", "New-in"];

const getProductsFromPayload = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  return [];
};

const ProductAreaTwo = ({ initialProducts = null }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const {
    data: allProductsRes,
    isError,
    isLoading,
  } = useGetAllProductsQuery(undefined, { skip: Boolean(initialProducts) });

  const productsPayload = allProductsRes ?? initialProducts;
  const isPrefiltered = Boolean(productsPayload?.prefiltered);

  const retailProducts = getProductsFromPayload(productsPayload).filter((item) =>
    isPrefiltered ? true : isActiveProduct(item) && isRetailProduct(item)
  );
  const featuredProducts = retailProducts.filter(
    (item) => Boolean(item?.feature ?? item?.featured)
  );
  const newInProducts = retailProducts
    .slice()
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 9);

  const products = activeTab === "Best Seller" ? featuredProducts : newInProducts;

  // handleActive
  const handleActive = (tab) => {
    setActiveTab(tab);
  };

  // decide what to render
  let content = null;
  const shouldShowLoading = isLoading && !productsPayload;

  if (shouldShowLoading) {
    content = <HomeThreePrdTwoLoader loading={true} />;
  }
  if (!shouldShowLoading && isError && !productsPayload) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!shouldShowLoading && products.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!shouldShowLoading && products.length > 0) {
    content = (
      <>
        <div className="aura-home-products-head">
          <div className="aura-home-products-title">
            <h3 className="tp-section-title-3">Our Products</h3>
          </div>
          <div className="aura-home-products-tabs" role="tablist" aria-label="Product filters">
            {tabs.map((tab, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleActive(tab)}
                className={activeTab === tab ? "active" : ""}
                aria-pressed={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="aura-home-products-grid">
          {products.map((prd) => (
            <div key={prd._id} className="aura-home-products-item">
              <ProductItem product={prd} />
            </div>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <section className="tp-best-area aura-home-products-section pb-60 pt-80">
        <div className="container">
          {!shouldShowLoading && products.length > 0 ? (
            content
          ) : (
            <div className="aura-home-products-state">{content}</div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductAreaTwo;
