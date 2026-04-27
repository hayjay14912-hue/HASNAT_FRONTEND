import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
// internal
import { useGetRelatedProductsQuery } from "@/redux/features/productApi";
import ProductItem from "../products/beauty/product-item";
import ErrorMsg from "../common/error-msg";
import { HomeNewArrivalPrdLoader } from "../loader";

const getSliderSetting = (count = 1) => ({
  slidesPerView: Math.min(4, Math.max(1, count)),
  spaceBetween: 24,
  watchOverflow: true,
  navigation: {
    nextEl: ".tp-related-slider-button-next",
    prevEl: ".tp-related-slider-button-prev",
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    1200: {
      slidesPerView: Math.min(4, Math.max(1, count)),
    },
    992: {
      slidesPerView: Math.min(3, Math.max(1, count)),
    },
    768: {
      slidesPerView: Math.min(2, Math.max(1, count)),
    },
    576: {
      slidesPerView: Math.min(2, Math.max(1, count)),
    },
    0: {
      slidesPerView: 1,
    },
  },
});

const RelatedProducts = ({id}) => {
  const { data: products, isError, isLoading } = useGetRelatedProductsQuery(id);
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeNewArrivalPrdLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data;
    const slider_setting = getSliderSetting(product_items.length);
    content = (
      <Swiper
        {...slider_setting}
        modules={[Autoplay, Navigation]}
        className="tp-product-related-slider-active aura-related-slider swiper-container mb-10"
      >
        {product_items.map((item) => (
          <SwiperSlide key={item._id}>
            <ProductItem product={item} primary_style={true} showInquiryInline={false} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
  return (
    <div className="tp-product-related-slider">
      {content}
    </div>
  );
};

export default RelatedProducts;
