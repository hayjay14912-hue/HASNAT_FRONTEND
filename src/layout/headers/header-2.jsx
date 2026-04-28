import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from "next/dynamic";
// internal
import Menus from './header-com/menus';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import HeaderTopRight from './header-com/header-top-right';
import { CartTwo, Compare, Facebook, Menu, PhoneTwo, Wishlist, Search } from '@/svg';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import AnnouncementBar from './header-com/announcement-bar';
import brand_logo from '@assets/img/logo/brand-logo-compact.png';

const CartMiniSidebar = dynamic(() => import("@/components/common/cart-mini-sidebar"), {
  ssr: false,
});
const OffCanvas = dynamic(() => import("@/components/common/off-canvas"), {
  ssr: false,
});

const HEADER_LOGO_SIZES = "(max-width: 576px) 42px, (max-width: 768px) 48px, 72px";

const HeaderTwo = ({ style_2 = false }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const {
    setSearchText,
    handleSubmit,
    searchText,
    suggestions,
    showSuggestions,
    handleSuggestionSelect,
  } = useSearchFormSubmit();
  const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  const dispatch = useDispatch();
  const { cartMiniOpen } = useSelector((state) => state.cart);
  return (
    <>
      <header>
        <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height`}>
          <AnnouncementBar />
          <div className="tp-header-top-2 p-relative z-index-11 tp-header-top-border d-none d-md-block">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-header-info d-flex align-items-center">
                    {/* Instagram Followers */}
                    <div className="tp-header-info-item">
                      <a 
                        href="https://www.instagram.com/neesmedicalinc/?hl=en"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <span>
                          <Facebook />
                        </span> 1000+ Followers
                      </a>
                    </div>

                    {/* WhatsApp Contact */}
                    <div className="tp-header-info-item">
                      <a 
                        href="https://wa.me/923700030710"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <span>
                          <PhoneTwo />
                        </span> +92 3700030710
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-header-top-right tp-header-top-black d-flex align-items-center justify-content-end">
                    <HeaderTopRight />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="header-sticky" className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}>
            <div className="container">
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center">
	                  <div className="col-xl-2 col-lg-5 col-md-5 col-sm-4 col-6">
	                    <div className="logo">
	                      <Link href="/">
	                        <Image
                            className="aura-brand-logo"
                            src={brand_logo}
                            alt="NEES Medical Inc logo"
                            width={72}
                            height={72}
                            sizes={HEADER_LOGO_SIZES}
                            priority
                            fetchPriority="high"
                          />
	                      </Link>
	                    </div>
	                  </div>
                  <div className="col-xl-5 d-none d-xl-block">
                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content">
                        <Menus />
                      </nav>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-7 col-md-7 col-sm-8 col-6">
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end pl-30">
                      <div className="tp-header-search-2 d-none d-sm-block aura-header-search-autocomplete">
                        <form onSubmit={handleSubmit}>
                          <input
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            type="text"
                            placeholder="Search by product, concern, or ingredient" />
                          <button type="submit">
                            <Search />
                          </button>
                        </form>
                        {showSuggestions && (
                          <div className="aura-search-suggestions" role="listbox" aria-label="Product suggestions">
                            {suggestions.map((product) => (
                              <button
                                key={product?._id || product?.id || product?.slug || product?.title}
                                type="button"
                                className="aura-search-suggestion-item"
                                onClick={() => handleSuggestionSelect(product)}
                              >
                                <span className="aura-search-suggestion-title">
                                  {product?.title || product?.name}
                                </span>
                                <span className="aura-search-suggestion-meta">
                                  {product?.category?.name || product?.parent || "Product"}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="tp-header-action d-flex align-items-center ml-30">
                        <div className="tp-header-action-item d-none d-xxl-block">
                        <Link href="/shop" className="aura-header-pill-btn aura-header-pill-btn-light">
                          Shop All
                        </Link>
                        </div>
                        <div className="tp-header-action-item d-none d-lg-block">
                          <Link href="/compare" className="tp-header-action-btn">
                            <Compare />
                          </Link>
                        </div>
                        <div className="tp-header-action-item">
                          <Link href="/wishlist" className="tp-header-action-btn">
                            <Wishlist />
                            <span className="tp-header-action-badge">{wishlist.length}</span>
                          </Link>
                        </div>
                        <div className="tp-header-action-item">
                          <button 
                            onClick={() => dispatch(openCartMini())} 
                            className="tp-header-action-btn cartmini-open-btn" 
                          >
                            <CartTwo />
                            <span className="tp-header-action-badge">{quantity}</span>
                          </button>
                        </div>
                        <div className="tp-header-action-item tp-header-hamburger mr-20 d-xl-none">
                          <button 
                            onClick={() => setIsCanvasOpen(true)} 
                            type="button" 
                            className="tp-header-action-btn tp-offcanvas-open-btn"
                          >
                            <Menu />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* cart mini sidebar start */}
      {cartMiniOpen && <CartMiniSidebar />}
      {/* cart mini sidebar end */}

      {/* off canvas start */}
      {isOffCanvasOpen && (
        <OffCanvas 
          isOffCanvasOpen={isOffCanvasOpen} 
          setIsCanvasOpen={setIsCanvasOpen} 
          categoryType="beauty" 
        />
      )}
      {/* off canvas end */}
    </>
  );
};

export default HeaderTwo;
