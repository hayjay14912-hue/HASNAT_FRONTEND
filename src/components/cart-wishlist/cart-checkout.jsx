import React from "react";
import Link from "next/link";
import useCartInfo from "@/hooks/use-cart-info";
import { useSelector } from "react-redux";
import { getShippingCost } from "@/utils/pricing";

const CartCheckout = () => {
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  const shippingCost = getShippingCost(total);
  const grandTotal = total + shippingCost;
  const canCheckout = cart_products.length > 0;
  const itemLabel = `${cart_products.length} item${cart_products.length === 1 ? "" : "s"}`;

  return (
    <div className="tp-cart-checkout-wrapper aura-cart-summary">
      <div className="aura-cart-summary-head">
        <h3>Order Summary</h3>
        <p>{itemLabel} in your cart.</p>
      </div>

      <div className="aura-cart-summary-lines">
        <div className="tp-cart-checkout-top d-flex align-items-center justify-content-between aura-cart-summary-line">
          <span className="tp-cart-checkout-top-title">Subtotal</span>
          <span className="tp-cart-checkout-top-price">PKR {total.toFixed(2)}</span>
        </div>
        <div className="aura-cart-summary-line d-flex align-items-center justify-content-between">
          <span>Shipping</span>
          <span>{shippingCost > 0 ? `PKR ${shippingCost.toFixed(2)}` : "Free"}</span>
        </div>
      </div>

      <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between aura-cart-summary-total">
        <span>Total</span>
        <span>PKR {grandTotal.toFixed(2)}</span>
      </div>

      <div className="tp-cart-checkout-proceed">
        <Link
          href={canCheckout ? "/checkout" : "/cart"}
          onClick={(event) => {
            if (!canCheckout) {
              event.preventDefault();
            }
          }}
          className={`tp-cart-checkout-btn w-100 aura-cart-checkout-btn ${canCheckout ? "" : "is-disabled"}`}
          aria-disabled={!canCheckout}
        >
          {canCheckout ? "Proceed to Checkout" : "Add Items to Continue"}
        </Link>
      </div>
    </div>
  );
};

export default CartCheckout;
