import Link from "next/link";
import React from "react";

const InquiryCTAInline = ({ productName, className = "", compact = false }) => {
  const encodedName = encodeURIComponent(productName || "Professional Product");

  return (
    <div className={`nees-inquiry-inline ${className}`.trim()}>
      <Link href={`/request-pricing?product=${encodedName}`} className="nees-inquiry-link">
        Contact Sales
      </Link>
      {!compact && (
        <a
          href={`https://wa.me/923700030710?text=${encodeURIComponent(
            `Hi, I want to enquire about ${productName}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nees-inquiry-link"
        >
          WhatsApp to Order
        </a>
      )}
    </div>
  );
};

export default InquiryCTAInline;
