import Link from "next/link";
import React from "react";

const audienceCards = [
  {
    id: 1,
    tag: "B2C",
    title: "Shop Skincare and Medical Consumables",
    description:
      "Browse retail-ready products with full e-commerce checkout, secure payment, and direct delivery.",
    cta: "Shop Products",
    href: "/shop"
  },
  {
    id: 2,
    tag: "B2B",
    title: "Explore Professional Medical Devices",
    description:
      "Discover clinic-grade systems with structured specs, ROI guidance, and specialist-led consultation.",
    cta: "Explore Medical Devices",
    href: "/medical-devices"
  }
];

const DualAudienceGateway = () => {
  return (
    <section className="nees-gateway pt-80 pb-80">
      <div className="container">
        <div className="nees-section-head text-center mb-40">
          <span>Choose Your Journey</span>
          <h2>Built for Customers and Clinics</h2>
          <p>NEES Medical combines direct e-commerce with a dedicated professional device inquiry workflow.</p>
        </div>
        <div className="row g-4">
          {audienceCards.map((card) => (
            <div key={card.id} className="col-lg-6">
              <article className="nees-gateway-card h-100">
                <p className="nees-gateway-tag">{card.tag}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link href={card.href} className="nees-btn nees-btn-primary">
                  {card.cta}
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DualAudienceGateway;
