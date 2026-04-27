import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
// internal
import useCartInfo from '@/hooks/use-cart-info';
import RenderCartProgress from './render-cart-progress';
import empty_cart_img from '@assets/img/product/cartmini/empty-cart.png';
import { closeCartMini, remove_product } from '@/redux/features/cartSlice';
import { getLineItemTotal } from "@/utils/pricing";
import { buildProductPath, getProductImageAlt } from '@/utils/seo-utils';

const CartMiniSidebar = () => {
  const { cart_products, cartMiniOpen } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  const dispatch = useDispatch();
  const hasItems = cart_products.length > 0;
  const formatCurrency = (amount) =>
    `PKR ${Number(amount || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // handle remove product
  const handleRemovePrd = (prd) => {
    dispatch(remove_product(prd))
  }

// handle close cart mini 
const handleCloseCartMini = () => {
  dispatch(closeCartMini())
}
  return (
    <>
      <div className={`cartmini__area tp-all-font-roboto ${cartMiniOpen ? 'cartmini-opened' : ''}`}>
        <div className="cartmini__wrapper d-flex flex-column aura-cartmini-wrapper">
          <div className="cartmini__top-wrapper">
            <div className="cartmini__top p-relative">
              <div className="cartmini__top-title">
                <h4>Shopping Cart</h4>
              </div>
              <div className="cartmini__close">
                <button onClick={() => dispatch(closeCartMini())} type="button" className="cartmini__close-btn cartmini-close-btn">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div className="cartmini__shipping aura-cartmini-shipping">
              <RenderCartProgress/>
            </div>
            {hasItems && <div className="cartmini__widget aura-cartmini-widget">
              {cart_products.map((item) => (
                <div key={item._id} className="cartmini__widget-item">
                  <div className="cartmini__thumb">
                    <Link href={buildProductPath(item)}>
                      <Image src={item.img} width={70} height={60} alt={getProductImageAlt(item)} />
                    </Link>
                  </div>
                  <div className="cartmini__content">
                    <h5 className="cartmini__title">
                      <Link href={buildProductPath(item)}>{item.title}</Link>
                    </h5>
                    <div className="cartmini__price-wrapper">
                      <span className="cartmini__price">{formatCurrency(getLineItemTotal(item))}</span>
                      <span className="cartmini__quantity">{" "}x{item.orderQuantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleRemovePrd({ title: item.title, id: item._id });
                    }}
                    className="cartmini__del cursor-pointer"
                    type="button"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>}
            {/* if no item in cart */}
            {!hasItems && <div className="cartmini__empty text-center">
              <Image src={empty_cart_img} alt="empty-cart-img" />
              <p>Your Cart is empty</p>
              <Link href="/shop" className="tp-btn">Go to Shop</Link>
            </div>}
          </div>
          {hasItems && <div className="cartmini__checkout aura-cartmini-checkout">
            <div className="cartmini__checkout-title mb-30">
              <h4>Subtotal:</h4>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="cartmini__checkout-btn aura-cartmini-checkout-btns">
              <Link href="/checkout" onClick={handleCloseCartMini} className="tp-btn w-100 aura-cartmini-btn aura-cartmini-btn-primary">Checkout</Link>
              <Link href="/cart" onClick={handleCloseCartMini} className="tp-btn tp-btn-border w-100 aura-cartmini-btn aura-cartmini-btn-secondary">View Cart</Link>
            </div>
          </div>}
        </div>
      </div>
      {/* overlay start */}
      <div onClick={handleCloseCartMini} className={`body-overlay ${cartMiniOpen ? 'opened' : ''}`}></div>
      {/* overlay end */}
    </>
  );
};

export default CartMiniSidebar;
