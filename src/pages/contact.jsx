import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import ContactBreadcrumb from "@/components/breadcrumb/contact-breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import ContactMap from "@/components/contact/contact-map";
import { getSiteUrl } from "@/utils/seo-utils";

const ContactPage = () => {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NEES Medical",
    url: siteUrl,
    email: "neesmedicalsale@gmail.com",
    telephone: "+923700030710",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office No 602, 6th Floor, Al-Hafeez Heights",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
  };

  return (
    <Wrapper>
      <SEO
        pageTitle="Contact NEES Medical"
        description="Contact NEES Medical Lahore, Pakistan for same-day delivery support, product guidance, and clinic onboarding by phone, email, or WhatsApp."
        canonical="/contact"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      <ContactBreadcrumb />
      <ContactArea/>
      <ContactMap/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ContactPage;
