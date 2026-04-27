import React from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import medicalDeviceData, { getMedicalDeviceBySlug } from "@/data/medical-device-data";
import DeviceCTAButtons from "@/components/b2b/device-cta-buttons";
import DeviceContentSections from "@/components/b2b/device-content-sections";
import RequestQuoteForm from "@/components/forms/request-quote-form";
import { ensureAbsoluteUrl, getSiteUrl } from "@/utils/seo-utils";

const MedicalDeviceDetailPage = ({ device }) => {
  if (!device) {
    return null;
  }
  const siteUrl = getSiteUrl();
  const canonical = `/medical-devices/${device.slug}`;
  const pageTitle = `${device.name} | Shop Aesthetic Devices in Pakistan | NEES Medical`;
  const pageDescription = `${device.shortDescription} Same-day consultation support in Lahore, Pakistan.`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: device.name,
    brand: {
      "@type": "Brand",
      name: device.manufacturer || "NEES Medical",
    },
    image: [ensureAbsoluteUrl(device.heroImage)],
    description: pageDescription,
    sku: `${device.brandId || "nees"}-${device.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}${canonical}`,
      seller: {
        "@type": "Organization",
        name: "NEES Medical",
      },
    },
  };

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical={canonical}
        image={device.heroImage}
        type="product"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title={device.name} subtitle="Medical Device Details" bg_clr={true} />

      <section className="nees-device-detail pt-80 pb-90">
        <div className="container">
          <div className="row g-5">
            <div className="col-xl-8">
              <header className="nees-device-detail-head mb-40">
                <span className="nees-eyebrow">{device.manufacturer}</span>
                <h1>{device.name}</h1>
                <p>{device.headline}</p>
                <DeviceCTAButtons deviceName={device.name} />
              </header>

              <DeviceContentSections device={device} />
            </div>

            <div className="col-xl-4">
              <aside className="nees-device-sidebar">
                <div className="nees-device-sidebar-card mb-30">
                  <h4>Lead Capture</h4>
                  <p>Speak with a specialist for pricing, installation scope, and clinic onboarding.</p>
                  <DeviceCTAButtons deviceName={device.name} compact={true} />
                </div>

                <RequestQuoteForm
                  preselectedDevice={device.name}
                  sourcePage={`/medical-devices/${device.slug}`}
                  title="Request Device Quote"
                />
              </aside>
            </div>
          </div>
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export const getStaticPaths = async () => {
  const paths = medicalDeviceData.map((device) => ({ params: { slug: device.slug } }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps = async ({ params }) => {
  const device = getMedicalDeviceBySlug(params.slug);

  return {
    props: {
      device: device || null
    }
  };
};

export default MedicalDeviceDetailPage;
