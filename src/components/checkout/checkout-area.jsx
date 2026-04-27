import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
// internal
import CheckoutBillingArea from "./checkout-billing-area";
import CheckoutCoupon from "./checkout-coupon";
import CheckoutOrderArea from "./checkout-order-area";
import useCheckoutSubmit from "@/hooks/use-checkout-submit";

const CheckoutArea = () => {
  const checkoutData = useCheckoutSubmit();
  const {handleSubmit,submitHandler,register,errors,handleCouponCode,couponRef,couponApplyMsg} = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  return (
    <>
      <section
        className="tp-checkout-area aura-checkout-area pb-120"
      >
        <div className="container aura-checkout-shell">
          {cart_products.length === 0 && (
            <div className="text-center pt-50 aura-checkout-empty">
              <h3 className="py-2">No items found in cart to checkout</h3>
              <Link href="/shop" className="tp-checkout-btn">
                Return to shop
              </Link>
            </div>
          )}
          {cart_products.length > 0 && (
            <>
              <div className="row">
                <div className="col-xl-7 col-lg-7">
                  <div className="tp-checkout-verify aura-checkout-verify">
                    <CheckoutCoupon
                      handleCouponCode={handleCouponCode}
                      couponRef={couponRef}
                      couponApplyMsg={couponApplyMsg}
                    />
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(submitHandler)} className="aura-checkout-form">
                <div className="row aura-checkout-main-row">
                  <div className="col-lg-7 aura-checkout-left">
                    <CheckoutBillingArea register={register} errors={errors} />
                  </div>
                  <div className="col-lg-5 aura-checkout-right">
                    <CheckoutOrderArea checkoutData={checkoutData} />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CheckoutArea;
