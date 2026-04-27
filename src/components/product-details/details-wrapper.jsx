import React, { useEffect, useMemo, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
// internal
import { AskQuestion, WishlistTwo } from '@/svg';
import DetailsBottomInfo from './details-bottom-info';
import ProductDetailsCountdown from './product-details-countdown';
import ProductQuantity from './product-quantity';
import { add_cart_product, configureOrderQuantity, initialOrderQuantity } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { handleModalClose } from '@/redux/features/productModalSlice';
import { isProfessionalProduct, isPurchasableOnline } from '@/utils/product-access';
import { FREE_SHIPPING_THRESHOLD } from '@/utils/pricing';
import { getActiveBogoOffer } from '@/utils/bogo';
import ProfessionalCTAButtons from '@/components/b2b/professional-cta-buttons';
import FormattedDescription, {
  getDescriptionPreviewSections,
  parseProductDescription,
} from './formatted-description';

const DEFAULT_BENEFITS = [
  'Dermatologist tested formula',
  'Hydration and barrier support',
  'Daily routine friendly finish',
];

const DetailsWrapper = ({
  productItem,
  detailsBottom = false,
  quickViewMode = false,
}) => {
  const {
    sku,
    title,
    category,
    description,
    discount,
    price,
    status,
    reviews,
    tags,
    offerDate,
    brand,
    seo,
  } = productItem || {};
  const [ratingVal, setRatingVal] = useState(0);
  const [textMore, setTextMore] = useState(false);
  const dispatch = useDispatch();
  const purchasable = isPurchasableOnline(productItem);
  const professionalItem = isProfessionalProduct(productItem);
  const reviewCount = reviews && reviews.length > 0 ? reviews.length : 0;
  const hasReviews = reviewCount > 0;
  const displayRating = hasReviews ? ratingVal : 5;
  const reviewLabel = hasReviews
    ? `(${reviewCount} Review${reviewCount > 1 ? "s" : ""})`
    : "(5.0 Stars)";
  const productPrice = Number(price || 0);
  const discountValue = Number(discount || 0);
  const discountedPrice = productPrice - (productPrice * discountValue) / 100;
  const bogoOffer = getActiveBogoOffer(productItem);
  const categoryName =
    typeof category === 'string' ? category : category?.name || 'Skincare';
  const brandName = brand?.name || categoryName;
  const safeDescription =
    description ||
    'Performance skincare designed for visible results and daily comfort.';
  const parsedDescription = useMemo(
    () => parseProductDescription(safeDescription),
    [safeDescription]
  );
  const previewDescription = useMemo(
    () => getDescriptionPreviewSections(parsedDescription),
    [parsedDescription]
  );
  const shortDescription =
    safeDescription.length > 150 ? `${safeDescription.substring(0, 150)}...` : safeDescription;
  const hasExtendedDescription =
    safeDescription.length > 220 || parsedDescription.length > previewDescription.length;
  const benefitItems =
    Array.isArray(tags) && tags.length > 0
      ? tags.slice(0, 3)
      : DEFAULT_BENEFITS;

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  useEffect(() => {
    if (!purchasable) {
      dispatch(initialOrderQuantity());
      return;
    }

    dispatch(configureOrderQuantity(productItem));

    return () => {
      dispatch(initialOrderQuantity());
    };
  }, [
    dispatch,
    purchasable,
    productItem?._id,
    productItem?.bogoOffer?.enabled,
    productItem?.bogoOffer?.bundleSize,
    productItem?.bogoOffer?.bundlePrice,
  ]);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  return (
    <div className={`tp-product-details-wrapper ${quickViewMode ? 'aura-qv-panel' : 'aura-pdp-panel'}`}>
      <div className="tp-product-details-category">
        <span>{brandName}</span>
      </div>
      <h1 className="tp-product-details-title">{seo?.h1 || title}</h1>

      {/* inventory details */}
      <div className={`tp-product-details-inventory d-flex align-items-center mb-10 ${quickViewMode ? 'aura-qv-inventory' : ''}`}>
        <div className="tp-product-details-stock mb-10">
          <span>{status}</span>
        </div>
        <div className="tp-product-details-rating-wrapper d-flex align-items-center mb-10">
          <div className="tp-product-details-rating">
            <Rating allowFraction size={quickViewMode ? 18 : 16} initialValue={displayRating} readonly={true} />
          </div>
          <div className="tp-product-details-reviews">
            <span>{reviewLabel}</span>
          </div>
        </div>
      </div>
      {quickViewMode ? (
        <p className="aura-qv-description">{shortDescription}</p>
      ) : (
        <div className="aura-pdp-description">
          <FormattedDescription
            sections={textMore ? parsedDescription : previewDescription}
            compact={!textMore}
          />
          {hasExtendedDescription && (
            <button
              type="button"
              className="aura-description-toggle"
              onClick={() => setTextMore(!textMore)}
            >
              {textMore ? 'See less' : 'See more'}
            </button>
          )}
        </div>
      )}

      {quickViewMode && (
        <ul className="aura-qv-benefits">
          {benefitItems.map((benefit, index) => (
            <li key={`${benefit}-${index}`}>{benefit}</li>
          ))}
        </ul>
      )}

      {/* price */}
      <div className={`tp-product-details-price-wrapper mb-20 ${!purchasable ? 'is-inquiry' : ''}`}>
        {purchasable && bogoOffer ? (
          <>
            <span className="tp-product-details-price new-price">
              PKR {bogoOffer.bundlePrice.toFixed(2)} / {bogoOffer.bundleSize} pcs
            </span>
          </>
        ) : purchasable && discountValue > 0 ? (
          <>
            <span className="tp-product-details-price old-price">PKR {productPrice.toFixed(2)}</span>
            <span className="tp-product-details-price new-price">
              {" "}PKR {discountedPrice.toFixed(2)}
            </span>
          </>
        ) : purchasable ? (
          <span className="tp-product-details-price new-price">PKR {productPrice.toFixed(2)}</span>
        ) : (
          <span className="tp-product-details-price new-price inquiry-only-label">Professional Inquiry Only</span>
        )}
      </div>

      {purchasable && bogoOffer && (
        <div className="aura-pdp-trust-inline aura-pdp-offer-inline">
          <span>{bogoOffer.label || "Buy 1 Get 1 FREE"}</span>
          <span>Checkout starts at {bogoOffer.bundleSize} pieces</span>
          <span>Bundle total PKR {bogoOffer.bundlePrice.toLocaleString("en-PK")}</span>
        </div>
      )}

      {!quickViewMode && purchasable && (
        <div className="aura-pdp-trust-inline">
          <span>Same-day Delivery in Lahore</span>
          <span>Secure Checkout</span>
          <span>Authentic Product</span>
          <span>Cash on Delivery</span>
        </div>
      )}

      {/* if ProductDetailsCountdown true start */}
      {offerDate?.endDate && <ProductDetailsCountdown offerExpiryTime={offerDate?.endDate} />}
      {/* if ProductDetailsCountdown true end */}

      {/* actions */}
      <div className={`tp-product-details-action-wrapper ${quickViewMode ? 'aura-qv-cta-wrap' : ''}`}>
        {purchasable ? (
          <>
            <h3 className="tp-product-details-action-title">Quantity</h3>
            <div
              className={`tp-product-details-action-item-wrapper d-sm-flex align-items-center ${quickViewMode ? 'aura-qv-action-row' : 'aura-pdp-action-row'}`}
            >
              {/* product quantity */}
              <ProductQuantity quickViewMode={quickViewMode} />
              {/* product quantity */}
              <div className={`tp-product-details-add-to-cart w-100 ${quickViewMode ? 'mb-15' : ''}`}>
                <button
                  onClick={() => handleAddProduct(productItem)}
                  disabled={status === 'out-of-stock'}
                  className={`tp-product-details-add-to-cart-btn w-100 ${quickViewMode ? 'aura-qv-btn aura-qv-btn-secondary' : 'aura-pdp-btn aura-pdp-btn-secondary'}`}
                >
                  Add To Cart
                </button>
              </div>
            </div>
            <Link
              href="/cart"
              onClick={() => dispatch(handleModalClose())}
              className={`tp-product-details-buy-now-btn w-100 ${quickViewMode ? 'aura-qv-btn aura-qv-btn-primary' : 'aura-pdp-btn aura-pdp-btn-primary aura-pdp-checkout-btn'}`}
            >
              Secure Checkout
            </Link>
          </>
        ) : professionalItem ? (
          <>
            <ProfessionalCTAButtons productName={title} className="mb-15" />
          </>
        ) : (
          <ProfessionalCTAButtons productName={title} className="mb-15" />
        )}
      </div>

      {quickViewMode && purchasable && (
        <div className="aura-qv-trust-block">
          <span className="aura-qv-trust-badge">Authentic Product Guarantee</span>
          <p>Enjoy FREE Shipping on all orders above {FREE_SHIPPING_THRESHOLD} PKR.</p>
          <p>Secure checkout with encrypted payment protection.</p>
        </div>
      )}

      {purchasable && (
        <>
          {/* product-details-action-sm start */}
          <div className={`tp-product-details-action-sm ${quickViewMode ? 'aura-qv-utility' : ''}`}>
            <button disabled={status === 'out-of-stock'} onClick={() => handleWishlistProduct(productItem)} type="button" className="tp-product-details-action-sm-btn">
              <WishlistTwo />
              Add Wishlist
            </button>
            <button type="button" className="tp-product-details-action-sm-btn">
              <AskQuestion />
              Ask a question
            </button>
          </div>
          {/* product-details-action-sm end */}
        </>
      )}

      {detailsBottom && <DetailsBottomInfo category={categoryName} sku={sku} tag={tags?.[0]} />}
    </div>
  );
};

export default DetailsWrapper;
