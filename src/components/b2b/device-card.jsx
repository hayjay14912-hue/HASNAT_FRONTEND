import Link from "next/link";
import React from "react";
import DeviceCTAButtons from "./device-cta-buttons";

const DeviceCard = ({ device }) => {
  return (
    <article className="nees-device-card h-100">
      <span className="nees-device-chip">{device.manufacturer}</span>
      <h3>
        <Link href={`/medical-devices/${device.slug}`}>{device.name}</Link>
      </h3>
      <p>{device.shortDescription}</p>
      <ul>
        {device.useCases.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="nees-device-card-actions">
        <Link href={`/medical-devices/${device.slug}`} className="nees-inline-link">
          View Clinical Details
        </Link>
        <DeviceCTAButtons deviceName={device.name} compact={true} />
      </div>
    </article>
  );
};

export default DeviceCard;
