import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { CartTwo, CategoryMenu, Compare, Search, User, Wishlist } from "@/svg";
import {
  add_cart_product,
  configureOrderQuantity,
  increment,
  initialOrderQuantity,
} from "@/redux/features/cartSlice";
import { add_to_compare } from "@/redux/features/compareSlice";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { useGetShopProductsQuery } from "@/redux/features/productApi";
import styles from "@/styles/meamo-skin-boosters.module.css";

const topCategories = [
  ["Botulinum Toxins", "22 products"],
  ["Dermal Fillers", "82 products"],
  ["Korean Skin Boosters", "67 products"],
  ["Body Fillers", "9 products"],
  ["Numbing Cream", "7 products"],
  ["Devices & Disposables", "36 products"],
  ["Sets", "24 products"],
  ["Health Boosters", "11 products"],
  ["Korean Skincare", "67 products"],
  ["Lifting Thread", "14 products"],
  ["Clearance", "1 product"],
  ["Contouring Serums", "18 products"],
  ["Newly Curated", "39 products"],
  ["Meamo Labs", "16 products"],
  ["Collagen Stimulators", "10 products"],
  ["CE Certified", "21 products"],
  ["Microneedling", "67 products"],
  ["Hair Treatment", "6 products"],
];

const sidebarCategories = [
  "Korean Skin Boosters",
  "Body Fillers",
  "Botulinum Toxins",
  "CE Certified",
  "Clearance",
  "Collagen Stimulators",
  "Contouring Serums",
  "Dermal Fillers",
  "Devices & Disposables",
  "Hair Treatment",
  "Injections",
  "Korean Skin Boosters",
  "Korean Skincare",
  "Lifting Thread",
  "Meamo Labs",
  "Microneedling",
  "Newly Curated",
  "Numbing Cream",
  "Sets",
  "Uncategorized",
];

const concerns = [
  "Acne",
  "Anti-aging therapy",
  "Antioxidant Protection",
  "Cellulite",
  "Concerns around the eyes",
  "Dark circles",
  "Deep wrinkles",
  "Drooping skin (gravity ptosis)",
  "Dry and dehydrated lips",
  "Dry and dehydrated skin",
  "Dull or tired-looking skin",
  "Early signs of aging",
  "Enlarged pores",
  "Facial peeling",
  "Forehead, eye, and mouth wrinkles",
  "General skin rejuvenation",
  "Hair thinning or loss",
  "Lip dryness and flaking",
  "Loss of facial volume",
  "Photo-aging",
  "Pigmentation",
  "Scars, acne marks, and stretch marks",
  "Skin Metabolism",
  "Skin Whitening",
];

const ingredients = [
  "Acetyl Hexapeptide-8",
  "Arbutin",
  "ASC Exosomes",
  "Atelocollagen",
  "Biotin",
  "Calcium hydroxyapatite",
  "Cellular Growth Factors",
  "Collagen",
  "EGF",
  "Exosome",
  "FGF",
  "Glutathione",
  "Growth Factor",
  "HA (Hyaluronic Acid)",
  "Lidocaine",
  "Nicotinamide Adenine Dinucleotide (NAD+)",
  "Nicotinamide mononucleotide (NMN)",
  "PDRN (Polydeoxyribonucleotide)",
  "Peptides",
  "PN (Polynucleotide)",
  "Sodium Hyaluronate",
  "Vitamin C",
  "Vitamin E",
  "Vitamins",
];

