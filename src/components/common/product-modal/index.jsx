import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactModal from "react-modal";
// internal
import { handleModalClose } from "@/redux/features/productModalSlice";
import DetailsThumbWrapper from "@/components/product-details/details-thumb-wrapper";
import DetailsWrapper from "@/components/product-details/details-wrapper";
import { initialOrderQuantity } from "@/redux/features/cartSlice";
import { buildProductGallery } from "@/utils/product-gallery";

const ProductModal = () => {
  const { productItem, isModalOpen } = useSelector(
    (state) => state.productModal
  );
  const { img, status } = productItem || {};
  const galleryItems = useMemo(() => buildProductGallery(productItem), [productItem]);
  const [activeImg, setActiveImg] = useState(galleryItems[0]?.img || img || null);
  const dispatch = useDispatch();

  // active image change when img change
  useEffect(() => {
    setActiveImg(galleryItems[0]?.img || img || null);
    dispatch(initialOrderQuantity());
  }, [galleryItems, img, dispatch, isModalOpen]);

  // handle image active
  const handleImageActive = (item) => {
    if (item?.img) {
      setActiveImg(item.img);
    }
  };

  return (
    <div>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => dispatch(handleModalClose())}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={300}
        bodyOpenClassName="aura-qv-open"
        className={{
          base: "aura-qv-modal",
          afterOpen: "aura-qv-modal--open",
          beforeClose: "aura-qv-modal--close",
        }}
        overlayClassName={{
          base: "aura-qv-overlay",
          afterOpen: "aura-qv-overlay--open",
          beforeClose: "aura-qv-overlay--close",
        }}
        contentLabel="Product Modal"
      >
        <div className="tp-product-modal aura-qv-shell">
          <div className="tp-product-modal-content aura-qv-content d-lg-flex">
            <button
              onClick={() => dispatch(handleModalClose())}
              type="button"
              className="tp-product-modal-close-btn"
              aria-label="Close quick view"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            {/* product-details-thumb-wrapper start */}
            <DetailsThumbWrapper
              activeImg={activeImg}
              handleImageActive={handleImageActive}
              imageURLs={galleryItems}
              imgWidth={416}
              imgHeight={480}
              status={status}
              quickViewMode={true}
              product={productItem}
            />
            {/* product-details-thumb-wrapper end */}

            {/* product-details-wrapper start */}
            <DetailsWrapper
              productItem={productItem}
              quickViewMode={true}
            />
            {/* product-details-wrapper end */}
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default ProductModal;
