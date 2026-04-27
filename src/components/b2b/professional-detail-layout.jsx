import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProfessionalCTAButtons from "./professional-cta-buttons";
import { getClinicalCategoryName } from "@/config/clinical-categories";
import { getProfessionalTrustMeta } from "@/utils/product-access";
import {
  getProfessionalH1,
  getVisibleProfessionalFaqItems,
} from "@/utils/clinical-seo";

const ProfessionalDetailLayout = ({ product }) => {
  const categoryName = getClinicalCategoryName(product);
  const trustMeta = getProfessionalTrustMeta(product);
  const faqItems = getVisibleProfessionalFaqItems(product);
  const categorySlug = String(categoryName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, "")
    .replace(/\s+/g, "-");

  return (
    <section className="nees-prof-detail pt-70 pb-90">
      <div className="container">
        <div className="row g-5">
          <div className="col-xl-6">
            <div className="nees-prof-detail-media">
              <Image src={product.img} alt={product.title} width={640} height={620} />
              <span className="nees-prof-badge">Professional Use Only</span>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="nees-prof-detail-content">
              <span className="nees-eyebrow">Professional Product</span>
              <h1>{getProfessionalH1(product)}</h1>
              <p>{product.description}</p>

              <div className="mb-20">
                <p className="mb-2"><strong>Category:</strong> {categoryName}</p>
                <p className="mb-2"><strong>Manufacturer / Brand:</strong> {trustMeta.manufacturer}</p>
                <p className="mb-2"><strong>Supply Note:</strong> {trustMeta.origin}</p>
              </div>

              <ProfessionalCTAButtons productName={product.title} />

              <ul className="nees-contact-points mt-20">
                <li>Phone/WhatsApp: <a href="tel:+923700030710">+92 3700030710</a></li>
                <li>Email: <a href="mailto:neesmedicalsale@gmail.com">neesmedicalsale@gmail.com</a></li>
              </ul>

              <div className="mt-30 p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h3 className="h5 mb-15">Professional Supply Guidance</h3>
                <p className="mb-15">
                  This listing is intended for professional inquiry. Contact NEES Medical to confirm
                  current availability, product fit, and the right next step for your clinic or practice.
                </p>
                <ul className="mb-20">
                  {trustMeta.certifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="d-flex flex-wrap gap-2">
                  <Link href="/request-pricing" className="tp-btn">
                    Request Pricing
                  </Link>
                  <Link href={`/professional?category=${categorySlug}`} className="tp-btn tp-btn-border">
                    View {categoryName}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {faqItems.length > 0 && (
          <div className="row mt-50">
            <div className="col-12">
              <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h2 className="h4 mb-20">Product FAQ</h2>
                <div className="row g-4">
                  {faqItems.map((item) => (
                    <div key={item.question} className="col-lg-4">
                      <article>
                        <h3 className="h6 mb-10">{item.question}</h3>
                        <p className="mb-0">{item.answer}</p>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfessionalDetailLayout;
