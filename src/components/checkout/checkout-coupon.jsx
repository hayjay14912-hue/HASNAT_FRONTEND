import { useState } from "react";

const CheckoutCoupon = ({ handleCouponCode, couponRef,couponApplyMsg }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="tp-checkout-verify-item aura-checkout-coupon">
      <p className="tp-checkout-verify-reveal aura-checkout-verify-reveal">
        Have a coupon?{" "}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="tp-checkout-coupon-form-reveal-btn"
        >
          Click here to enter your code
        </button>
      </p>

      {isOpen && (
        <div id="tpCheckoutCouponForm" className="tp-return-customer tp-form-pro aura-checkout-coupon-form">
          <form onSubmit={handleCouponCode} className="tp-form-pro">
            <div className="tp-field">
              <label>Coupon Code</label>
              <input ref={couponRef} type="text" placeholder="Enter coupon" />
            </div>
            <div className="tp-actions aura-checkout-coupon-actions">
              <button
                type="submit"
                className="tp-btn-primary"
              >
                Apply
              </button>
            </div>
          </form>
          {couponApplyMsg && <p className="aura-checkout-coupon-msg">{couponApplyMsg}</p>}
        </div>
      )}
    </div>
  );
};

export default CheckoutCoupon;
