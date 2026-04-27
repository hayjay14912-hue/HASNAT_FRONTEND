import React from "react";
import Link from "next/link";
import medicalDeviceData from "@/data/medical-device-data";
import DeviceCard from "./device-card";

const FeaturedDevicesPreview = () => {
  return (
    <section className="nees-featured-devices pt-70 pb-90">
      <div className="container">
        <div className="nees-section-head d-flex align-items-end justify-content-between mb-40">
          <div>
            <span>Medical Device Portfolio</span>
            <h2>Professional Systems for Clinics</h2>
          </div>
          <Link href="/medical-devices" className="nees-inline-link">
            View Full Portfolio
          </Link>
        </div>

        <div className="row g-4">
          {medicalDeviceData.slice(0, 3).map((device) => (
            <div key={device.id} className="col-xl-4 col-md-6">
              <DeviceCard device={device} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDevicesPreview;
