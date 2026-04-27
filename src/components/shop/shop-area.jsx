import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Pagination from "@/ui/Pagination";
import NiceSelect from "@/ui/nice-select";
import ProductItem from "../products/fashion/product-item";
import { Filter } from "@/svg";
import { handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";
import { resolveRetailCategoryQuery, toSlug } from "@/utils/slug";

const getRetailCategory = (product) => {
  const categoryName = product?.category?.name || product?.parent || "Uncategorized";
  return String(categoryName || "").trim() || "Uncategorized";
};

const ShopArea = ({ all_products = [], products, otherProps }) => {
  const { selectHandleFilter, currPage, setCurrPage } = otherProps;
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(12);
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCategory = resolveRetailCategoryQuery(router.query?.category);

  const paginatedData = (_items, startPage, pageCount) => {
    // Pagination controls the window; sorting/filtering is already resolved in `products`.
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  const visibleProducts = products.slice(pageStart, pageStart + countOfPage);
  const firstVisibleProductId = visibleProducts[0]?._id;
  const categoryStats = useMemo(() => {
    const source = all_products.length ? all_products : products;
    const map = new Map();
    source.forEach((item) => {
      const name = getRetailCategory(item);
      const key = toSlug(name);
      if (!map.has(key)) {
        map.set(key, { key, name, count: 0 });
      }
      map.get(key).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [all_products, products]);

  const groupedVisibleProducts = useMemo(() => {
    const map = new Map();
    visibleProducts.forEach((item) => {
      const name = getRetailCategory(item);
      const key = toSlug(name);
      if (!map.has(key)) {
        map.set(key, { key, name, items: [] });
      }
      map.get(key).items.push(item);
    });

    const ordered = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    if (!selectedCategory) return ordered;

    return ordered.sort((a, b) => {
      if (a.key === selectedCategory) return -1;
      if (b.key === selectedCategory) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [visibleProducts, selectedCategory]);

  return (
    <section className="tp-shop-area aura-shop-section pb-120">
      <div className="container aura-shop-container">
        <div className="aura-shop-shell">
          {categoryStats.length > 0 && (
            <div className="aura-shop-category-links d-flex flex-wrap gap-2 mb-25">
              <Link
                href="/shop"
                className={`tp-btn tp-btn-sm ${!selectedCategory ? "active" : ""}`}
              >
                All Retail Products
              </Link>
              {categoryStats.map((category) => (
                <Link
                  key={category.key}
                  href={`/shop?category=${category.key}`}
                  className={`tp-btn tp-btn-sm ${selectedCategory === category.key ? "active" : ""}`}
                >
                  {category.name} ({category.count})
                </Link>
              ))}
            </div>
          )}

          <div className="aura-shop-toolbar">
            <div className="aura-shop-toolbar-left">
              <p className="aura-shop-result">
                Showing {visibleProducts.length} of {products.length} products
              </p>
              <div className="aura-shop-sort">
                <span>Sort</span>
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
            </div>
            <div className="aura-shop-toolbar-right">
              <button
                onClick={() => dispatch(handleFilterSidebarOpen())}
                type="button"
                className="aura-shop-filter-btn"
              >
                <Filter />
                Filters
              </button>
              <div className="aura-shop-toggle" role="tablist" aria-label="Audience toggle">
                <Link href="/shop" className="active" aria-current="page">
                  Retail
                </Link>
                <Link href="/professional">Clinics</Link>
              </div>
            </div>
          </div>

          {products.length === 0 && (
            <div className="aura-shop-empty">
              <h2>No products found</h2>
              <p>Try adjusting filters, or clear filters to explore the full collection.</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="aura-shop-grouped">
              {groupedVisibleProducts.map((group) => (
                <section key={group.key} className="aura-shop-section-block">
                  <div className="aura-shop-section-head d-flex align-items-end justify-content-between mb-20">
                    <h3 className="tp-section-title mb-0">{group.name}</h3>
                    <span className="tp-product-count">{group.items.length} Products</span>
                  </div>
                  <div className="aura-shop-products-grid">
                    {group.items.map((item, index) => (
                      <div key={item._id} className="aura-shop-product-cell">
                        <ProductItem
                          product={item}
                          shopMode={true}
                          isLcpImage={item._id === firstVisibleProductId && index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="tp-shop-pagination aura-shop-pagination mt-20">
              <div className="tp-pagination">
                <Pagination
                  items={products}
                  countOfPage={12}
                  paginatedData={paginatedData}
                  currPage={currPage}
                  setCurrPage={setCurrPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopArea;
