import React, { useEffect, useMemo, useState } from "react";
import { ArrowNext, ArrowPrev } from "@/svg";
import Image from "next/image";

const slider_data = [
  {
    id: 1,
    bg: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684890/ptt8lk2ofzmc4vbzpc3l.jpg",
    subtitle: "",
    title: "",
    lede: "",
    position: "center center",
  },
  {
    id: 2,
    bg: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684568/qk2i8zlrz2kx63fvjc06.jpg",
    subtitle: "",
    title: "",
    lede: "",
    position: "center center",
  },
  {
    id: 3,
    bg: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684669/bxkfnfsakeblrp59gekx.jpg",
    subtitle: "",
    title: "",
    lede: "",
    position: "center center",
  },
  {
    id: 4,
    bg: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684718/fg3xaki22c1uwxedheil.jpg",
    subtitle: "",
    title: "",
    lede: "",
    position: "center center",
  },
  {
    id: 5,
    bg: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684653/qvibexxbkedszw1jkikj.jpg",
    subtitle: "",
    title: "",
    lede: "",
    position: "center center",
  },
  {
    id: 6,
    bg: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684688/ewmo9x5sa4ma6tbxur9v.jpg",
    subtitle: "",
    title: "",
    lede: "",
    position: "center center",
  },
];

const BeautyBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderCount = slider_data.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderCount);
    }, 3000);
    return () => clearInterval(timer);
  }, [sliderCount]);

  const activeSlide = useMemo(() => slider_data[activeIndex], [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + sliderCount) % sliderCount);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % sliderCount);
  };

  const isLcpSlide = activeIndex === 0;

  return (
    <>
      <section className="tp-slider-area aura-hero-area p-relative z-index-1">
        <div className="tp-slider-active-3 aura-hero-lite-slider">
          <div className="tp-slider-item-3 tp-slider-height-3 p-relative">
            <Image
              src={activeSlide.bg}
              alt={activeSlide.title || "Beauty banner image"}
              fill
              className="aura-hero-image tp-slider-thumb-3 include-bg"
              fetchPriority={isLcpSlide ? "high" : "auto"}
              loading={isLcpSlide ? "eager" : "lazy"}
              decoding="async"
              sizes="100vw"
              priority={isLcpSlide}
            />
            <span className="aura-hero-left-overlay" aria-hidden="true"></span>
          </div>
          <div className="tp-swiper-dot tp-slider-3-dot d-sm-none">
            {slider_data.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`swiper-pagination-bullet ${index === activeIndex ? "swiper-pagination-bullet-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="tp-slider-arrow-3 d-none d-sm-block">
            <button type="button" className="tp-slider-3-button-prev" onClick={handlePrev} aria-label="Previous slide">
              <ArrowPrev />
            </button>
            <button type="button" className="tp-slider-3-button-next" onClick={handleNext} aria-label="Next slide">
              <ArrowNext />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default BeautyBanner;
