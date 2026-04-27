import Link from "next/link";
import React from "react";

const DeviceCTAButtons = ({ deviceName, className = "", compact = false }) => {
  const encodedName = encodeURIComponent(deviceName || "Medical Device");

  return (
    <div className={`nees-cta-group ${className}`.trim()}>
      <Link href={`/request-proposal?device=${encodedName}`} className="nees-btn nees-btn-primary">
        Request Proposal
      </Link>
      <Link href={`/book-demo?device=${encodedName}`} className="nees-btn nees-btn-outline">
        Book a Demo
      </Link>
      {!compact && (
        <Link href={`/contact-sales?device=${encodedName}`} className="nees-btn nees-btn-ghost">
          Contact Sales
        </Link>
      )}
    </div>
  );
};

export default DeviceCTAButtons;
