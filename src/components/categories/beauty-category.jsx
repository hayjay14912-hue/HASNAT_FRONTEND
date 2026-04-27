import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
// internal
import ErrorMsg from "../common/error-msg";
import { ArrowRightSm, ArrowRightSmTwo } from "@/svg";
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { HomeThreeCategoryLoader } from "../loader";
import { useRouter } from "next/router";
import { toSlug } from "@/utils/slug";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";

const getProductsFromPayload = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  return [];
};

const getCategoriesFromPayload = (payload) => {
  if (Array.isArray(payload?.result)) {
    return payload.result;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  return [];
};

const BeautyCategory = ({
  initialCategories = null,
  initialProducts = null,
  initialCategoryCounts = null,
}) => {
  const router = useRouter();
  const {
    data: categoriesRes,
    isLoading,
    isError,
  } = useGetProductTypeCategoryQuery("beauty", { skip: Boolean(initialCategories) });
  const { data: productsRes } = useGetAllProductsQuery(undefined, {
    skip: Boolean(initialProducts) || Boolean(initialCategoryCounts),
  });

  const categories = categoriesRes ?? initialCategories;
  const productsData = productsRes ?? initialProducts;
  const categoryItems = useMemo(() => getCategoriesFromPayload(categories), [categories]);
  const isPrefiltered = Boolean(productsData?.prefiltered);
  const hasPrefetchedCategoryCounts = initialCategoryCounts && typeof initialCategoryCounts === "object";

  const retailProducts = useMemo(() => {
    const items = getProductsFromPayload(productsData);
    if (isPrefiltered) {
      return items;
    }
    return items.filter((item) => isActiveProduct(item) && isRetailProduct(item));
  }, [productsData, isPrefiltered]);

  const categoryProductCountMaps = useMemo(() => {
    const byId = new Map();
    const bySlug = new Map();

    retailProducts.forEach((product) => {
      const categoryId = String(product?.category?.id || product?.category?._id || "");
      const categorySlug = toSlug(product?.category?.name || product?.parent || "");

      if (categoryId) {
        byId.set(categoryId, (byId.get(categoryId) || 0) + 1);
      }
      if (categorySlug) {
        bySlug.set(categorySlug, (bySlug.get(categorySlug) || 0) + 1);
      }
    });

    return { byId, bySlug };
  }, [retailProducts]);

  const getCategoryProductCount = (category) => {
    const categorySlug = toSlug(category?.parent || category?.name || "");
    const categoryId = String(category?._id || category?.id || "");
    if (hasPrefetchedCategoryCounts) {
      if (categoryId && Number.isFinite(initialCategoryCounts[categoryId])) {
        return initialCategoryCounts[categoryId];
      }
      return Number(initialCategoryCounts[categorySlug] || 0);
    }
    if (categoryId && categoryProductCountMaps.byId.has(categoryId)) {
      return categoryProductCountMaps.byId.get(categoryId);
    }
    return categoryProductCountMaps.bySlug.get(categorySlug) || 0;
  };

  // handle category route
  const handleCategoryRoute = (title) => {
    router.push(`/shop?category=${toSlug(title)}`);
  };
  // decide what to render
  let content = null;

  const shouldShowLoading = isLoading && categoryItems.length === 0;

  if (shouldShowLoading) {
    content = <HomeThreeCategoryLoader loading={true} />;
  }
  if (!shouldShowLoading && isError && categoryItems.length === 0) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!shouldShowLoading && !isError && categoryItems.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!shouldShowLoading && categoryItems.length > 0) {
    content = categoryItems.map((item) => {
      const categoryCount = getCategoryProductCount(item);
      return (
      <div key={item._id} className="col-lg-3 col-sm-6">
        <div className="tp-category-item-3 p-relative black-bg text-center z-index-1 fix mb-30">
          {/^https?:\/\//i.test(item.img) ? (
            <Image
              src={item.img}
              alt={`${item.parent} category image`}
              fill
              sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 25vw"
              className="tp-category-thumb-3 include-bg"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <img
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              src={item.img}
              alt={`${item.parent} category image`}
              className="tp-category-thumb-3 include-bg"
              style={{
                objectFit: "cover",
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}

          <div className="tp-category-content-3 transition-3">
            <h3 className="tp-category-title-3">
              <a
                href={`/shop-category?category=${encodeURIComponent(item.parent)}`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryRoute(item.parent);
                }}
              >
                {item.parent}
              </a>
            </h3>
            <span className="tp-categroy-ammount-3">
              {categoryCount} Products
            </span>
            <div className="tp-category-btn-3">
              <a
                href={`/shop-category?category=${encodeURIComponent(item.parent)}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryRoute(item.parent);
                }}
                className="cursor-pointer tp-link-btn tp-link-btn-2"
              >
                View Now
                <ArrowRightSm />
              </a>
            </div>
          </div>
        </div>
      </div>
      );
    });
  }
  return (
    <>
      <section className="tp-category-area pt-95">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-6 col-md-8">
              <div className="tp-section-title-wrapper-3 mb-45">
                <span className="tp-section-title-pre-3">
                  Shop by Category
                </span>
                <h3 className="tp-section-title-3">Find products by concern</h3>
              </div>
            </div>
            <div className="col-lg-6 col-md-4">
              <div className="tp-category-more-3 text-md-end mb-55">
                <Link href="/shop" className="tp-btn">
                  Browse All Products <ArrowRightSmTwo />
                </Link>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">{content}</div>
        </div>
      </section>
    </>
  );
};

export default BeautyCategory;
