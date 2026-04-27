import React from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import DeviceCTAButtons from "@/components/b2b/device-cta-buttons";
import MachinesShowroom from "@/components/b2b/machines-showroom";

const MedicalDevicesPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Medical Devices" />
      <HeaderTwo style_2={true} />

      <CommonBreadcrumb title="Medical Devices" subtitle="Medical Devices" bg_clr={true} />

      <section className="nees-devices-hero pt-80 pb-80">
        <div className="container">
          <div className="nees-devices-hero-card">
            <div className="nees-devices-hero-content">
              <span className="nees-eyebrow">Clinical Device Portfolio</span>
              <h1>Compare Leading Aesthetic Device Brands in One Place</h1>
              <p>
                Discover trusted platforms from multiple manufacturers, review device options by brand,
                and get direct support from the NEES clinical sales team.
              </p>
            </div>
            <div className="nees-devices-hero-actions">
              <h3>Talk to Device Specialists</h3>
              <p>Fast commercial response for proposals, demos, and clinic onboarding.</p>
              <DeviceCTAButtons deviceName="NEES Device Portfolio" className="nees-hero-cta nees-hero-cta--panel" />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-30 pb-90">
        <MachinesShowroom />
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default MedicalDevicesPage;
