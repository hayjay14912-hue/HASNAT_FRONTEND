import React from "react";
import useCartInfo from "@/hooks/use-cart-info";
import { FREE_SHIPPING_THRESHOLD } from "@/utils/pricing";

const RenderCartProgress = () => {
  const { total } = useCartInfo();
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingAmount = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);
  const formatCurrency = (value) =>
    `PKR ${Number(value || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  const reachedFreeShipping = total >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="aura-cart-progress-wrap">
      <p className="aura-cart-progress-label">
        {reachedFreeShipping ? (
          <>Complimentary shipping unlocked</>
        ) : (
          <>
            Add <span>{formatCurrency(remainingAmount)}</span> for complimentary shipping
          </>
        )}
      </p>
      <div
        className="aura-cart-progress-track"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Free shipping progress"
      >
        <div
          className={`aura-cart-progress-fill ${reachedFreeShipping ? "is-complete" : ""}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default RenderCartProgress;
