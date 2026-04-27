import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { getProductImageAlt } from "@/utils/seo-utils";

const ProfessionalProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleOpenDetails = () => {
    dispatch(handleProductModal(product));
  };
  const productPath = `/professional/${product?._id || ""}`;

  return (
    <article className="nees-prof-card nees-prof-card-minimal h-100">
      <div className="nees-prof-card-media">
        <Link href={productPath} className="d-block">
          <Image src={product.img} alt={getProductImageAlt(product)} width={360} height={320} />
        </Link>
      </div>

      <div className="nees-prof-card-content">
        <h3>
          <Link href={productPath} className="nees-prof-title-btn d-inline-block">
            {product.title}
          </Link>
        </h3>
        <button
          type="button"
          className="tp-btn tp-btn-sm tp-btn-border mt-10"
          onClick={handleOpenDetails}
        >
          Quick View
        </button>
      </div>
    </article>
  );
};

export default ProfessionalProductCard;
