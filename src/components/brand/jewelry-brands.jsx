import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
// internal: use existing logo assets to avoid missing file errors
import logo_dark from '@assets/img/logo/logo.svg';
import logo_white from '@assets/img/logo/logo-white.svg';
import { ArrowNextSm, ArrowPrevSm } from '@/svg';

// brand data (reuse available logo assets)
const brand_data = [logo_dark, logo_white, logo_dark, logo_white, logo_dark, logo_white, logo_dark]

// slider setting 
const slider_setting = {
  slidesPerView: 5,
  spaceBetween: 0,
  navigation: {
    nextEl: ".tp-brand-slider-button-next",
    prevEl: ".tp-brand-slider-button-prev",
  },
  breakpoints: {
    '992': {
      slidesPerView: 5,
    },
    '768': {
      slidesPerView: 4,
    },
    '576': {
      slidesPerView: 3,
    },
    '0': {
      slidesPerView: 1,
    },
  }
}

const JewelryBrands = () => {
  return (
    <>
      <section className="tp-brand-area pt-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-brand-slider p-relative">
                <Swiper {...slider_setting} modules={[Navigation]} className="tp-brand-slider-active swiper-container">
                  {brand_data.map((logo, i) => (
                    <SwiperSlide key={i} className="tp-brand-item text-center">
                      <a href="#">
                        <Image src={logo} alt="brand img" />
                      </a>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="tp-brand-slider-arrow">
                  <button className="tp-brand-slider-button-prev">
                    <ArrowPrevSm />
                  </button>
                  <button className="tp-brand-slider-button-next">
                    <ArrowNextSm />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JewelryBrands;