import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import { getSiteUrl } from "@/utils/seo-utils";

const ContactSalesPage = () => {
  const router = useRouter();
  const selectedDevice = typeof router.query.device === "string" ? router.query.device : "";
  const inquiryTarget = selectedDevice || "Medical Device";
  const siteUrl = getSiteUrl();
  const whatsappText = `Hi, I want sales support for ${inquiryTarget}.`;
  const emailSubject = `Sales Inquiry - ${inquiryTarget}`;
  const emailBody = `Hello NEES Medical Team,%0D%0A%0D%0AI want sales support for ${inquiryTarget}.%0D%0APlease share next steps, pricing and timeline.%0D%0A%0D%0AThank you.`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "NEES Medical Contact Sales",
    url: `${siteUrl}/contact-sales`,
    description:
      "Contact NEES Medical sales in Lahore, Pakistan for medical device pricing, installation, and onboarding support.",
  };

  return (
    <Wrapper>
      <SEO
        pageTitle="Contact Sales | NEES Medical Lahore"
        description="Speak with NEES Medical sales in Lahore, Pakistan for device pricing, installation scope, and same-day response via phone, WhatsApp, or email."
        canonical="/contact-sales"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Contact Sales" subtitle="Commercial Support" bg_clr={true} />

      <section className="nees-contact-sales pt-80 pb-90">
        <div className="container">
          <div className="row justify-content-center g-4">
            <div className="col-xl-9 col-lg-10">
              <div className="nees-b2b-panel">
                <h3>Speak with a Device Specialist</h3>
                <p>
                  Contact NEES sales directly for pricing, installation scope, maintenance,
                  and training support.
                </p>
                {selectedDevice && (
                  <p>
                    <strong>Selected device:</strong> {selectedDevice}
                  </p>
                )}
                <ul className="nees-contact-points">
                  <li>Phone: <a href="tel:+923700030710">+92 3700030710</a></li>
                  <li>Email: <a href="mailto:neesmedicalsale@gmail.com">neesmedicalsale@gmail.com</a></li>
                  <li>
                    WhatsApp:{" "}
                    <a href={`https://wa.me/923700030710?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer">
                      Start Chat
                    </a>
                  </li>
                </ul>
                <div className="nees-cta-group">
                  <a href="tel:+923700030710" className="nees-btn nees-btn-primary">Call Sales</a>
                  <a href={`mailto:neesmedicalsale@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`} className="nees-btn nees-btn-outline">Email Sales</a>
                  <a href={`https://wa.me/923700030710?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" className="nees-btn nees-btn-ghost">WhatsApp Sales</a>
                </div>
                <Link href="/medical-devices" className="nees-inline-link">
                  Back to Medical Devices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ContactSalesPage;
