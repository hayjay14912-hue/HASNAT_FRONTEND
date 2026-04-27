import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";
// internal
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";
import { isPurchasableOnline, isProfessionalProduct } from "@/utils/product-access";
import InquiryCTAInline from "@/components/b2b/inquiry-cta-inline";
import { buildProductPath, getProductImageAlt } from "@/utils/seo-utils";

const FALLBACK_PRODUCT_IMAGE = "/assets/img/product/product-1.jpg";

const looksLikePlaceholderImage = (value) => {
  const input = String(value || "").trim().toLowerCase();
  if (!input) return true;
  return /^https?:\/\/img\d+\.(jpg|jpeg|png|webp|gif)$/i.test(input);
};

const Rating = dynamic(
  () => import("react-simple-star-rating").then((mod) => mod.Rating),
  { ssr: false }
);

const ProductItem = ({
  product,
  style_2 = false,
  shopMode = false,
  isLcpImage = false,
}) => {
  const { _id, img, category, title, reviews, price, discount, tags, status } = product || {};
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
  const dispatch = useDispatch();
  const purchasable = isPurchasableOnline(product);
  const professionalItem = isProfessionalProduct(product);
  const productTags = Array.isArray(tags) ? tags : [];
  const parsedPrice = Number(price || 0);
  const discountValue = Number(discount || 0);
  const discountedPrice = parsedPrice - (parsedPrice * discountValue) / 100;
  const ingredientBadge =
    productTags[0] ||
    (typeof category === "string" ? category : category?.name) ||
    "Dermatologist Tested";
  const brandName =
    product?.brand?.name ||
    product?.manufacturer ||
    product?.company ||
    "NEES Medical";
  const productPath = buildProductPath(product || { _id, title });
  const imageAlt = getProductImageAlt(product);
  const [imageSrc, setImageSrc] = React.useState(
    looksLikePlaceholderImage(img) ? FALLBACK_PRODUCT_IMAGE : (img || FALLBACK_PRODUCT_IMAGE)
  );

  React.useEffect(() => {
    setImageSrc(looksLikePlaceholderImage(img) ? FALLBACK_PRODUCT_IMAGE : (img || FALLBACK_PRODUCT_IMAGE));
  }, [img]);

  const ratingVal =
    reviews && reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle compare product
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };

  if (shopMode) {
        return (
          <article className="aura-shop-card">
            <div className="aura-shop-card-media">
              <Link href={productPath} className="aura-shop-image-link">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={420}
                  height={441}
                  className="aura-shop-card-image"
                  loading={isLcpImage ? "eager" : "lazy"}
                  priority={isLcpImage}
                  fetchPriority={isLcpImage ? "high" : "auto"}
                  sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
                  onError={() => setImageSrc(FALLBACK_PRODUCT_IMAGE)}
                />
              </Link>
          <div className="aura-shop-card-badges">
            <span className="aura-shop-card-badge">{ingredientBadge}</span>
            {!purchasable && (
              <span className="aura-shop-card-badge is-pro">Professional Use Only</span>
            )}
            {purchasable && discountValue > 0 && (
              <span className="aura-shop-card-badge is-sale">-{discountValue}%</span>
            )}
            {status === "out-of-stock" && (
              <span className="aura-shop-card-badge is-stock">Out of Stock</span>
            )}
          </div>

          <button
            disabled={status === "out-of-stock"}
            onClick={() => handleWishlistProduct(product)}
            className={`aura-shop-wishlist-btn ${isAddedToWishlist ? "active" : ""}`}
            type="button"
            aria-label="Add to wishlist"
          >
            <Wishlist />
          </button>

          <div className="aura-shop-card-quick-actions">
            <button
              onClick={() => dispatch(handleProductModal(product))}
              className="aura-shop-action-btn is-light"
              type="button"
            >
              <QuickView />
              <span>Quick View</span>
            </button>

            {purchasable && isAddedToCart ? (
              <Link href="/cart" className="aura-shop-action-btn is-primary">
                <Cart />
                <span>View Cart</span>
              </Link>
            ) : purchasable ? (
              <button
                type="button"
                onClick={() => handleAddProduct(product)}
                className="aura-shop-action-btn is-primary"
                disabled={status === "out-of-stock"}
              >
                <Cart />
                <span>Add to Cart</span>
              </button>
            ) : (
              <Link
                href={`/request-pricing?product=${encodeURIComponent(title)}`}
                className="aura-shop-action-btn is-primary"
              >
                <Cart />
                <span>Enquire</span>
              </Link>
            )}
          </div>
        </div>

        <div className="aura-shop-card-content">
          <p className="aura-shop-card-brand">{brandName}</p>
          <h3 className="aura-shop-card-title">
            <Link href={productPath}>{title}</Link>
          </h3>

          <div className="aura-shop-card-price">
            {purchasable && discountValue > 0 ? (
              <>
                <span className="is-current">PKR {discountedPrice.toFixed(2)}</span>
                <span className="is-old">PKR {parsedPrice.toFixed(2)}</span>
              </>
            ) : purchasable ? (
              <span className="is-current">PKR {parsedPrice.toFixed(2)}</span>
            ) : (
              <span className="is-current">Price on Request</span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className={`tp-product-item-2 ${style_2 ? "" : "mb-40"}`}>
      <div className="tp-product-thumb-2 p-relative z-index-1 fix">
        <Link href={productPath}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={284}
            height={302}
            onError={() => setImageSrc(FALLBACK_PRODUCT_IMAGE)}
          />
        </Link>
        <div className="tp-product-badge">
          {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
        </div>
        {/* product action */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            {purchasable && isAddedToCart ? (
              <Link
                href="/cart"
                className={`tp-product-action-btn-2 ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
              >
                <Cart />
                <span className="tp-product-tooltip tp-product-tooltip-right">
                  View Cart
                </span>
              </Link>
            ) : purchasable ? (
              <button
                type="button"
                onClick={() => handleAddProduct(product)}
                className={`tp-product-action-btn-2 ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
                disabled={status === 'out-of-stock'}
              >
                <Cart />
                <span className="tp-product-tooltip tp-product-tooltip-right">
                  Add to Cart
                </span>
              </button>
            ) : (
              <Link
                href={`/request-pricing?product=${encodeURIComponent(title)}`}
                className="tp-product-action-btn-2 tp-product-add-cart-btn"
              >
                <Cart />
                <span className="tp-product-tooltip tp-product-tooltip-right">
                  Contact Sales
                </span>
              </Link>
            )}
            <button
              onClick={() => dispatch(handleProductModal(product))}
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
            <button disabled={status === 'out-of-stock'} onClick={() => handleWishlistProduct(product)} className={`tp-product-action-btn-2 ${isAddedToWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}>
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Wishlist
              </span>
            </button>
            <button disabled={status === 'out-of-stock'} onClick={() => handleCompareProduct(product)} className="tp-product-action-btn-2 tp-product-add-to-compare-btn">
              <CompareThree />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Compare
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-content-2 pt-15">
        <div className="tp-product-tag-2">
          {productTags.map((t, i) => (
            <a key={i} href="#">
              {t}
              {i < productTags.length - 1 && ","}
            </a>
          ))}
        </div>
        <h3 className="tp-product-title-2">
          <Link href={productPath}>{title}</Link>
        </h3>
        <div className="tp-product-rating-icon tp-product-rating-icon-2">
          <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
        </div>
        <div className="tp-product-price-wrapper-2">
          {purchasable && discount > 0 ? (
            <>
              <span className="tp-product-price-2 new-price">
                PKR {discountedPrice.toFixed(2)}{" "}
              </span>
              <span className="tp-product-price-2 old-price">
                {" "}PKR {parsedPrice.toFixed(2)}
              </span>
            </>
          ) : purchasable ? (
            <span className="tp-product-price-2 new-price">
              PKR {parsedPrice.toFixed(2)}
            </span>
          ) : (
            <span className="tp-product-price-2 new-price">Professional Inquiry</span>
          )}
        </div>
        {professionalItem && (
          <InquiryCTAInline productName={title} compact={true} className="mt-10" />
        )}
      </div>
    </div>
  );
};

export default ProductItem;
