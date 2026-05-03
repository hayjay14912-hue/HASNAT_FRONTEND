import React from "react";
import ErrorMsg from "../common/error-msg";
import { useGetShowCategoryQuery } from "@/redux/features/categoryApi";
import { useRouter } from "next/router";
import ShopCategoryLoader from "../loader/shop/shop-category-loader";
import { toSlug } from "@/utils/slug";

const ShopCategoryArea = () => {
  const { data: categories, isLoading, isError } = useGetShowCategoryQuery();
  const router = useRouter();

  const categoryList = Array.isArray(categories?.result)
    ? Array.from(
        new Set(
          categories.result
            .map((item) => String(item?.parent || item?.name || "").trim())
            .filter(Boolean)
        )
      )
    : [];

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
  if (!isLoading && !isError && categoryList.length > 0) {
    content = categoryList.map((name) => {
      return (
        <div key={name} className="col-lg-3 col-sm-6">
          <div
            className="tp-category-main-box mb-25 p-relative fix"
            style={{ backgroundColor: "#F3F5F7" }}
          >
            <div className="tp-category-main-content">
              <h3
                className="tp-category-main-title pb-1"
                onClick={() => handleCategoryRoute(name)}
              >
                <a
                  href={`/shop-category?category=${encodeURIComponent(name)}`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryRoute(name);
                  }}
                >
                  {name}
                </a>
              </h3>
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
