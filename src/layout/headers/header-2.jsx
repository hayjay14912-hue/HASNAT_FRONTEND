import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import dynamic from "next/dynamic";
// internal
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import { CartTwo, Menu, Wishlist, Search } from '@/svg';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';

const CartMiniSidebar = dynamic(() => import("@/components/common/cart-mini-sidebar"), {
  ssr: false,
});
const OffCanvas = dynamic(() => import("@/components/common/off-canvas"), {
  ssr: false,
});

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
        <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height hasnat-shell-header`}>
          <div className="hasnat-shell-topbar">
            <div className="container">
              <div className="hasnat-shell-topbar-inner">
                <span>Professional skin aesthetics and beauty products</span>
                <a href="https://wa.me/923700030710" target="_blank" rel="noopener noreferrer">
                  +92 3700030710
                </a>
              </div>
            </div>
          </div>

          <div id="header-sticky" className={`hasnat-shell-nav ${sticky ? 'is-sticky' : ''}`}>
            <div className="container">
              <div className="hasnat-shell-nav-inner">
                <div className="hasnat-shell-brand">
                  <Link href="/">
                    <span className="aura-logo-wordmark aura-logo-wordmark-nav">HASNAT</span>
                  </Link>
                  <span className="hasnat-shell-tagline">Skin Aesthetics Store</span>
                </div>

                <div className="hasnat-shell-center d-none d-xl-flex">
                  <nav className="hasnat-shell-links" aria-label="Primary">
                    <Link href="/">Home</Link>
                    <Link href="/shop">All Products</Link>
                    <Link href="/professional">Professional</Link>
                    <Link href="/contact">Contact</Link>
                  </nav>
                </div>

                <div className="hasnat-shell-actions">
                  <div className="hasnat-shell-search aura-header-search-autocomplete d-none d-lg-block">
                    <form onSubmit={handleSubmit}>
                      <input
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                        type="text"
                        placeholder="Search products, concerns, ingredients"
                      />
                      <button type="submit" aria-label="Search">
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
                            <span className="aura-search-suggestion-title">{product?.title || product?.name}</span>
                            <span className="aura-search-suggestion-meta">
                              {product?.category?.name || product?.parent || "Product"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="hasnat-shell-quick">
                    <Link href="/wishlist" className="hasnat-shell-icon-btn hasnat-shell-wish">
                      <Wishlist />
                      <span>{wishlist.length}</span>
                    </Link>
                    <button
                      onClick={() => dispatch(openCartMini())}
                      className="hasnat-shell-icon-btn hasnat-shell-cart cartmini-open-btn"
                      type="button"
                    >
                      <CartTwo />
                      <span>{quantity}</span>
                    </button>
                    <button
                      onClick={() => setIsCanvasOpen(true)}
                      type="button"
                      className="hasnat-shell-icon-btn d-xl-none"
                      aria-label="Open menu"
                    >
                      <Menu />
                    </button>
                    <Link href="/shop" className="hasnat-shell-shopall d-none d-sm-inline-flex">
                      Shop All
                    </Link>
                    <button
                      onClick={() => setIsCanvasOpen(true)}
                      type="button"
                      className="hasnat-shell-shopall d-sm-none"
                      aria-label="Browse categories"
                    >
                      Browse
                    </button>
                  </div>
                </div>
                <div className="hasnat-shell-mobile-nav d-xl-none">
                  <nav className="hasnat-shell-links" aria-label="Primary mobile">
                    <Link href="/">Home</Link>
                    <Link href="/shop">Products</Link>
                    <Link href="/professional">Professional</Link>
                    <Link href="/contact">Contact</Link>
                  </nav>
                  <div className="hasnat-shell-search aura-header-search-autocomplete d-lg-none">
                    <form onSubmit={handleSubmit}>
                      <input
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                        type="text"
                        placeholder="Search products"
                      />
                      <button type="submit" aria-label="Search">
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
                            <span className="aura-search-suggestion-title">{product?.title || product?.name}</span>
                            <span className="aura-search-suggestion-meta">
                              {product?.category?.name || product?.parent || "Product"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
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
