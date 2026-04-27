import React from 'react';

const ContactMap = () => {
  return (
    <section className="tp-map-area pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-map-wrapper">
              <div className="tp-map-hotspot">
                <span className="tp-hotspot tp-pulse-border">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="6" cy="6" r="6" fill="#821F40" />
                  </svg>
                </span>
              </div>

              {/* Office Location Map */}
              <div
                className="tp-map-iframe"
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.350352133466!2d74.34219317582416!3d31.51453607421657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190573d80f41bd%3A0x2e5c341b610ea82!2sAl%20Hafeez%20Heights!5e0!3m2!1sen!2s!4v1756453525101!5m2!1sen!2s"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Directions Button */}
              <div className="text-center mt-4">
                <a
                  href="https://maps.app.goo.gl/cLCsrbirwTH8wFz48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Get Directions
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
