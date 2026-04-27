import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import CartArea from '@/components/cart-wishlist/cart-area';
import Link from 'next/link';

const CartPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Cart" />
      <HeaderTwo style_2={true} />
      <section className="aura-cart-hero">
        <div className="container">
          <div className="aura-cart-hero-inner">
            <h1>Shopping Cart</h1>
            <div className="aura-cart-breadcrumb">
              <Link href="/">Home</Link>
              <span>{">"}</span>
              <span>Shopping Cart</span>
            </div>
          </div>
        </div>
      </section>
      <CartArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CartPage;
