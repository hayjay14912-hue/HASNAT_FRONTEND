import { useEffect } from "react";
import { useSelector } from "react-redux";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import ErrorMsg from "../common/error-msg";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  getLineItemTotal,
  getShippingCost,
} from "@/utils/pricing";

const CheckoutOrderArea = ({ checkoutData }) => {
  const {
    handleShippingCost,
    cartTotal = 0,
    isCheckoutSubmit,
    register,
    errors,
    shippingCost,
    discountAmount
  } = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  const qualifiesForFreeShipping = total >= FREE_SHIPPING_THRESHOLD;

  useEffect(() => {
    handleShippingCost(getShippingCost(total));
  }, [handleShippingCost, total]);

  const formatCurrency = (amount) =>
    `PKR ${Number(amount || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="tp-checkout-place white-bg aura-checkout-place">
      <h3 className="tp-checkout-place-title">Your Order</h3>

      <div className="tp-order-info-list">
        <ul>
          {/*  header */}
          <li className="tp-order-info-list-header">
            <h4>Product</h4>
            <h4>Total</h4>
          </li>

          {/*  item list */}
          {cart_products.map((item) => (
            <li key={item._id} className="tp-order-info-list-desc">
              <p>
                {item.title} <span> x {item.orderQuantity}</span>
              </p>
              <span>{formatCurrency(getLineItemTotal(item))}</span>
            </li>
          ))}

          {/*  shipping */}
          <li className="tp-order-info-list-shipping aura-checkout-shipping-row">
            <span>Shipping</span>
            <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end aura-checkout-shipping-item">
              <span className="aura-checkout-shipping-choice">
                <input
                  {...register(`shippingOption`, {
                    required: `Shipping Option is required!`,
                  })}
                  id="flat_shipping"
                  type="radio"
                  name="shippingOption"
                  value="flat_shipping"
                  defaultChecked
                />
                <label
                  onClick={() => handleShippingCost(getShippingCost(total))}
                  htmlFor="flat_shipping"
                >
                  {qualifiesForFreeShipping ? (
                    <>Delivery: Free on orders above <span>{formatCurrency(FREE_SHIPPING_THRESHOLD)}</span></>
                  ) : (
                    <>Delivery: Today Cost :<span>{formatCurrency(STANDARD_SHIPPING_COST)}</span></>
                  )}
                </label>
                <ErrorMsg msg={errors?.shippingOption?.message} />
              </span>
              
            </div>
          </li>

           {/*  subtotal */}
           <li className="tp-order-info-list-subtotal">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </li>

           {/*  shipping cost */}
           <li className="tp-order-info-list-subtotal">
            <span>Shipping Cost</span>
            <span>{formatCurrency(shippingCost)}</span>
          </li>

           {/* discount */}
           <li className="tp-order-info-list-subtotal">
            <span>Discount</span>
            <span>{formatCurrency(discountAmount)}</span>
          </li>

          {/* total */}
          <li className="tp-order-info-list-total">
            <span>Total</span>
            <span>{formatCurrency(parseFloat(cartTotal))}</span>
          </li>
        </ul>
      </div>
      <div className="tp-checkout-payment aura-checkout-payment">
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            type="radio"
            id="cod"
            name="payment"
            value="COD"
            defaultChecked
          />
          <label htmlFor="cod">Cash on Delivery</label>
          <ErrorMsg msg={errors?.payment?.message} />
        </div>
      </div>

      <div className="tp-checkout-btn-wrapper aura-checkout-btn-wrapper">
        <button
          type="submit"
          disabled={isCheckoutSubmit}
          className="tp-checkout-btn w-100"
          aria-busy={isCheckoutSubmit}
        >
          {isCheckoutSubmit ? "Placing Order..." : "Place Order"}
        </button>
        {isCheckoutSubmit && (
          <p className="aura-checkout-trust-note">Please wait, your order is being confirmed.</p>
        )}
        <p className="aura-checkout-trust-note">Secure checkout. Your details stay private.</p>
      </div>
    </div>
  );
};

export default CheckoutOrderArea;
