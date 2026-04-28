import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from 'react-redux';
// internal
import { CartTwo, Menu, Search, Wishlist } from '@/svg';
import Menus from './header-com/menus';
import brand_logo from '@assets/img/logo/brand-logo-compact.png';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import AnnouncementBar from './header-com/announcement-bar';

const SearchBar = dynamic(() => import("./header-com/search-bar"), { ssr: false });
const OffCanvas = dynamic(() => import("@/components/common/off-canvas"), { ssr: false });
const CartMiniSidebar = dynamic(() => import("@/components/common/cart-mini-sidebar"), { ssr: false });

const HEADER_LOGO_SIZES = "(max-width: 576px) 46px, (max-width: 768px) 54px, 80px";

const HeaderThree = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cartMiniOpen } = useSelector((state) => state.cart);
  return (
    <>
      <header>
        <div id="header-sticky" className={`tp-header-area tp-header-style-transparent-white tp-header-transparent tp-header-sticky has-dark-logo tp-header-height aura-header-wrap ${sticky ? 'header-sticky' : ''}`}>
          <AnnouncementBar />
          <div className="tp-header-bottom-3">
            <div className="container aura-header-container">
              <div className="row align-items-center">
                <div className="col-xl-3 col-lg-3 col-6">
                  <div className="logo">
                    <Link href="/">
                      <Image
                        className="aura-brand-logo"
                        src={brand_logo}
                        alt="HASNAT logo"
                        width={80}
                        height={80}
                        sizes={HEADER_LOGO_SIZES}
                        priority
                        fetchPriority="high"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-5 d-none d-lg-block">
                  <div className="main-menu menu-style-3 p-relative d-flex align-items-center justify-content-center">
                    <nav className="tp-main-menu-content">
                      <Menus />
                    </nav>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-6">
                  <div className="tp-header-action aura-header-actions d-flex align-items-center justify-content-end">
                    <div className="tp-header-action-item">
                      <button onClick={() => setIsSearchOpen(true)} type="button" className="tp-header-action-btn tp-search-open-btn">
                        <Search />
                      </button>
                    </div>
                    <div className="tp-header-action-item">
                      <button onClick={() => dispatch(openCartMini())} type="button" className="tp-header-action-btn cartmini-open-btn">
                        <CartTwo />
                        <span className="tp-header-action-badge">{quantity}</span>
                      </button>
                    </div>
                    <div className="tp-header-action-item">
                      <Link href="/wishlist" prefetch={false} className="tp-header-action-btn">
                        <Wishlist />
                        <span className="tp-header-action-badge">{wishlist?.length || 0}</span>
                      </Link>
                    </div>
                    <div className="aura-header-cta-group d-none d-xl-flex">
                      <Link href="/shop" prefetch={false} className="aura-header-pill-btn">
                        Shop All
                      </Link>
                    </div>
                    <div className="tp-header-action-item d-lg-none">
                      <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-header-action-btn tp-offcanvas-open-btn">
                        <Menu />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* search bar start */}
      {isSearchOpen && <SearchBar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />}
      {/* search bar end */}

      {/* cart mini sidebar start */}
      {cartMiniOpen && <CartMiniSidebar />}
      {/* cart mini sidebar end */}

      {/* off canvas start */}
      {isOffCanvasOpen && (
        <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="beauty" />
      )}
      {/* off canvas end */}
    </>
  );
};

export default HeaderThree;
