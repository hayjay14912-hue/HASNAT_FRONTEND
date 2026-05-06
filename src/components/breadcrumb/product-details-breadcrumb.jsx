import React from 'react';
import Link from "next/link";

const ProductDetailsBreadcrumb = ({ category, title }) => {
  const safeCategory = String(category || "Products").trim();
  const safeCategorySlug = safeCategory
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  return (
    <section className="aura-pdp-breadcrumb">
      <div className="container">
        <nav className="aura-pdp-breadcrumb-list" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(safeCategorySlug)}`}>{safeCategory}</Link>
          <span>/</span>
          <strong>{title}</strong>
        </nav>
      </div>
    </section>
  )
};

export default ProductDetailsBreadcrumb;
