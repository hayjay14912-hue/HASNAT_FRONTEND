import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
import { AddCart, Cart, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { isProfessionalProduct, isPurchasableOnline } from "@/utils/product-access";
import InquiryCTAInline from "@/components/b2b/inquiry-cta-inline";
import { buildProductPath, getProductImageAlt } from "@/utils/seo-utils";

const ProductItem = ({ product }) => {
  const { _id, img, title, price, tags,status } = product || {};
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
  const purchasable = isPurchasableOnline(product);
  const professionalItem = isProfessionalProduct(product);
  const dispatch = useDispatch();
  const productPath = buildProductPath(product || { _id, title });
  const imageAlt = getProductImageAlt(product);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  return (
    <div className="tp-product-item-4 p-relative mb-40">
      <div className="tp-product-thumb-4 p-relative fix">
        <Link href={productPath}>
          <Image src={img} alt={imageAlt} width={284} height={352} />
        </Link>
        <div className="tp-product-badge">
          {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
        </div>
        <div className="tp-product-action-3 tp-product-action-4 has-shadow tp-product-action-blackStyle tp-product-action-brownStyle">
          <div className="tp-product-action-item-3 d-flex flex-column">
            {purchasable && isAddedToCart ? (
              <Link
                href="/cart"
                className={`tp-product-action-btn-3 ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn text-center`}
              >
                <Cart />
                <span className="tp-product-tooltip">View Cart</span>
              </Link>
            ) : purchasable ? (
              <button
                type="button"
                onClick={() => handleAddProduct(product)}
                className={`tp-product-action-btn-3 ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
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
              type="button"
              className="tp-product-action-btn-3 tp-product-quick-view-btn"
              onClick={() => dispatch(handleProductModal(product))}
            >
              <QuickView />
              <span className="tp-product-tooltip">Quick View</span>
            </button>
            <button
              type="button"
              onClick={() => handleWishlistProduct(product)}
              className={`tp-product-action-btn-3 ${isAddedToWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}
              disabled={status === 'out-of-stock'}
            >
              <Wishlist />
              <span className="tp-product-tooltip">Add To Wishlist</span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-content-4">
        <h3 className="tp-product-title-4">
          <Link href={productPath}>{title}</Link>
        </h3>
        <div className="tp-product-info-4">
          <p>{tags[0]}</p>
        </div>

        <div className="tp-product-price-inner-4">
          <div className="tp-product-price-wrapper-4">
            {purchasable ? (
              <span className="tp-product-price-4">PKR {price.toFixed(2)}</span>
            ) : (
              <span className="tp-product-price-4">Professional Inquiry</span>
            )}
          </div>
          <div className="tp-product-price-add-to-cart">
            {purchasable && isAddedToCart ? <Link href="/cart" className="tp-product-add-to-cart-4">
              <AddCart /> View Cart
            </Link> : purchasable ? <button disabled={status === 'out-of-stock'} onClick={()=> handleAddProduct(product)} className="tp-product-add-to-cart-4">
              <AddCart /> Add to Cart
            </button> : <Link href={`/request-pricing?product=${encodeURIComponent(title)}`} className="tp-product-add-to-cart-4">
              <AddCart /> Contact Sales
            </Link>}
          </div>
        </div>
        {professionalItem && <InquiryCTAInline productName={title} compact={true} className="mt-10" />}
      </div>
    </div>
  );
};

export default ProductItem;
