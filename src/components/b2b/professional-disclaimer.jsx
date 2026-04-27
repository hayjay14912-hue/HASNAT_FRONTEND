import React from "react";

const ProfessionalDisclaimer = ({ compact = false }) => {
  return (
    <div className={`nees-prof-disclaimer ${compact ? "is-compact" : ""}`.trim()}>
      <h4>Professional Use Only</h4>
      <p>
        This product is intended for professional and clinical use only. Online checkout is disabled.
        Please contact NEES Medical via WhatsApp, email, or phone for verification and offline fulfillment.
      </p>
    </div>
  );
};

export default ProfessionalDisclaimer;
