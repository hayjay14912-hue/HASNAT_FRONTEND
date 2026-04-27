import React from "react";

const trustItems = [
  { id: 1, title: "Clinical Focus", value: "Dermatology and Aesthetic Solutions" },
  { id: 2, title: "Compliance", value: "Regulatory-Aligned Sourcing" },
  { id: 3, title: "Support", value: "Training and Technical Assistance" },
  { id: 4, title: "Partnership", value: "Built for Long-Term Clinic Growth" }
];

const TrustStrip = () => {
  return (
    <section className="nees-trust-strip">
      <div className="container">
        <div className="row g-3">
          {trustItems.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-3 col-md-6">
              <article className="nees-trust-card">
                <p className="nees-trust-card-title">{item.title}</p>
                <h4>{item.value}</h4>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
