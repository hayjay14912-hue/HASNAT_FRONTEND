import React from "react";
import Link from "next/link";

const BeautyOfferBanner = () => {
  return (
    <section className="aura-offer-band pt-105 pb-95">
      <div className="container">
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-7">
            <article className="aura-offer-card aura-offer-card-primary h-100">
              <span className="aura-offer-chip">Clinical Proof Focus</span>
              <h3>High-Performance Formulas with Ingredient Transparency</h3>
              <p>
                Product pages are structured for stronger conversion: key benefits,
                ingredient clarity, and confidence signals before checkout.
              </p>
              <div className="aura-offer-actions">
                <Link href="/shop" className="tp-btn">Explore Best Sellers</Link>
                <Link href="/blog" className="tp-btn tp-btn-border">Read Product Guides</Link>
              </div>
            </article>
          </div>
          <div className="col-lg-5">
            <article className="aura-offer-card aura-offer-card-secondary h-100">
              <span className="aura-offer-chip">Wholesale & Devices</span>
              <h3>Need Clinic Pricing or Device Quotations?</h3>
              <p>
                Contact our B2B team directly by call, email, or WhatsApp for
                faster clinic support and assisted onboarding.
              </p>
              <div className="aura-offer-actions">
                <Link href="/request-pricing" className="tp-btn">Contact for Product Inquiry</Link>
                <Link href="/request-quote" className="tp-btn tp-btn-border">Request Device Quote</Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeautyOfferBanner;
