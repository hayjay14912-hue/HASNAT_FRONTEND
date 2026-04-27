import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from 'react-redux';
// internal
import { CartTwo, Menu, Search, Wishlist } from '@/svg';
import Menus from './header-com/menus';
import brand_logo from '@assets/img/logo/brand-logo-compact.png';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';

const SearchBar = dynamic(() => import("./header-com/search-bar"), { ssr: false });
const OffCanvas = dynamic(() => import("@/components/common/off-canvas"), { ssr: false });
const CartMiniSidebar = dynamic(() => import("@/components/common/cart-mini-sidebar"), { ssr: false });

const HEADER_LOGO_SIZES = "(max-width: 576px) 42px, (max-width: 768px) 48px, 72px";

const HeaderFour = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cartMiniOpen } = useSelector((state) => state.cart);
  const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  const dispatch = useDispatch();
  return (
    <>
      <header>
        <div id="header-sticky" className={`tp-header-area tp-header-style-transparent-white tp-header-sticky tp-header-transparent has-dark-logo tp-header-height ${sticky ? 'header-sticky' : ''}`}>
          <div className="tp-header-bottom-3 pl-85 pr-85">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-2 col-6">
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
                <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                  <div className="main-menu menu-style-3 menu-style-4 p-relative">
                    <nav className="tp-main-menu-content">
                      <Menus />
                    </nav>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-6">
                  <div className="tp-header-action d-flex align-items-center justify-content-end ml-50">

                    <div className="tp-header-action-item d-none d-sm-block">
                      <button onClick={() => setIsSearchOpen(true)} type="button" className="tp-header-action-btn tp-search-open-btn">
                        <Search />
                      </button>
                    </div>
                    <div className="tp-header-action-item d-none d-sm-block">
                      <Link href="/wishlist" className="tp-header-action-btn">
                        <Wishlist />
                        <span className="tp-header-action-badge">{wishlist.length}</span>
                      </Link>
                    </div>
                    <div className="tp-header-action-item d-none d-sm-block">
                      <button onClick={() => dispatch(openCartMini())} type="button" className="tp-header-action-btn cartmini-open-btn">
                        <CartTwo />
                        <span className="tp-header-action-badge">{quantity}</span>
                      </button>
                    </div>
                    <div className="tp-header-action-item d-lg-none">
                      <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-offcanvas-open-btn">
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
        <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="jewelry" />
      )}
      {/* off canvas end */}
    </>
  );
};

export default HeaderFour;