const products = [
  {
    name: "Jeunetique NAD+",
    rating: "4.50",
    reviews: 4,
    price: "$46.40 - $185.60",
    points: "Earn up to 9 Points",
    badge: "-20%",
    flags: ["Hot", "New"],
    action: "Select options",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771617423/zadz9gnf27n3h63sw61v.png",
  },
  {
    name: "Laetigen",
    rating: "4.90",
    reviews: 136,
    price: "$38.40 - $151.20",
    points: "Earn up to 7 Points",
    flags: ["New"],
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043062/nyyca2lwc2xswn0kukfb.png",
  },
  {
    name: "Soonsu Ultra Reju",
    rating: "4.92",
    reviews: 66,
    price: "$99.50",
    oldPrice: "$124.50",
    points: "Earn 4 Points",
    flags: ["New"],
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771067912/sevbznmdjdwxvkw5w3ov.png",
  },
  {
    name: "Ultrahilo",
    rating: "4.91",
    reviews: 43,
    price: "$44.50",
    oldPrice: "$55.50",
    points: "Earn 2 Points",
    flags: ["New"],
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043049/bsv2pup3qxr9ikopwwja.png",
  },
  {
    name: "Hanheal Exosome Hair Filler",
    rating: "5.00",
    reviews: 3,
    price: "$149.00",
    points: "Earn 7 Points",
    flags: ["New"],
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684890/ptt8lk2ofzmc4vbzpc3l.jpg",
  },
  {
    name: "Curenex",
    rating: "4.83",
    reviews: 53,
    price: "$95.50",
    points: "Earn 4 Points",
    flags: ["Hot"],
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771617423/zadz9gnf27n3h63sw61v.png",
  },
  {
    name: "Hyaron",
    rating: "4.92",
    reviews: 97,
    price: "$9.99",
    points: "Earn 1 Point",
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043062/nyyca2lwc2xswn0kukfb.png",
  },
  {
    name: "Rejuran Healer True Skin",
    rating: "4.95",
    reviews: 38,
    price: "$258.30",
    points: "Earn 12 Points",
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771067912/sevbznmdjdwxvkw5w3ov.png",
  },
  {
    name: "Etrebelle PN",
    rating: "5.00",
    reviews: 6,
    price: "$119.50",
    points: "Earn 5 Points",
    flags: ["New"],
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043049/bsv2pup3qxr9ikopwwja.png",
  },
  {
    name: "PURIHILO PN",
    rating: "4.88",
    reviews: 8,
    price: "$99.00",
    points: "Earn 4 Points",
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1773684890/ptt8lk2ofzmc4vbzpc3l.jpg",
  },
  {
    name: "Puri COLL Rh",
    rating: "4.86",
    reviews: 7,
    price: "$65.00",
    points: "Earn 3 Points",
    action: "Add to cart",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1771617423/zadz9gnf27n3h63sw61v.png",
  },
  {
    name: "AMI NAD+ Skin Booster",
    rating: "4.90",
    reviews: 12,
    price: "$95.50 - $349.50",
    points: "Earn up to 17 Points",
    flags: ["Hot"],
    action: "Select options",
    image: "https://res.cloudinary.com/dvfjsntz8/image/upload/v1777043062/nyyca2lwc2xswn0kukfb.png",
  },
];

const toNumberPrice = (value) => {
  const match = String(value).match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : 0;
};

