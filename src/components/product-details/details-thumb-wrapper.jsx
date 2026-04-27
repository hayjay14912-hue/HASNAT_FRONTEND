import Image from "next/image";
import { useState } from "react";
import PopupVideo from "../common/popup-video";
import { getProductImageAlt } from "@/utils/seo-utils";

const DetailsThumbWrapper = ({
  imageURLs,
  handleImageActive,
  activeImg,
  imgWidth = 416,
  imgHeight = 480,
  videoId = false,
  status,
  quickViewMode = false,
  product,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const galleryItems = imageURLs?.length
    ? imageURLs
    : activeImg
      ? [{ img: activeImg }]
      : [];
  const imageAlt = getProductImageAlt(product);

  if (quickViewMode) {
    return (
      <>
        <div className="tp-product-details-thumb-wrapper aura-qv-gallery">
          <div className="tab-content m-img aura-qv-main-media">
            <div className="tab-pane fade show active">
              <div className="tp-product-details-nav-main-thumb aura-qv-main-thumb p-relative">
                {activeImg && (
                  <Image
                    key={activeImg}
                    src={activeImg}
                    alt={imageAlt}
                    width={imgWidth}
                    height={imgHeight}
                    className="aura-qv-main-image"
                  />
                )}
                <div className="tp-product-badge">
                  {status === "out-of-stock" && <span className="product-hot">out-stock</span>}
                </div>
              </div>
            </div>
          </div>

          <nav className="aura-qv-thumb-nav">
            <div className="nav nav-tabs">
              {galleryItems.map((item, i) => (
                <button
                  key={i}
                  className={`nav-link aura-qv-thumb-btn ${item.img === activeImg ? "active" : ""}`}
                  onClick={() => handleImageActive(item)}
                  type="button"
                >
                  <Image
                    src={item.img}
                    alt={imageAlt}
                    width={96}
                    height={96}
                    className="aura-qv-thumb-image"
                  />
                </button>
              ))}
            </div>
          </nav>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex aura-pdp-gallery">
        <nav>
          <div className="nav nav-tabs flex-sm-column aura-pdp-thumbs">
            {galleryItems?.map((item, i) => (
              <button
                key={i}
                className={`nav-link aura-pdp-thumb-btn ${item.img === activeImg ? "active" : ""}`}
                onClick={() => handleImageActive(item)}
              >
                <Image
                  src={item.img}
                  alt={imageAlt}
                  width={78}
                  height={100}
                  className="aura-pdp-thumb-image"
                />
              </button>
            ))}
          </div>
        </nav>
        <div className="tab-content m-img aura-pdp-main-wrap">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative aura-pdp-main-thumb">
              <Image
                src={activeImg}
                alt={imageAlt}
                width={imgWidth}
                height={imgHeight}
                className="aura-pdp-main-image"
              />
              <div className="tp-product-badge">
                {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
              </div>
              {videoId && (
                <div
                  onClick={() => setIsVideoOpen(true)}
                  className="tp-product-details-thumb-video"
                >
                  <a 
                    href="#" 
                    className="tp-product-details-thumb-video-btn cursor-pointer popup-video"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fas fa-play"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal popup start */}
      {videoId && (
        <PopupVideo
          isVideoOpen={isVideoOpen}
          setIsVideoOpen={setIsVideoOpen}
          videoId={videoId}
        />
      )}
      {/* modal popup end */}
    </>
  );
};

export default DetailsThumbWrapper;
