import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetShowCategoryQuery } from "@/redux/features/categoryApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopCategoryLoader from "@/components/loader/shop/shop-category-loader";
import { resolveRetailCategoryQuery, toSlug } from "@/utils/slug";

const CategoryFilter = ({setCurrPage,shop_right=false}) => {
  const { data: categories, isLoading, isError } = useGetShowCategoryQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  // handle category route
  const handleCategoryRoute = (title) => {
    setCurrPage(1);
    router.push(
      `/${shop_right?'shop-right-sidebar':'shop'}?category=${toSlug(title)}`
        )
    dispatch(handleFilterSidebarClose());
  }
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopCategoryLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result;
    const selectedCategory = resolveRetailCategoryQuery(router.query.category);
    content = (
      <div className="tp-chip-group">
        {category_items.map((item) => (
          <button
            key={item._id}
            onClick={() => handleCategoryRoute(item.parent)}
            className={`tp-chip ${selectedCategory === toSlug(item.parent) ? 'active' : ''}`}
            type="button"
          >
            {item.parent} <span style={{opacity:.65,marginLeft:8}}>{item.products.length}</span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="tp-shop-widget mb-50 tp-form-pro">
        <h3 className="tp-shop-widget-title">Categories</h3>
        <div className="tp-shop-widget-content">
          {content}
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
