import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
// TODO: Replace these placeholder images with actual skincare product images:
// - featured_1: Should be Glutanex skincare product image
// - featured_2: Should be BC Ceuticals skincare product image  
// - featured_3: Should be Visvical skincare product image
import featured_1 from '@assets/img/product/featured/featured-2.jpg';
import featured_2 from '@assets/img/product/featured/featured-3.png';
import featured_3 from '@assets/img/product/featured/featured-2.jpg';

// luxury skincare brands data 
const luxury_skincare_data = [
  {
    id: 1,
    img: featured_1,
    brand: 'Glutanex',
    title: 'Advanced Skin Brightening',
    link: '/glutanex-retinol-eye-cream',
    subtitle: 'Premium glutathione-based skincare for radiant, even-toned complexion',
    category: 'Brightening',
    badge: 'Best Seller',
    tone: 'tone-glow',
    features: ['Anti-aging', 'Brightening', 'Hydrating']
  },
  {
    id: 2,
    img: featured_2,
    brand: 'BC Ceuticals',
    title: 'Clinical Grade Formulations',
    link: '/search?searchText=bc%20ceuticals',
    subtitle: 'Scientifically formulated skincare backed by dermatological research',
    category: 'Clinical',
    badge: 'New Launch',
    tone: 'tone-clinical',
    features: ['Clinical Grade', 'Dermatologist Tested', 'Fragrance Free']
  },
  {
    id: 3,
    img: featured_3,
    brand: 'Visvical',
    title: 'Natural & Organic Solutions',
    link: '/visvisal',
    subtitle: 'Pure botanical extracts for sensitive and reactive skin types',
    category: 'Natural',
    badge: 'Organic',
    tone: 'tone-organic',
    features: ['100% Natural', 'Sensitive Skin', 'Eco-Friendly']
  },
]

const BeautyFeatured = () => {
  return (
    <>
      <section className="tp-luxury-skincare-area pt-120 pb-90">
        <div className="tp-luxury-bg-shape tp-luxury-bg-shape-1" aria-hidden="true"></div>
        <div className="tp-luxury-bg-shape tp-luxury-bg-shape-2" aria-hidden="true"></div>
        <div className="container">
          {/* Section Header */}
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-luxury-head text-center mb-60">
                <span className="tp-luxury-eyebrow">Premium Edit</span>
                <h2 className="tp-luxury-heading">Luxury Skincare Brands</h2>
                <p className="tp-luxury-description">
                  Discover our curated selection of premium skincare brands, each offering unique formulations 
                  backed by science and nature for your most radiant skin.
                </p>
              </div>
            </div>
          </div>

          {/* Luxury Skincare Products Grid */}
          <div className="row g-4">
            {luxury_skincare_data.map((item) => (
              <div key={item.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <article className={`tp-luxury-card ${item.tone}`}>
                  {/* Product Image Container */}
                  <div className="tp-luxury-card-media">
                    <div className="tp-luxury-badge">
                      <span className="badge-text">{item.badge}</span>
                    </div>
                    <Image
                      className="tp-luxury-image"
                      src={item.img}
                      alt={item.title}
                      width={280}
                      height={280}
                      sizes="(max-width: 575px) 70vw, (max-width: 991px) 40vw, 280px"
                    />
                  </div>

                  {/* Product Content */}
                  <div className="tp-luxury-card-content">
                    <div className="tp-luxury-brand-row">
                      <span className="tp-luxury-brand-name">{item.brand}</span>
                      <span className="tp-luxury-category-tag">{item.category}</span>
                    </div>
                    
                    <h3 className="tp-luxury-card-title">
                      <Link href={item.link}>{item.title}</Link>
                    </h3>
                    
                    <p className="tp-luxury-card-subtitle">{item.subtitle}</p>
                    
                    {/* Features List */}
                    <div className="tp-luxury-features">
                      {item.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="row mt-60">
            <div className="col-xl-12">
              <div className="tp-luxury-cta-panel">
                <div className="tp-luxury-cta-copy">
                  <h3 className="tp-luxury-cta-title">Your Skin. Your Glow.</h3>
                  <p className="tp-luxury-cta-description">
                    Explore transformative skincare powered by innovation, crafted for real results you can see and feel.
                  </p>
                </div>
                <Link href="/shop" className="tp-luxury-cta-btn">
                  Explore Full Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BeautyFeatured;
