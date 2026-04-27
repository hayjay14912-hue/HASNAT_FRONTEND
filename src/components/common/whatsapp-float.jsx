import React from "react";

const WhatsAppFloat = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923700030710";
  const defaultMessage = "Hi, I need help with my order.";
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
  const logoSrc = "/assets/img/logo/whatsapp-logo-4456.svg";

  return (
    <div className="whatsapp-float-wrapper" aria-hidden={false}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className="whatsapp-float-icon" aria-hidden="true">
          <img src={logoSrc} alt="" />
        </span>
      </a>
    </div>
  );
};

export default WhatsAppFloat;
