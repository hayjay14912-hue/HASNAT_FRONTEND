import React from "react";
import { useRouter } from "next/router";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import { getSiteUrl } from "@/utils/seo-utils";

const RequestPricingPage = () => {
  const router = useRouter();
  const selectedProduct = typeof router.query.product === "string" ? router.query.product : "";
  const inquiryTarget = selectedProduct || "Professional Product";
  const siteUrl = getSiteUrl();
  const whatsappText = `Hi, I need clinical pricing and availability for ${inquiryTarget}.`;
  const emailSubject = `Clinical Inquiry - ${inquiryTarget}`;
  const emailBody = `Hello NEES Medical Team,%0D%0A%0D%0AI want to inquire about ${inquiryTarget}.%0D%0APlease share availability and commercial details.%0D%0A%0D%0AThank you.`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "NEES Medical Clinical Inquiry",
    url: `${siteUrl}/request-pricing`,
    description:
      "Clinical pricing and availability inquiry page for NEES Medical Lahore, Pakistan.",
  };

  return (
    <Wrapper>
      <SEO
        pageTitle="Clinical Pricing Inquiry | NEES Medical Lahore"
        description="Request professional product pricing and availability from NEES Medical Lahore, Pakistan with same-day response via phone, WhatsApp, or email."
        canonical="/request-pricing"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Contact Sales" subtitle="Professional Product Inquiry" bg_clr={true} />

      <section className="nees-form-page pt-80 pb-90">
        <div className="container">
          <div className="row justify-content-center g-4">
            <div className="col-xl-9 col-lg-10">
              <div className="nees-b2b-panel">
                <h3>Direct Clinical Inquiry</h3>
                <p>
                  No long form required. Contact our sales team directly for product pricing,
                  availability, and clinic onboarding.
                </p>
                {selectedProduct && (
                  <p>
                    <strong>Product of interest:</strong> {selectedProduct}
                  </p>
                )}
                <ul className="nees-contact-points">
                  <li>
                    Phone: <a href="tel:+923700030710">+92 3700030710</a>
                  </li>
                  <li>
                    Email: <a href="mailto:neesmedicalsale@gmail.com">neesmedicalsale@gmail.com</a>
                  </li>
                  <li>
                    WhatsApp:{" "}
                    <a href={`https://wa.me/923700030710?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer">
                      Start Chat
                    </a>
                  </li>
                </ul>

                <div className="nees-cta-group">
                  <a href="tel:+923700030710" className="nees-btn nees-btn-primary">
                    Call Sales
                  </a>
                  <a href={`mailto:neesmedicalsale@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`} className="nees-btn nees-btn-outline">
                    Email Sales
                  </a>
                  <a
                    href={`https://wa.me/923700030710?text=${encodeURIComponent(whatsappText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="nees-btn nees-btn-ghost"
                  >
                    WhatsApp Sales
                  </a>
                </div>

                <div className="nees-feature-grid">
                  <article>
                    <h4>Fast Response</h4>
                    <p>Get direct support from NEES clinical sales without waiting for multi-step submission.</p>
                  </article>
                  <article>
                    <h4>What to Share</h4>
                    <p>Send clinic name, city, required quantity, and expected timeline for faster handling.</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default RequestPricingPage;