const formatCurrency = (value) => {
  const safeValue = Number(value || 0);
  return `PKR ${safeValue.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const normalizeTagList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const mapBackendProductToCard = (product, index) => {
  const price = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const oldPriceValue = discount > 0 ? (price * 100) / (100 - discount) : 0;
  const tags = normalizeTagList(product?.tags);
  const imageFromGallery = Array.isArray(product?.imageURLs)
    ? product.imageURLs.find((item) => item?.img)?.img
    : "";
  const image = String(product?.img || imageFromGallery || "").trim();
  const reviewCount = Array.isArray(product?.reviews) ? product.reviews.length : 0;
  const createdTime = new Date(product?.createdAt || Date.now()).getTime();
  const isNew = Date.now() - createdTime <= 1000 * 60 * 60 * 24 * 30;
  const isHot = discount >= 10;
  const points = Math.max(1, Math.round(price / 1000));
  const categoryName =
    String(product?.children || product?.category?.name || product?.parent || "Clinical").trim();

  return {
    ...product,
    _id: String(product?._id || `clinical-${index + 1}`),
    name: String(product?.title || "Clinical Product"),
    title: String(product?.title || "Clinical Product"),
    image,
    img: image,
    displayPrice: formatCurrency(price),
    displayOldPrice: oldPriceValue > price ? formatCurrency(oldPriceValue) : "",
    price,
    oldPrice: oldPriceValue > price ? oldPriceValue : undefined,
    discount: discount > 0 ? discount : 0,
    ratingValue: reviewCount > 0 ? 4.8 : 4.9,
    rating: reviewCount > 0 ? "4.80" : "4.90",
    reviews: reviewCount,
    reviewCount,
    points: `Earn ${points} Points`,
    badge: discount > 0 ? `-${Math.round(discount)}%` : "",
    flags: [isNew ? "New" : "", isHot ? "Hot" : ""].filter(Boolean),
    action: "Add to cart",
    quantity: Number(product?.quantity || 0) > 0 ? Number(product.quantity) : 50,
    status: product?.status || "in-stock",
    sku: product?.sku || `CLN-${String(index + 1).padStart(3, "0")}`,
    category: product?.category || { name: categoryName },
    children: categoryName,
    concerns: tags,
    ingredients: tags,
    tags,
    description:
      String(product?.description || "").trim() ||
      "Clinical skincare and treatment product.",
    imageURLs:
      Array.isArray(product?.imageURLs) && product.imageURLs.length > 0
        ? product.imageURLs
        : [{ img: image }],
  };
};

const catalogProducts = products.map((product, index) => {
  const priceValue = toNumberPrice(product.price);
  const oldPriceValue = toNumberPrice(product.oldPrice);

  return {
    ...product,
    _id: `hasnat-skin-booster-${index + 1}`,
    title: product.name,
    img: product.image,
    displayPrice: product.price,
    displayOldPrice: product.oldPrice,
    price: priceValue,
    oldPrice: oldPriceValue || undefined,
    discount: oldPriceValue ? Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100) : 0,
    ratingValue: Number(product.rating),
    reviewCount: Number(product.reviews),
    quantity: 500,
    status: "in-stock",
    sku: `HS-SB-${String(index + 1).padStart(3, "0")}`,
    category: { name: "Korean Skin Boosters" },
    brand: { name: "HASNAT" },
    tags: ["Korean Skin Booster", "Aesthetic Care", "Professional Supply"],
    concerns: ["General skin rejuvenation", concerns[index % concerns.length]],
    ingredients: [ingredients[index % ingredients.length], "PDRN (Polydeoxyribonucleotide)"],
    description:
      "Professional Korean skin booster product prepared for hydration support, visible radiance, and aesthetic clinic routines.",
    imageURLs: [{ img: product.image }],
  };
});

const ActionRoundButton = ({ children, label, onClick }) => (
  <button type="button" className={styles.iconButton} aria-label={label} onClick={onClick}>
    {children}
  </button>
);

const ProductCard = ({
  product,
  quantity,
  isWishlisted,
  onQuantityChange,
  onAddToCart,
  onCompare,
  onQuickView,
  onWishlist,
}) => (
  <article className={styles.productCard}>
    <div className={styles.badgeStack}>
      {product.badge && <span className={styles.discountBadge}>{product.badge}</span>}
      {product.flags?.map((flag) => (
        <span key={flag} className={flag === "New" ? styles.newBadge : styles.hotBadge}>
          {flag}
        </span>
      ))}
    </div>

    <Link href="/product-details" className={styles.imageBox}>
      <img src={product.image} alt={product.name} />
    </Link>

    <div className={styles.actionColumn}>
      <button type="button" onClick={() => onCompare(product)}>
        Add to compare
      </button>
      <button type="button" onClick={() => onQuickView(product)}>
        Quick view
      </button>
      <button type="button" onClick={() => onWishlist(product)}>
        {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      </button>
    </div>

    <div className={styles.mobileActions} aria-label="Product actions">
      <ActionRoundButton label={`Compare ${product.name}`} onClick={() => onCompare(product)}>
        +
      </ActionRoundButton>
      <ActionRoundButton label={`Quick view ${product.name}`} onClick={() => onQuickView(product)}>
        o
      </ActionRoundButton>
      <ActionRoundButton label={`${isWishlisted ? "Remove from" : "Add to"} wishlist ${product.name}`} onClick={() => onWishlist(product)}>
        ♡
      </ActionRoundButton>
    </div>

    <h3>
      <Link href="/product-details">{product.name}</Link>
    </h3>

    <div className={styles.ratingRow}>
      <span className={styles.stars}>★★★★★</span>
      <span>Rated {product.rating} out of 5</span>
      <Link href="/product-details">({product.reviews})</Link>
    </div>

    <div className={styles.priceLine}>
      {product.displayOldPrice && <del>{product.displayOldPrice}</del>}
      <span>{product.displayPrice}</span>
    </div>

    <p className={styles.points}>{product.points}</p>

    <div className={styles.quantityRow}>
      <button
        type="button"
        aria-label={`Decrease ${product.name} quantity`}
        disabled={quantity <= 1}
        onClick={() => onQuantityChange(product._id, quantity - 1)}
      >
        -
      </button>
      <input aria-label={`${product.name} quantity`} readOnly value={quantity} />
      <button
        type="button"
        aria-label={`Increase ${product.name} quantity`}
        onClick={() => onQuantityChange(product._id, quantity + 1)}
      >
        +
      </button>
    </div>

    <button type="button" className={styles.cartButton} onClick={() => onAddToCart(product)}>
      {product.action}
    </button>
  </article>
);

const FilterRow = ({ label, value, expanded, onToggle, children }) => (
  <section className={styles.filterGroup}>
    <button
      type="button"
      className={`${styles.filterRow} ${expanded ? styles.filterRowActive : ""}`}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      <span>{label}</span>
      {value && <strong>{value}</strong>}
      <i aria-hidden="true" />
    </button>
    {expanded && <div className={styles.filterPanel}>{children}</div>}
  </section>
);

const MeamoHeader = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount,
  onStatus,
}) => (
  <header className={styles.header}>
    <section className={styles.promoStrip} aria-label="Promotion">
      <button type="button" aria-label="Previous promotion" onClick={() => onStatus("Previous promotion selected.")}>‹</button>
      <div className={styles.promoInner}>
        <span className={styles.promoDot} />
        <strong>TR DOCTORS PLATFORM</strong>
        <span className={styles.trLogo}>TR</span>
        <span className={styles.promoAmp}>&amp;</span>
        <span className={styles.meamoText}>me<br />amo</span>
        <span className={styles.promoPill}>FOR ONLY €99/MONTH</span>
      </div>
      <button type="button" aria-label="Next promotion" onClick={() => onStatus("Next promotion selected.")}>›</button>
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

        <form className={styles.searchForm} onSubmit={onSearchSubmit}>
          <span aria-hidden="true" className={styles.searchIcon}><Search /></span>
          <input
            type="search"
            placeholder="Search for products"
            aria-label="Search for products"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button type="button" onClick={() => onStatus("Category selector opened.")}>
            Select category
            <i aria-hidden="true" />
          </button>
        </form>

        <div className={styles.headerActions}>
          <Link href="/compare" className={styles.iconAction} aria-label={`Compare (${compareCount})`}>
            <Compare />
            {compareCount > 0 && <sup>{compareCount}</sup>}
          </Link>
          <Link href="/wishlist" className={styles.iconAction} aria-label={`Wishlist (${wishlistCount})`}>
            <Wishlist />
            {wishlistCount > 0 && <sup>{wishlistCount}</sup>}
          </Link>
          <Link href="/login" className={styles.loginLink}>
            <span aria-hidden="true"><User /></span>
            Login / Register
          </Link>
          <Link href="/cart" className={styles.cartButtonHeader}>
            <CartTwo /> ${cartTotal.toFixed(2)}
            <sup>{cartCount}</sup>
          </Link>
        </div>
      </div>
    </section>

    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.headerContainer}>
        <button type="button" className={styles.categoryButton} onClick={() => onStatus("Browse categories menu selected.")}>
          <span aria-hidden="true"><CategoryMenu /></span>
          Browse Categories
          <i aria-hidden="true" />
        </button>
        <Link href="/professional">▦ Wholesale</Link>
        <Link href="/coupon">★ Affiliates</Link>
        <Link href="/coupon">▰ Loyalty Program</Link>
        <Link href="/blog">▣ Blog</Link>
        <Link href="/contact">Support</Link>
        <Link href="/professional">Go PRO</Link>
        <Link href="/contact-sales">Distribution</Link>
      </div>
    </nav>
  </header>
);

const MeamoSkinBoostersArchive = () => {
  const dispatch = useDispatch();
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const { data: shopProductsRes } = useGetShopProductsQuery();
  const shopProductsRaw = Array.isArray(shopProductsRes)
    ? shopProductsRes
    : Array.isArray(shopProductsRes?.data)
      ? shopProductsRes.data
      : Array.isArray(shopProductsRes?.products)
        ? shopProductsRes.products
        : [];
  const mappedLiveProducts = useMemo(
    () =>
      shopProductsRaw
        .filter((item) => {
          const type = String(item?.productType || "").toLowerCase();
          const parent = String(item?.parent || "").toLowerCase();
          return type === "clinical" || parent === "clinical";
        })
        .map((item, index) => mapBackendProductToCard(item, index))
        .filter((item) => Boolean(item.img && item.title)),
    [shopProductsRaw]
  );
  const catalogSourceProducts =
    mappedLiveProducts.length > 0
      ? mappedLiveProducts
      : catalogProducts;
  const categoryCounts = useMemo(() => {
    const countMap = new Map();
    for (const item of catalogSourceProducts) {
      const categoryName = String(
        item?.children || item?.category?.name || "Clinical"
      ).trim();
      if (!categoryName) continue;
      countMap.set(categoryName, (countMap.get(categoryName) || 0) + 1);
    }
    return Array.from(countMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        label: `${count} ${count === 1 ? "product" : "products"}`,
      }))
      .sort((a, b) => b.count - a.count);
  }, [catalogSourceProducts]);
  const topCategoryEntries =
    categoryCounts.length > 0
      ? categoryCounts
      : topCategories.map(([name, label]) => ({ name, count: 0, label }));
  const sidebarCategoryEntries =
    topCategoryEntries.length > 0
      ? topCategoryEntries.map((item) => item.name)
      : sidebarCategories;
  const fallbackCategory = topCategoryEntries[0]?.name || "Clinical";
  const [activeCategory, setActiveCategory] = useState(fallbackCategory);
  const [expandedFilter, setExpandedFilter] = useState("Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showCount, setShowCount] = useState(12);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeConcern, setActiveConcern] = useState("");
  const [activeIngredient, setActiveIngredient] = useState("");
  const [quantities, setQuantities] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!topCategoryEntries.find((item) => item.name === activeCategory)) {
      setActiveCategory(fallbackCategory);
    }
  }, [activeCategory, fallbackCategory, topCategoryEntries]);

  const dynamicKeywordOptions = useMemo(() => {
    const unique = new Set();
    for (const item of catalogSourceProducts) {
      const tags = Array.isArray(item?.tags) ? item.tags : [];
      for (const tag of tags) {
        const safeTag = String(tag || "").trim();
        if (!safeTag) continue;
        unique.add(safeTag);
      }
    }
    return Array.from(unique);
  }, [catalogSourceProducts]);
  const concernOptions = dynamicKeywordOptions.length > 0 ? dynamicKeywordOptions : concerns;
  const ingredientOptions =
    dynamicKeywordOptions.length > 8 ? dynamicKeywordOptions.slice(8) : ingredients;

  const cartCount = cart_products.reduce((total, item) => total + Number(item.orderQuantity || 1), 0);
  const cartTotal = cart_products.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.orderQuantity || 1),
    0
  );

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const nextProducts = catalogSourceProducts.filter((product) => {
      const productCategory = String(
        product?.children || product?.category?.name || ""
      ).trim();
      const matchesSearch =
        !term ||
        product.title.toLowerCase().includes(term) ||
        (Array.isArray(product.ingredients) &&
          product.ingredients.some((item) =>
            String(item).toLowerCase().includes(term)
          )) ||
        (Array.isArray(product.concerns) &&
          product.concerns.some((item) => String(item).toLowerCase().includes(term)));
      const matchesCategory = !activeCategory || productCategory === activeCategory;
      const matchesMin = min === null || product.price >= min;
      const matchesMax = max === null || product.price <= max;
      const matchesConcern =
        !activeConcern ||
        (Array.isArray(product.concerns) && product.concerns.includes(activeConcern));
      const matchesIngredient =
        !activeIngredient ||
        (Array.isArray(product.ingredients) &&
          product.ingredients.includes(activeIngredient));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMin &&
        matchesMax &&
        matchesConcern &&
        matchesIngredient
      );
    });

    return [...nextProducts].sort((a, b) => {
      if (sortBy === "popularity") return b.reviewCount - a.reviewCount;
      if (sortBy === "rating") return b.ratingValue - a.ratingValue;
      if (sortBy === "latest") return Number(b._id.split("-").pop()) - Number(a._id.split("-").pop());
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });
  }, [
    activeCategory,
    activeConcern,
    activeIngredient,
    catalogSourceProducts,
    maxPrice,
    minPrice,
    searchTerm,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, showCount);

  const updateQuantity = (productId, nextQuantity) => {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.min(24, Math.max(1, nextQuantity)),
    }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setStatusMessage(searchTerm ? `Search applied for "${searchTerm}".` : "Search cleared.");
  };

  const handleAddToCart = (product) => {
    const selectedQuantity = quantities[product._id] || 1;
    dispatch(configureOrderQuantity(product));
    for (let count = 1; count < selectedQuantity; count += 1) {
      dispatch(increment());
    }
    dispatch(add_cart_product(product));
    dispatch(initialOrderQuantity());
    setStatusMessage(`${selectedQuantity} ${product.title} added to cart.`);
  };

  const handleWishlist = (product) => {
    const alreadySaved = wishlist.some((item) => item._id === product._id);
    dispatch(add_to_wishlist(product));
    setStatusMessage(`${product.title} ${alreadySaved ? "removed from" : "added to"} wishlist.`);
  };

  const handleCompare = (product) => {
    const alreadyCompared = compareItems.some((item) => item._id === product._id);
    dispatch(add_to_compare(product));
    setStatusMessage(`${product.title} ${alreadyCompared ? "removed from" : "added to"} compare.`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setActiveConcern("");
    setActiveIngredient("");
    setActiveCategory(fallbackCategory);
    setSortBy("default");
    setShowCount(12);
    setStatusMessage("Filters cleared.");
  };

  return (
    <div className={styles.page}>
      <MeamoHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        compareCount={compareItems.length}
        onStatus={setStatusMessage}
      />
      <main>
        <section className={styles.archiveHero}>
          <div className={styles.container}>
            <h1 className={styles.archiveTitle}>{activeCategory}</h1>
            <div className={styles.topCategoryGrid}>
              <h2>Categories</h2>
              <ul>
                {topCategoryEntries.map(({ name, label }) => (
                  <li key={name}>
                    <Link
                      href="/"
                      className={activeCategory === name ? styles.activeCategory : ""}
                      onClick={(event) => {
                        event.preventDefault();
                        setActiveCategory(name);
                        setStatusMessage(`${name} category selected.`);
                      }}
                    >
                      <span>{name}</span>
                      <small>{label}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.shopShell}>
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <h2><span aria-hidden="true">≡</span> Filters</h2>
              <FilterRow
                label="Categories"
                value={activeCategory}
                expanded={expandedFilter === "Categories"}
                onToggle={() => setExpandedFilter(expandedFilter === "Categories" ? "" : "Categories")}
              >
                <ul className={styles.filterList}>
                  {sidebarCategoryEntries.slice(0, 14).map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <button
                        type="button"
                        className={activeCategory === item ? styles.filterOptionActive : ""}
                        onClick={() => {
                          setActiveCategory(item);
                          setStatusMessage(`${item} category selected.`);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </FilterRow>
              <FilterRow
                label="Filter by price"
                expanded={expandedFilter === "Price"}
                onToggle={() => setExpandedFilter(expandedFilter === "Price" ? "" : "Price")}
              >
                <div className={styles.priceInputs}>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  />
                  <button type="button" onClick={() => setStatusMessage("Price filter applied.")}>Apply</button>
                </div>
              </FilterRow>
              <FilterRow
                label="Concern"
                value={activeConcern}
                expanded={expandedFilter === "Concern"}
                onToggle={() => setExpandedFilter(expandedFilter === "Concern" ? "" : "Concern")}
              >
                <ul className={styles.compactList}>
                  {concernOptions.slice(0, 10).map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={activeConcern === item ? styles.filterOptionActive : ""}
                        onClick={() => setActiveConcern(activeConcern === item ? "" : item)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </FilterRow>
              <FilterRow
                label="Ingredients"
                value={activeIngredient}
                expanded={expandedFilter === "Ingredients"}
                onToggle={() => setExpandedFilter(expandedFilter === "Ingredients" ? "" : "Ingredients")}
              >
                <ul className={styles.compactList}>
                  {ingredientOptions.slice(0, 10).map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={activeIngredient === item ? styles.filterOptionActive : ""}
                        onClick={() => setActiveIngredient(activeIngredient === item ? "" : item)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </FilterRow>
            </div>
            <button type="button" className={styles.sidebarFilterButton} onClick={clearFilters}>
              Clear filter
            </button>
          </aside>

          <div className={styles.catalogArea}>
            <div className={styles.toolbar}>
              <p>
                Showing {visibleProducts.length ? `1-${visibleProducts.length}` : "0"} of {filteredProducts.length} results
              </p>
              <div className={styles.toolbarControls}>
                <span>Show :</span>
                <div className={styles.showButtons}>
                  {[9, 12, 18, 24].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={showCount === item ? styles.showButtonActive : ""}
                      onClick={() => setShowCount(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className={styles.viewButtons} aria-label="View mode">
                  <button type="button" aria-label="List view" onClick={() => setStatusMessage("List view selected.")}><span /></button>
                  <button type="button" aria-label="Compact grid" onClick={() => setStatusMessage("Compact grid selected.")}><span /></button>
                  <button type="button" aria-label="Grid view" onClick={() => setStatusMessage("Grid view selected.")}><span /></button>
                </div>
                <select aria-label="Default sorting" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="default">Default sorting</option>
                  <option value="popularity">Sort by popularity</option>
                  <option value="rating">Sort by average rating</option>
                  <option value="latest">Sort by latest</option>
                  <option value="price-low">Sort by price: low to high</option>
                  <option value="price-high">Sort by price: high to low</option>
                </select>
              </div>
            </div>

            <div className={styles.mobileFilterGrid}>
              <section>
                <h3>Sort by</h3>
                <ul>
                  {[
                    ["popularity", "Popularity"],
                    ["rating", "Average rating"],
                    ["latest", "Newness"],
                    ["price-low", "Price: low to high"],
                    ["price-high", "Price: high to low"],
                  ].map(([value, label]) => (
                    <li key={value}>
                      <button type="button" onClick={() => setSortBy(value)}>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Price filter</h3>
                <ul>
                  {[
                    ["", "", "All"],
                    ["0", "100", "$ 0.00 - $ 100.00"],
                    ["100", "200", "$ 100.00 - $ 200.00"],
                    ["200", "300", "$ 200.00 - $ 300.00"],
                    ["300", "", "$ 300.00 +"],
                  ].map(([min, max, label]) => (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => {
                          setMinPrice(min);
                          setMaxPrice(max);
                        }}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Product categories</h3>
                <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
                  {sidebarCategoryEntries.slice(0, 16).map((item, index) => (
                    <option key={`${item}-${index}`}>{item}</option>
                  ))}
                </select>
              </section>
              <section>
                <h3>Search by Price</h3>
                <div className={styles.mobilePriceSearch}>
                  <input placeholder="Min price" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
                  <input placeholder="Max price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
                  <button type="button" onClick={() => setStatusMessage("Price filter applied.")}>Filter</button>
                </div>
                <p>Price: {minPrice || "0"} - {maxPrice || "+"}</p>
              </section>
            </div>

            {statusMessage && (
              <p className={styles.statusMessage} aria-live="polite">
                {statusMessage}
              </p>
            )}

            <div className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  quantity={quantities[product._id] || 1}
                  isWishlisted={wishlist.some((item) => item._id === product._id)}
                  onQuantityChange={updateQuantity}
                  onAddToCart={handleAddToCart}
                  onCompare={handleCompare}
                  onQuickView={(item) => dispatch(handleProductModal(item))}
                  onWishlist={handleWishlist}
                />
              ))}
            </div>

            {visibleProducts.length === 0 && (
              <div className={styles.emptyState}>
                <h2>No products found</h2>
                <button type="button" onClick={clearFilters}>Reset filters</button>
              </div>
            )}

            {visibleProducts.length < filteredProducts.length && (
              <div className={styles.loadMore}>
                <button type="button" onClick={() => setShowCount((count) => count + 4)}>Load more products</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MeamoSkinBoostersArchive;
