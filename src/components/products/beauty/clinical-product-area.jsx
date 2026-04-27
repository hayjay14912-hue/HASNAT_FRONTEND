import React from "react";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { useGetAllProductsQuery, useGetProductTypeQuery } from "@/redux/features/productApi";
import { HomeThreePrdTwoLoader } from "@/components/loader";
import { isActiveProduct } from "@/utils/product-access";

const isClinicalProduct = (item) => {
  const type = String(item?.productType || item?.type || "").toLowerCase();
  const parent = String(item?.parent || "").toLowerCase();
  return type === "clinical" || parent === "clinical";
};

const ClinicalProductArea = () => {
  const {
    data: clinicalRes,
    isError: isClinicalError,
    isLoading: isClinicalLoading,
  } = useGetProductTypeQuery({ type: "clinical" });

  const clinicalItems = (clinicalRes?.data || []).filter((item) => isActiveProduct(item));
  const shouldFallbackToAll = isClinicalError || (!isClinicalLoading && clinicalItems.length === 0);

  const {
    data: allProductsRes,
    isError: isAllError,
    isLoading: isAllLoading,
  } = useGetAllProductsQuery(undefined, {
    skip: !shouldFallbackToAll,
  });

  const products =
    clinicalItems.length > 0
      ? clinicalItems
      : (allProductsRes?.data || []).filter(
          (item) => isActiveProduct(item) && isClinicalProduct(item)
        );

  let content = null;
  if (isClinicalLoading || (shouldFallbackToAll && isAllLoading)) {
    content = <HomeThreePrdTwoLoader loading={true} />;
  } else if ((!shouldFallbackToAll || isAllError) && isClinicalError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (products.length === 0) {
    content = <ErrorMsg msg="No Clinical Products found!" />;
  } else {
    const items = products
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    content = (
      <>
        <div className="aura-home-products-head">
          <div className="aura-home-products-title">
            <h3 className="tp-section-title-3">Clinical Products</h3>
            <p className="mb-0">Inquiry only. Order via email or WhatsApp.</p>
          </div>
        </div>
        <div className="aura-home-products-grid">
          {items.map((prd) => (
            <div key={prd._id} className="aura-home-products-item">
              <ProductItem product={prd} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <section className="tp-best-area aura-home-products-section pb-60 pt-20">
      <div className="container">
        {products.length > 0 ? (
          content
        ) : (
          <div className="aura-home-products-state">{content}</div>
        )}
      </div>
    </section>
  );
};

export default ClinicalProductArea;
