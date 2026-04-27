import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
import { Cart, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { isProfessionalProduct, isPurchasableOnline } from "@/utils/product-access";
import { getActiveBogoOffer } from "@/utils/bogo";
import InquiryCTAInline from "@/components/b2b/inquiry-cta-inline";
import { buildProductPath, getProductImageAlt } from "@/utils/seo-utils";

const FALLBACK_PRODUCT_IMAGE = "/assets/img/product/product-1.jpg";

const looksLikePlaceholderImage = (value) => {
  const input = String(value || "").trim().toLowerCase();
  if (!input) return true;
  return /^https?:\/\/img\d+\.(jpg|jpeg|png|webp|gif)$/i.test(input);
};

const ProductItem = ({
  product,
  prdCenter = false,
  primary_style = false,
  showInquiryInline = true,
}) => {
  const { _id, img, title, price, discount, tags, status } = product || {};
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
  const purchasable = isPurchasableOnline(product);
  const professionalItem = isProfessionalProduct(product);
  const isFeaturedProduct = Boolean(product?.feature || product?.featured);
  const productTagLabel = tags?.[1] || tags?.[0] || (isFeaturedProduct ? "Featured" : "Product");
  const parsedPrice = Number(price || 0);
  const discountValue = Number(discount || 0);
  const discountedPrice = parsedPrice - (parsedPrice * discountValue) / 100;
  const bogoOffer = getActiveBogoOffer(product);
  const dispatch = useDispatch();
  const productPath = buildProductPath(product || { _id, title });
  const imageAlt = getProductImageAlt(product);
  const [imageSrc, setImageSrc] = React.useState(
    looksLikePlaceholderImage(img) ? FALLBACK_PRODUCT_IMAGE : (img || FALLBACK_PRODUCT_IMAGE)
  );

  React.useEffect(() => {
    setImageSrc(looksLikePlaceholderImage(img) ? FALLBACK_PRODUCT_IMAGE : (img || FALLBACK_PRODUCT_IMAGE));
  }, [img]);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
   // handle wishlist product
   const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  return (
    <div
      className={`tp-product-item-3 mb-50 ${primary_style?"tp-product-style-primary":""} ${prdCenter ? "text-center" : ""}`}
    >
      <div className="tp-product-thumb-3 mb-15 fix p-relative z-index-1">
        <Link href={productPath}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={282}
            height={320}
            sizes="(max-width: 575px) 50vw, (max-width: 991px) 33vw, (max-width: 1199px) 25vw, 282px"
            onError={() => setImageSrc(FALLBACK_PRODUCT_IMAGE)}
          />
        </Link>

        <div className="tp-product-badge">
          {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
        </div>

        {/* product action */}
        <div className="tp-product-action-3 tp-product-action-blackStyle">
          <div className="tp-product-action-item-3 d-flex flex-column">
            {purchasable && isAddedToCart ? (
              <Link
                href="/cart"
                className={`tp-product-action-btn-3 ${isAddedToCart?'active':''} tp-product-add-cart-btn text-center`}
              >
                <Cart />
                <span className="tp-product-tooltip">View Cart</span>
              </Link>
            ) : purchasable ? (
              <button
                type="button"
                onClick={() => handleAddProduct(product)}
                className={`tp-product-action-btn-3 ${isAddedToCart?'active':''} tp-product-add-cart-btn`}
                disabled={status === 'out-of-stock'}
              >
                <Cart />
                <span className="tp-product-tooltip">Add to Cart</span>
              </button>
            ) : (
              <Link
                href={`/request-pricing?product=${encodeURIComponent(title)}`}
                className="tp-product-action-btn-3 tp-product-add-cart-btn text-center"
              >
                <Cart />
                <span className="tp-product-tooltip">Contact Sales</span>
              </Link>
            )}
            <button
              onClick={() => dispatch(handleProductModal(product))}
              className="tp-product-action-btn-3 tp-product-quick-view-btn"
            >
              <QuickView />
              <span className="tp-product-tooltip">Quick View</span>
            </button>

            <button
              disabled={status === 'out-of-stock'}
              onClick={()=> handleWishlistProduct(product)}
              className={`tp-product-action-btn-3 ${isAddedToWishlist?'active':''} tp-product-add-to-wishlist-btn`}
            >
              <Wishlist />
              <span className="tp-product-tooltip">Add To Wishlist</span>
            </button>

          </div>
        </div>

        <div className="tp-product-add-cart-btn-large-wrapper">
          {purchasable && isAddedToCart ? (
            <Link
              href="/cart"
              className="tp-product-add-cart-btn-large text-center"
            >
              View Cart
            </Link>
          ) : purchasable ? (
            <button
              onClick={() => handleAddProduct(product)}
              type="button"
              className="tp-product-add-cart-btn-large"
              disabled={status === 'out-of-stock'}
            >
              Add To Cart
            </button>
          ) : (
            <Link
              href={`/request-pricing?product=${encodeURIComponent(title)}`}
              className="tp-product-add-cart-btn-large text-center"
            >
              Contact Sales
            </Link>
          )}
        </div>
      </div>
      <div className="tp-product-content-3">
        <div className="tp-product-tag-3">
          <span>{productTagLabel}</span>
        </div>
        <h3 className="tp-product-title-3">
          <Link href={productPath}>{title}</Link>
        </h3>
        <div className="tp-product-price-wrapper-3">
          {purchasable ? (
            bogoOffer ? (
              <>
                <span className="tp-product-price-3 new-price">PKR {bogoOffer.bundlePrice.toFixed(2)}</span>
                <span className="tp-product-price-3 old-price">
                  {bogoOffer.bundleSize} pcs bundle
                </span>
              </>
            ) : discountValue > 0 ? (
              <>
                <span className="tp-product-price-3 new-price">PKR {discountedPrice.toFixed(2)}</span>
                <span className="tp-product-price-3 old-price">PKR {parsedPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="tp-product-price-3">PKR {parsedPrice.toFixed(2)}</span>
            )
          ) : (
            <span className="tp-product-price-3">Professional Inquiry</span>
          )}
        </div>
        {professionalItem && showInquiryInline && (
          <InquiryCTAInline productName={title} compact={true} className="mt-10" />
        )}
      </div>
    </div>
  );
};

export default ProductItem;
