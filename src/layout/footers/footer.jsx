import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import pay from '@assets/img/footer/footer-pay.png';
import social_data from '@/data/social-data';
import { Email, Location } from '@/svg';
import brand_logo from '@assets/img/logo/brand-logo-compact.png';

const Footer = ({ style_2 = false, style_3 = false,primary_style=false }) => {
  return (
    <footer>
      <div className={`tp-footer-area ${primary_style?'tp-footer-style-2 tp-footer-style-primary tp-footer-style-6':''} ${style_2 ?'tp-footer-style-2':style_3 ? 'tp-footer-style-2 tp-footer-style-3': ''}`}
        data-bg-color={`${style_2 ? 'footer-bg-white' : 'footer-bg-grey'}`}>
        <div className="tp-footer-top pt-95 pb-40">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-1 mb-50">
	                  <div className="tp-footer-widget-content">
	                    <div className="tp-footer-logo">
	                      <Link href="/">
	                        <Image
	                          className="aura-brand-logo"
	                          src={brand_logo}
	                          alt="HASNAT logo"
                            width={72}
                            height={72}
                            sizes="(max-width: 768px) 52px, 72px"
	                        />
	                      </Link>
	                    </div>
	                    <p className="tp-footer-desc">
	                      Premium skincare and aesthetic solutions with easy online shopping across all product categories.
	                    </p>
                    <div className="tp-footer-social">
                      {social_data.map(s => <a href={s.link} key={s.id} target="_blank" rel="noopener noreferrer">
                        <i className={s.icon}></i>
                      </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-2 mb-50">
                  <h4 className="tp-footer-widget-title">Shop</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><Link href="/shop">All Products</Link></li>
                      <li><Link href="/products/keyword/sunscreen">Sunscreen in Pakistan</Link></li>
                      <li><Link href="/blog/best-sunscreen-stick-pakistan-2026-spf-50-sunstick-guide">Best Sunscreen Stick Guide</Link></li>
                      <li><Link href="/glutanex-retinol-eye-cream">Glutanex Retinol Eye Cream</Link></li>
                      <li><Link href="/visvisal">Visvisal (Viviscal)</Link></li>
                      <li><Link href="/shop?status=on-sale">Offers & Promotions</Link></li>
                      <li><Link href="/wishlist">Wishlist</Link></li>
                      <li><Link href="/cart">Cart</Link></li>
                      <li><Link href="/checkout">Checkout</Link></li>
                      <li><Link href="/contact">Customer Support</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-3 mb-50">
                  <h4 className="tp-footer-widget-title">Customer Care</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li><Link href="/contact">Contact Us</Link></li>
                      <li><Link href="/request-quote">Request Quote</Link></li>
                      <li><Link href="/coupon">Coupons</Link></li>
                      <li><Link href="/login">Login</Link></li>
                      <li><Link href="/register">Create Account</Link></li>
                      <li><Link href="/profile">My Account</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-4 mb-50">
                  <h4 className="tp-footer-widget-title">Talk To Us</h4>
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-talk mb-20">
                      <span>Need product guidance or clinic onboarding?</span>
                      <h4><a href="https://wa.me/923700030710" target="_blank" rel="noopener noreferrer">+92 3700030710</a></h4>
                    </div>
                    <div className="tp-footer-contact">
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Email />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><a href="mailto:neesmedicalsale@gmail.com">neesmedicalsale@gmail.com</a></p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Location />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><a href="https://maps.app.goo.gl/cLCsrbirwTH8wFz48" target="_blank" rel="noopener noreferrer">Office No 602, 6th Floor, Al-Hafeez Heights <br /> Gulberg 3, Lahore, Pakistan</a></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tp-footer-bottom">
          <div className="container">
            <div className="tp-footer-bottom-wrapper">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-footer-copyright">
                    <p>
                      © {new Date().getFullYear()} HASNAT. All rights reserved.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-footer-payment text-md-end">
                    <p>
                      <Image src={pay} alt="pay" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
