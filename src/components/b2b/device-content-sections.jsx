import React from "react";

const DeviceContentSections = ({ device }) => {
  return (
    <div className="nees-device-sections">
      <section className="nees-device-section" id="overview">
        <h3>Overview</h3>
        <p>{device.overview}</p>
      </section>

      <section className="nees-device-section" id="clinical-benefits">
        <h3>Clinical Benefits</h3>
        <ul>
          {device.clinicalBenefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>

      <section className="nees-device-section" id="technical-specifications">
        <h3>Technical Specifications</h3>
        <div className="table-responsive">
          <table className="table nees-spec-table">
            <tbody>
              {device.technicalSpecifications.map((spec) => (
                <tr key={spec.label}>
                  <th scope="row">{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="nees-device-section" id="roi-for-clinics">
        <h3>ROI for Clinics</h3>
        <ul>
          {device.roiHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="nees-device-section" id="certifications">
        <h3>Certifications</h3>
        <div className="nees-cert-list">
          {device.certifications.map((certification) => (
            <span key={certification}>{certification}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DeviceContentSections;
