import React from "react";
import Image from "next/image";
// internal
import ContactForm from "../forms/contact-form";
import contact_icon_1 from "@assets/img/contact/contact-icon-1.png";
import contact_icon_2 from "@assets/img/contact/contact-icon-2.png";
import contact_icon_3 from "@assets/img/contact/contact-icon-3.png";

const ContactArea = () => {
  return (
    <>
      <section className="tp-contact-area pb-100">
        <div className="container">
          <div className="tp-contact-inner">
            <div className="row">
              <div className="col-xl-9 col-lg-8">
                <div className="tp-contact-wrapper">
                  <h3 className="tp-contact-title">Send a Message</h3>
                  <p className="tp-contact-subtitle">
                    Share your inquiry and the NEES team will contact you shortly.
                  </p>

                  <div className="tp-contact-form">
                    {/* form start */}
                    <ContactForm />
                    {/* form end */}
                    <p className="ajax-response"></p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4">
                <div className="tp-contact-info-wrapper">
                  <div className="tp-contact-info-item">
                    <div className="tp-contact-info-icon">
                      <span>
                        <Image src={contact_icon_1} alt="contact-icon" />
                      </span>
                    </div>
                    <div className="tp-contact-info-content">
                      <p data-info="mail">
                        <a 
                          href="mailto:neesmedicalsale@gmail.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          neesmedicalsale@gmail.com
                        </a>
                      </p>
                      <p data-info="phone">
                        <a 
                          href="https://wa.me/923700030710" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          +92 3700030710
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="tp-contact-info-item">
                    <div className="tp-contact-info-icon">
                      <span>
                        <Image src={contact_icon_2} alt="contact-icon" />
                      </span>
                    </div>
                    <div className="tp-contact-info-content">
                      <p>
                        <a
                          href="https://maps.app.goo.gl/cLCsrbirwTH8wFz48"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Office No 602, 6th Floor, Al-Hafeez Heights <br /> 
                          Gulberg 3, Lahore, Pakistan
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="tp-contact-info-item">
                    <div className="tp-contact-info-icon">
                      <span>
                        <Image src={contact_icon_3} alt="contact-icon" />
                      </span>
                    </div>
                    <div className="tp-contact-info-content">
                      <div className="tp-contact-social-wrapper mt-5">
                        <h4 className="tp-contact-social-title">
                          Find on social media
                        </h4>

                        <div className="tp-contact-social-icon">
                          <a href="https://www.facebook.com/neesmedical" target="_blank" rel="noopener noreferrer" aria-label="Visit NEES Medical on Facebook">
                            <i className="fa-brands fa-facebook-f"></i>
                          </a>
                          <a href="https://www.instagram.com/neesmedicalinc/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Visit NEES Medical on Instagram">
                            <i className="fa-brands fa-instagram"></i>
                          </a>
                          <a href="https://www.tiktok.com/@nees_medical_inc" target="_blank" rel="noopener noreferrer" aria-label="Visit NEES Medical on TikTok">
                            <i className="fa-brands fa-tiktok"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactArea;
