import React, { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import styles from "@/styles/meamo-skin-boosters.module.css";
import { CartTwo, CategoryMenu, Compare, Search, User, Wishlist } from "@/svg";
import useCartInfo from "@/hooks/use-cart-info";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";

const navLinks = [
  { href: "/professional", label: "▦ Wholesale" },
  { href: "/coupon", label: "★ Affiliates" },
  { href: "/coupon", label: "▰ Loyalty Program" },
  { href: "/blog", label: "▣ Blog" },
  { href: "/contact", label: "Support" },
  { href: "/professional", label: "Go PRO" },
  { href: "/contact-sales", label: "Distribution" },
];

const MeamoCloneHeader = () => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const { quantity, total } = useCartInfo();
  const { setSearchText, handleSubmit, searchText } = useSearchFormSubmit();

  const formattedTotal = useMemo(() => Number(total || 0).toFixed(2), [total]);

  return (
    <header className={styles.header}>
      <section className={styles.promoStrip} aria-label="Promotion">
        <button type="button" aria-label="Previous promotion">
          ‹
        </button>
        <div className={styles.promoInner}>
          <span className={styles.promoDot} />
          <strong>TR DOCTORS PLATFORM</strong>
          <span className={styles.trLogo}>TR</span>
          <span className={styles.promoAmp}>&amp;</span>
          <span className={styles.meamoText}>
            me
            <br />
            amo
          </span>
          <span className={styles.promoPill}>FOR ONLY €99/MONTH</span>
        </div>
        <button type="button" aria-label="Next promotion">
          ›
        </button>
      </section>

      <section className={styles.topNotice}>
        <div className={styles.headerContainer}>
          <p>Orders ship weekdays (Mon-Fri) at 11:00 AM KST</p>
          <div className={styles.socialLinks}>
            <Link href="/contact">Contact Support</Link>
            <span>f</span>
            <span>◎</span>
            <span>▶</span>
            <span>◌</span>
            <span>➤</span>
          </div>
        </div>
      </section>

      <section className={styles.mainHeader}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo} aria-label="Hasnat homepage">
            <span className={styles.logoWords}>HASNAT</span>
            <small>Beauty &amp; Skin Aesthetics</small>
          </Link>

          <form className={styles.searchForm} onSubmit={handleSubmit}>
            <span aria-hidden="true" className={styles.searchIcon}>
              <Search />
            </span>
            <input
              type="search"
              placeholder="Search for products"
              aria-label="Search for products"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button type="button">
              Select category
              <i aria-hidden="true" />
            </button>
          </form>

          <div className={styles.headerActions}>
            <Link href="/compare" className={styles.iconAction} aria-label={`Compare (${compareItems.length})`}>
              <Compare />
              {compareItems.length > 0 && <sup>{compareItems.length}</sup>}
            </Link>
            <Link href="/wishlist" className={styles.iconAction} aria-label={`Wishlist (${wishlist.length})`}>
              <Wishlist />
              {wishlist.length > 0 && <sup>{wishlist.length}</sup>}
            </Link>
            <Link href="/login" className={styles.loginLink}>
              <span aria-hidden="true">
                <User />
              </span>
              Login / Register
            </Link>
            <Link href="/cart" className={styles.cartButtonHeader}>
              <CartTwo /> ${formattedTotal}
              <sup>{quantity}</sup>
            </Link>
          </div>
        </div>
      </section>

      <nav className={styles.navbar} aria-label="Main navigation">
        <div className={styles.headerContainer}>
          <button type="button" className={styles.categoryButton}>
            <span aria-hidden="true">
              <CategoryMenu />
            </span>
            Browse Categories
            <i aria-hidden="true" />
          </button>
          {navLinks.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default MeamoCloneHeader;
