import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DetailsThumbWrapper from "./details-thumb-wrapper";
import DetailsWrapper from "./details-wrapper";
import DetailsTabNav from "./details-tab-nav";
import RelatedProducts from "./related-products";
import { buildProductGallery } from "@/utils/product-gallery";
import { toSlug } from "@/utils/slug";

const ProductDetailsArea = ({ productItem }) => {
  const { _id, img, imageURLs, videoId,status } = productItem || {};
  const galleryItems = useMemo(
    () => buildProductGallery({ ...productItem, imageURLs }),
    [productItem, imageURLs]
  );
  const [activeImg, setActiveImg] = useState(galleryItems[0]?.img || img);
  const hasDescription = Boolean(productItem?.description?.trim?.());
  const hasAdditionalInfo = Array.isArray(productItem?.additionalInformation) && productItem.additionalInformation.length > 0;
  const hasReviews = Array.isArray(productItem?.reviews) && productItem.reviews.length > 0;
  const showDetailsTabs = hasDescription || hasAdditionalInfo || hasReviews;
  const categoryName =
    productItem?.category?.name || productItem?.parent || "Skincare";
  const categorySlug = toSlug(categoryName);
  const commonTerms = Array.isArray(productItem?.tags)
    ? productItem.tags.filter(Boolean).slice(0, 2)
    : [];
  const frequentlyBoughtLinks = [
    {
      href: categorySlug ? `/shop?category=${categorySlug}` : "/shop",
      label: `Shop more ${categoryName} in Lahore`,
    },
    ...commonTerms.map((term) => ({
      href: `/search?searchText=${encodeURIComponent(term)}`,
      label: `Pair with ${term}`,
    })),
  ].slice(0, 3);
  // active image change when img change
  useEffect(() => {
    setActiveImg(galleryItems[0]?.img || img);
  }, [galleryItems, img]);

  // handle image active
  const handleImageActive = (item) => {
    setActiveImg(item.img);
  };
  return (
    <section className="tp-product-details-area aura-pdp-area">
      <div className="tp-product-details-top aura-pdp-top pb-115">
        <div className="container">
          <div className="row aura-pdp-grid">
            <div className="col-xl-7 col-lg-6 aura-pdp-gallery-col">
              {/* product-details-thumb-wrapper start */}
              <DetailsThumbWrapper
                activeImg={activeImg}
                handleImageActive={handleImageActive}
                imageURLs={galleryItems}
                imgWidth={580}
                imgHeight={670}
                videoId={videoId}
                status={status}
                product={productItem}
              />
              {/* product-details-thumb-wrapper end */}
            </div>
            <div className="col-xl-5 col-lg-6 aura-pdp-content-col">
              {/* product-details-wrapper start */}
              <DetailsWrapper
                productItem={productItem}
                detailsBottom={true}
              />
              {/* product-details-wrapper end */}
            </div>
          </div>
        </div>
      </div>

      {/* product details description */}
      {showDetailsTabs && (
        <div className="tp-product-details-bottom pb-140">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <DetailsTabNav product={productItem} />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* product details description */}

      {/* related products start */}
      <section className={`tp-related-product pb-50 ${showDetailsTabs ? 'pt-95' : 'pt-35'}`}>
        <div className="container">
          <div className="row">
            <div className="tp-section-title-wrapper-6 text-center mb-40">
              <span className="tp-section-title-pre-6">Same-day Delivery Picks in Lahore</span>
              <h3 className="tp-section-title-6">Frequently Bought Together</h3>
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-15">
                {frequentlyBoughtLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="tp-btn tp-btn-sm tp-btn-border">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="row">
            <RelatedProducts id={_id} />
          </div>
        </div>
      </section>
      {/* related products end */}
    </section>
  );
};

export default ProductDetailsArea;
