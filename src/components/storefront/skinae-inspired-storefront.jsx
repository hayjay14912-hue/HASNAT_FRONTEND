import { useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { buildProductPath } from "@/utils/seo-utils";
import styles from "@/styles/skinae-inspired-storefront.module.css";

const NAV_CATEGORIES = [
  "Exosomes",
  "Injectables",
  "Chemical Peels",
  "Fillers",
  "Permanent Makeup",
  "BB Glow Treatment",
];

const HERO_VIDEO = {
  src: "https://cdn.coverr.co/videos/coverr-applying-face-serum-1565/1080p.mp4",
  fallback:
    "https://images.unsplash.com/photo-1571781418606-70265b9cce90?auto=format&fit=crop&w=1800&q=85",
};

const PROMO_BANNERS = [
  {
    id: "pigmentation",
    title: "Treat Pigmentation and Dull Skin",
    subtitle: "Korean-inspired brightening cocktails, boosters and home-care essentials.",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1800&q=85",
    cta: "Shop Skin Care",
    href: "/shop",
  },
  {
    id: "exosomes",
    title: "Exosomes and PDRN",
    subtitle: "Premium recovery, glow and scalp support formulas.",
    image:
      "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771617423/zadz9gnf27n3h63sw61v.png",
    cta: "Explore Exosomes",
    href: "/shop",
  },
  {
    id: "fillers",
    title: "Fillers, Threads and Boosters",
    subtitle: "A curated injectable aesthetic product range in one storefront.",
    image:
      "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043062/nyyca2lwc2xswn0kukfb.png",
    cta: "View Range",
    href: "/shop",
  },
];

const TREATMENT_TILES = [
  {
    title: "Exosomes",
    caption: "Regenerative scalp and skin support formulas",
    image:
      "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771617423/zadz9gnf27n3h63sw61v.png",
  },
  {
    title: "Injectables",
    caption: "Clinic-use injectable and treatment ampoule range",
    image:
      "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043062/nyyca2lwc2xswn0kukfb.png",
  },
  {
    title: "Chemical Peels",
    caption: "Texture, acne, and pigmentation peel protocols",
    image:
      "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771067912/sevbznmdjdwxvkw5w3ov.png",
  },
  {
    title: "Fillers",
    caption: "Volume, contouring, and structural support products",
    image:
      "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043062/nyyca2lwc2xswn0kukfb.png",
  },
  {
    title: "Permanent Makeup",
    caption: "PMU essentials, pigments, and procedure support",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "BB Glow Treatment",
    caption: "Brightening and glow-focused treatment products",
    image:
      "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043049/bsv2pup3qxr9ikopwwja.png",
  },
];

const PRODUCT_RAILS = [
  {
    title: "Top Selling Exosomes",
    subtitle: "Regenerative exosome and scalp-support products",
    category: "Exosomes",
  },
  {
    title: "Best Injectables",
    subtitle: "High-demand injectable treatments and ampoules",
    category: "Injectables",
  },
  {
    title: "BB Glow and Peels",
    subtitle: "Glow protocols and chemical peel solutions",
    category: "BB Glow Treatment",
  },
  {
    title: "Chemical Peel Protocols",
    subtitle: "Acid peels and clinical resurfacing products",
    category: "Chemical Peels",
  },
  {
    title: "Filler Essentials",
    subtitle: "Contouring and volume-focused filler products",
    category: "Fillers",
  },
];

const getSearchText = (product) =>
  [
    product?.title,
    product?.description,
    product?.brand?.name,
    product?.category?.name,
    product?.parent,
    product?.children,
    product?.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const formatPKR = (value) => {
  const amount = Number(value || 0);
  if (!amount || amount <= 0) return "Price on request";

  return `PKR ${amount.toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  })}`;
};

const getSalePrice = (product) => {
  const price = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);

  if (!price || price <= 0) return 0;
  if (!discount || discount <= 0) return price;

  return Math.max(0, price - (price * discount) / 100);
};

const getImage = (product) =>
  product?.img ||
  (Array.isArray(product?.imageURLs) ? product.imageURLs[0]?.img : "") ||
  "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684890/ptt8lk2ofzmc4vbzpc3l.jpg";

const getCategoryLabel = (product) =>
  product?.children || product?.category?.name || product?.parent || "Skin Aesthetics";

const normalizeCategoryKey = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const CATEGORY_ALIASES = {
  [normalizeCategoryKey("Exosomes")]: [normalizeCategoryKey("Exosomes"), normalizeCategoryKey("Exosome")],
  [normalizeCategoryKey("Injectables")]: [normalizeCategoryKey("Injectables"), normalizeCategoryKey("Injectable")],
  [normalizeCategoryKey("Chemical Peels")]: [normalizeCategoryKey("Chemical Peels"), normalizeCategoryKey("Chemical Peel"), normalizeCategoryKey("Peels")],
  [normalizeCategoryKey("Fillers")]: [normalizeCategoryKey("Fillers"), normalizeCategoryKey("Filler")],
  [normalizeCategoryKey("Permanent Makeup")]: [normalizeCategoryKey("Permanent Makeup"), normalizeCategoryKey("PMU")],
  [normalizeCategoryKey("BB Glow Treatment")]: [normalizeCategoryKey("BB Glow Treatment"), normalizeCategoryKey("BB Glow"), normalizeCategoryKey("Glow Treatment")],
};

const matchesCategory = (product, categoryName) => {
  const productCategory = normalizeCategoryKey(getCategoryLabel(product));
  const target = normalizeCategoryKey(categoryName);
  if (!target) return false;
  const aliases = CATEGORY_ALIASES[target] || [target];
  return aliases.includes(productCategory);
};

const pickRailProducts = (products, categoryName) => {
  const matches = products.filter((product) => matchesCategory(product, categoryName));

  const fallback = matches.length >= 4 ? matches : [...matches, ...products];
  const unique = new Map();
  fallback.forEach((product) => {
    if (!matchesCategory(product, categoryName)) return;
    if (product?._id && !unique.has(product._id)) {
      unique.set(product._id, product);
    }
  });

  return Array.from(unique.values()).slice(0, 5);
};

const ProductCard = ({ product, cartProducts, wishlist, onAddToCart, onWishlist }) => {
  const productInCart = cartProducts.some((item) => item?._id === product?._id);
  const productInWishlist = wishlist.some((item) => item?._id === product?._id);
  const discount = Math.round(Number(product?.discount || 0));
  const hasDiscount = discount > 0 && Number(product?.price || 0) > 0;
  const discounted = getSalePrice(product);

  return (
    <article className={styles.card}>
      <Link href={buildProductPath(product)} className={styles.imageWrap}>
        <img src={getImage(product)} alt={product?.title || "Product"} />
        {hasDiscount && <span className={styles.saleTag}>Save {discount}%</span>}
      </Link>
      <div className={styles.cardBody}>
        <p className={styles.brandName}>{product?.brand?.name || "HASNAT Edit"}</p>
        <Link href={buildProductPath(product)} className={styles.productTitle}>
          {product?.title}
        </Link>
        <p className={styles.categoryName}>{getCategoryLabel(product)}</p>
        <div className={styles.priceRow}>
          <strong>{formatPKR(discounted)}</strong>
          {hasDiscount && <span>{formatPKR(product?.price)}</span>}
        </div>
        <div className={styles.cardActions}>
          <button type="button" onClick={() => onAddToCart(product)} className={styles.addBtn}>
            {productInCart ? "Add More" : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={() => onWishlist(product)}
            className={`${styles.wishBtn} ${productInWishlist ? styles.wishBtnActive : ""}`}
            aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {productInWishlist ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
};

const SkinaeInspiredStorefront = ({ mode = "home", initialProducts = [] }) => {
  const isHome = mode === "home";
  const dispatch = useDispatch();
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { data, isLoading, isError } = useGetAllProductsQuery();

  const allProducts = Array.isArray(data?.data) ? data.data : [];
  const productPool = allProducts.length > 0 ? allProducts : initialProducts;
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const categories = useMemo(() => {
    const unique = new Set(productPool.map(getCategoryLabel).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [productPool]);

  const railGroups = useMemo(
    () =>
      PRODUCT_RAILS.map((rail) => ({
        ...rail,
        products: pickRailProducts(productPool, rail.category),
      })).filter((rail) => rail.products.length > 0),
    [productPool]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = String(searchTerm || "").trim().toLowerCase();
    let items = productPool.filter((product) => {
      if (activeCategory !== "All" && !matchesCategory(product, activeCategory)) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }

      return getSearchText(product).includes(normalizedSearch);
    });

    if (sortBy === "newest") {
      items = items.slice().sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    } else if (sortBy === "price-low") {
      items = items.slice().sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    } else if (sortBy === "price-high") {
      items = items.slice().sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    } else if (sortBy === "name") {
      items = items.slice().sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
    } else {
      items = items
        .slice()
        .sort((a, b) => Number(Boolean(b?.feature || b?.featured)) - Number(Boolean(a?.feature || a?.featured)));
    }

    return items;
  }, [productPool, activeCategory, searchTerm, sortBy]);

  const handleAddToCart = (product) => {
    dispatch(add_cart_product(product));
  };

  const handleWishlist = (product) => {
    dispatch(add_to_wishlist(product));
  };

  const handleNavSearch = (category) => {
    setActiveCategory(category);
    setSearchTerm("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <span>NOTE: Professional skin aesthetics and beauty products</span>
        <span>Same day support available for Lahore selected orders</span>
        <span>Call now for product guidance</span>
      </div>

      <header className={styles.header}>
        <div className={styles.headerBrandWrap}>
          <Link href="/" className={styles.brand}>
            HASNAT
          </Link>
          <p className={styles.brandTagline}>Skin Aesthetics Store</p>
        </div>
        <div className={styles.headerRight}>
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/shop">All Products</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className={styles.quickActions}>
            <Link href="/wishlist">Wishlist ({wishlist?.length || 0})</Link>
            <Link href="/cart">Cart ({cart_products?.length || 0})</Link>
          </div>
        </div>
      </header>

      <nav className={styles.categoryNav} aria-label="Popular categories">
        {NAV_CATEGORIES.map((category) => (
          <button key={category} type="button" onClick={() => handleNavSearch(category)}>
            {category}
          </button>
        ))}
      </nav>

      {isHome && (
        <>
          <section
            className={styles.hero}
            style={{ "--hero-image": `url(${HERO_VIDEO.fallback})` }}
          >
            <video
              className={styles.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={HERO_VIDEO.fallback}
            >
              <source src={HERO_VIDEO.src} type="video/mp4" />
            </video>
            <div className={styles.heroShade} aria-hidden="true" />
            <motion.div
              className={styles.heroCopy}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            >
              <motion.p
                className={styles.heroEyebrow}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
              >
                HASNAT Aesthetics
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                Premium Skin Care Store
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                Exosomes, fillers, peels and advanced skincare essentials.
              </motion.p>
              <motion.div
                className={styles.heroActions}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.55 }}
              >
                <Link href="/shop" className={styles.primaryBtn}>
                  Shop Now
                </Link>
                <Link href="/contact" className={styles.secondaryBtn}>
                  Call for Guidance
                </Link>
              </motion.div>
            </motion.div>
          </section>

          <section className={styles.marqueeBar} aria-label="Store promise">
            <div className={styles.marqueeTrack}>
              {["LOVE YOUR SKIN AGAIN", "AUTHENTIC PRODUCTS", "EXOSOMES", "FILLERS", "MESO SERUMS", "SKIN BOOSTERS"]
                .concat([
                  "LOVE YOUR SKIN AGAIN",
                  "AUTHENTIC PRODUCTS",
                  "EXOSOMES",
                  "FILLERS",
                  "MESO SERUMS",
                  "SKIN BOOSTERS",
                ])
                .map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
            </div>
          </section>

          <section className={styles.promoSection}>
            <article className={styles.promoHeroCard}>
              <img src={PROMO_BANNERS[0].image} alt={PROMO_BANNERS[0].title} />
              <div className={styles.promoOverlay}>
                <p>{PROMO_BANNERS[0].subtitle}</p>
                <h3>{PROMO_BANNERS[0].title}</h3>
                <Link href={PROMO_BANNERS[0].href}>{PROMO_BANNERS[0].cta}</Link>
              </div>
            </article>

            <div className={styles.promoStack}>
              {PROMO_BANNERS.slice(1).map((item) => (
                <article key={item.id} className={styles.promoCard}>
                  <img src={item.image} alt={item.title} />
                  <div className={styles.promoCardBody}>
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                    <Link href={item.href}>{item.cta}</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.treatmentSection}>
            <div className={styles.sectionHead}>
              <div>
                <p>Shop by concern</p>
                <h2>Professional Treatments</h2>
              </div>
              <Link href="/shop">View all</Link>
            </div>
            <div className={styles.treatmentGrid}>
              {TREATMENT_TILES.map((tile) => (
                <button
                  key={tile.title}
                  type="button"
                  onClick={() => handleNavSearch(tile.title)}
                  className={styles.treatmentTile}
                >
                  <img src={tile.image} alt="" />
                  <span>
                    <strong>{tile.title}</strong>
                    <small>{tile.caption}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {railGroups.map((rail) => (
            <section key={rail.title} className={styles.productRail}>
              <div className={styles.sectionHead}>
                <div>
                  <p>{rail.subtitle}</p>
                  <h2>{rail.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(rail.category);
                    setSearchTerm("");
                  }}
                >
                  View all
                </button>
              </div>
              <div className={styles.railGrid}>
                {rail.products.map((product) => (
                  <ProductCard
                    key={product?._id}
                    product={product}
                    cartProducts={cart_products}
                    wishlist={wishlist}
                    onAddToCart={handleAddToCart}
                    onWishlist={handleWishlist}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <section className={styles.catalog}>
        <div className={styles.catalogHead}>
          <div>
            <p className={styles.catalogKicker}>{isHome ? "Complete store" : "Shop"}</p>
            <h2>{isHome ? "All Products" : "Product Listing"}</h2>
            <p>{filteredProducts.length} items available</p>
          </div>
          <div className={styles.controls}>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products"
              className={styles.searchInput}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className={styles.categoryRow}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`${styles.categoryPill} ${activeCategory === category ? styles.categoryPillActive : ""}`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading && productPool.length === 0 && <p className={styles.stateText}>Loading products...</p>}
        {isError && <p className={styles.stateText}>Unable to load products right now.</p>}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <p className={styles.stateText}>No matching products found.</p>
        )}

        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product?._id}
              product={product}
              cartProducts={cart_products}
              wishlist={wishlist}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
            />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <h4>HASNAT</h4>
            <p>Professional Skin Aesthetics and Beauty Products for skincare, exosomes, fillers and treatment care.</p>
          </div>
          <div>
            <h5>Main menu</h5>
            <ul>
              <li><Link href="/shop">Microneedling</Link></li>
              <li><Link href="/shop">Meso Serums</Link></li>
              <li><Link href="/shop">Exosomes</Link></li>
              <li><Link href="/shop">Fillers</Link></li>
            </ul>
          </div>
          <div>
            <h5>Information</h5>
            <ul>
              <li><Link href="/contact">Contact Information</Link></li>
              <li><Link href="/checkout">Checkout</Link></li>
              <li><Link href="/cart">Cart</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h5>Get in touch</h5>
            <ul>
              <li>Lahore</li>
              <li>
                <a href="mailto:neesmedicalsale@gmail.com">neesmedicalsale@gmail.com</a>
              </li>
              <li>
                <a href="tel:+923700030710">+92 3700030710</a>
              </li>
            </ul>
          </div>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} HASNAT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SkinaeInspiredStorefront;
