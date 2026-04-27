import React, { useMemo } from "react";
import ErrorMsg from "../common/error-msg";
import { useGetShowCategoryQuery } from "@/redux/features/categoryApi";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { useRouter } from "next/router";
import ShopCategoryLoader from "../loader/shop/shop-category-loader";
import { toSlug } from "@/utils/slug";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";

const ShopCategoryArea = () => {
  const { data: categories, isLoading, isError } = useGetShowCategoryQuery();
  const { data: productsData } = useGetAllProductsQuery();
  const router = useRouter();

  const retailProducts = useMemo(() => {
    const items = Array.isArray(productsData?.data) ? productsData.data : [];
    return items.filter((item) => isActiveProduct(item) && isRetailProduct(item));
  }, [productsData]);

  const getCategoryProductCount = (category) => {
    const categorySlug = toSlug(category?.parent || category?.name || "");
    const categoryId = String(category?._id || category?.id || "");

    return retailProducts.filter((product) => {
      const productCategoryId = String(product?.category?.id || product?.category?._id || "");
      const productCategorySlug = toSlug(product?.category?.name || "");
      if (categoryId && productCategoryId && categoryId === productCategoryId) {
        return true;
      }
      if (productCategorySlug && productCategorySlug === categorySlug) {
        return true;
      }

      if (!productCategoryId && !productCategorySlug) {
        return toSlug(product?.parent) === categorySlug;
      }
      return false;
    }).length;
  };
  // handle category route
  const handleCategoryRoute = (title) => {
    router.push(`/shop?category=${toSlug(title)}`);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopCategoryLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result;
    content = category_items.map((item) => {
      const categoryCount = getCategoryProductCount(item);
      return (
      <div key={item._id} className="col-lg-3 col-sm-6">
        <div
          className="tp-category-main-box mb-25 p-relative fix"
          style={{ backgroundColor: "#F3F5F7" }}
        >
          <div className="tp-category-main-content">
            <h3
              className="tp-category-main-title pb-1"
              onClick={() => handleCategoryRoute(item.parent)}
            >
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
            <span className="tp-category-main-item">
              {categoryCount} Products
            </span>
          </div>
        </div>
      </div>
      );
    });
  }
  return (
    <>
      <section className="tp-category-area pb-120">
        <div className="container">
          <div className="row">{content}</div>
        </div>
      </section>
    </>
  );
};

export default ShopCategoryArea;
