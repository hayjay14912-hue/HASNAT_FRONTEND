import React from 'react';
import Link from 'next/link';
// internal
import SEO from '@/components/seo';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import CheckoutArea from '@/components/checkout/checkout-area';


const CheckoutPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Checkout" />
      <HeaderTwo style_2={true} />
      <section className="aura-checkout-hero">
        <div className="container">
          <div className="aura-checkout-hero-inner">
            <h1>Checkout</h1>
            <div className="aura-checkout-breadcrumb">
              <Link href="/">Home</Link>
              <span>{">"}</span>
              <span>Checkout</span>
            </div>
          </div>
        </div>
      </section>
      <CheckoutArea/>
      <Footer style_2={true} />
    </Wrapper>
  );
};

export default CheckoutPage;
