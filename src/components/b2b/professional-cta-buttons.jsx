import React from "react";

const ProfessionalCTAButtons = ({
  productName = "Professional Product",
  compact = false,
  className = "",
}) => {
  const whatsappNumber = "923700030710";
  const salesEmail = "neesmedicalsale@gmail.com";
  const whatsappText = encodeURIComponent(`Hi, I want details for ${productName}.`);
  const emailSubject = encodeURIComponent(`Professional Product Inquiry - ${productName}`);
  const emailBody = encodeURIComponent(
    `Hello,\n\nPlease share pricing and availability for ${productName}.\n\nRegards,`
  );

  return (
    <div className={`nees-cta-group ${className}`.trim()}>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="nees-btn nees-btn-primary"
      >
        WhatsApp +92 3700030710
      </a>
      <a
        href={`mailto:${salesEmail}?subject=${emailSubject}&body=${emailBody}`}
        className="nees-btn nees-btn-outline"
      >
        Email {salesEmail}
      </a>
      {!compact && (
        <a href={`tel:+${whatsappNumber}`} className="nees-btn nees-btn-ghost">Call Sales</a>
      )}
    </div>
  );
};

export default ProfessionalCTAButtons;
