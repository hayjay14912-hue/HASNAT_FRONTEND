import Link from "next/link";
import React from "react";
import { ShippingCar } from "@/svg";
import { FREE_SHIPPING_THRESHOLD } from "@/utils/pricing";

const AnnouncementBar = () => {
  return (
    <div className="tp-announcement-bar">
      <div className="container">
        <div className="tp-announcement-bar-inner d-flex align-items-center justify-content-center">
          <span className="tp-announcement-bar-icon" aria-hidden="true">
            <ShippingCar />
          </span>
          <p className="tp-announcement-bar-text">
            Enjoy FREE Shipping on all orders above PKR {FREE_SHIPPING_THRESHOLD}.
            <Link href="/shop"> Shop Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
