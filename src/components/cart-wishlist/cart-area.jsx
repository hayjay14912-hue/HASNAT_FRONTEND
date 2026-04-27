import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
// internal
import { clearCart } from '@/redux/features/cartSlice';
import CartCheckout from './cart-checkout';
import CartItem from './cart-item';
import RenderCartProgress from '../common/render-cart-progress';

const CartArea = () => {
  const { cart_products } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const showLoadingShell = !isHydrated;
  const hasItems = !showLoadingShell && cart_products.length > 0;
  const showEmptyState = !showLoadingShell && cart_products.length === 0;

  return (
    <>
      <section className="tp-cart-area aura-cart-area pb-120">
        <div className="container">
          <div className="cartmini__shipping aura-cart-shipping-banner">
            <RenderCartProgress />
          </div>

          <div className={`aura-cart-main-grid ${showEmptyState ? "aura-cart-main-grid--single" : ""}`}>
            <div className="aura-cart-main-col">
              {showLoadingShell && (
                <div className="aura-cart-table-shell aura-cart-loading-shell">
                  <div className="aura-cart-skeleton-line is-head"></div>
                  <div className="aura-cart-skeleton-line"></div>
                  <div className="aura-cart-skeleton-line"></div>
                  <div className="aura-cart-skeleton-line"></div>
                </div>
              )}

              {showEmptyState && (
                <div className="text-center pt-50 aura-cart-empty">
                  <h3>No Cart Items Found</h3>
                  <Link href="/shop" className="tp-cart-checkout-btn mt-20">
                    Continue Shopping
                  </Link>
                </div>
              )}

              {hasItems && (
                <>
                  <div className="tp-cart-list aura-cart-table-shell">
                    <div className="aura-cart-table-wrap">
                      <table className="table aura-cart-table">
                        <colgroup>
                          <col className="aura-cart-col-image" />
                          <col className="aura-cart-col-title" />
                          <col className="aura-cart-col-price" />
                          <col className="aura-cart-col-qty" />
                          <col className="aura-cart-col-remove" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th colSpan="2" className="tp-cart-header-product">Product</th>
                            <th className="tp-cart-header-price">Subtotal</th>
                            <th className="tp-cart-header-quantity">Quantity</th>
                            <th className="tp-cart-header-remove text-end">Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart_products.map((item, index) => (
                            <CartItem key={item._id} product={item} rowIndex={index} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tp-cart-bottom aura-cart-bottom-actions">
                    <div className="tp-cart-update text-md-end">
                      <button
                        onClick={() => dispatch(clearCart())}
                        type="button"
                        className="tp-cart-update-btn aura-cart-clear-btn"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {(showLoadingShell || hasItems) && (
              <aside className="aura-cart-side-col">
                <div className={showLoadingShell ? "aura-cart-summary-shell" : ""}>
                  <CartCheckout />
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CartArea;
