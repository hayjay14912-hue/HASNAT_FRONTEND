import Link from "next/link";
import Image from "next/image";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import Footer from "@/layout/footers/footer";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";
import {
  buildProductPath,
  buildProductStructuredData,
  getProductMetaDescription,
  getProductMetaTitle,
} from "@/utils/seo-utils";

const FALLBACK_PRODUCT = {
  _id: "visvisal-viviscal-priority-page",
  title: "Viviscal Hair Growth Product",
  short_description:
    "Looking for Visvisal? Shop authentic Viviscal hair care products with verified details and transparent pricing.",
  description:
    "Visvisal is a common search misspelling for Viviscal. Use this page to find the correct Viviscal products, compare details, and check current prices.",
  img: "/assets/img/product/product-14.jpg",
  status: "in-stock",
  category: { name: "Hair Care" },
  brand: { name: "Viviscal" },
};

const normalize = (value) => String(value || "").toLowerCase().trim();

const parseNumericPrice = (value) => {
  const parsed = Number.parseFloat(
    String(value || "")
      .replace(/[^0-9.,-]/g, "")
      .replace(/,/g, "")
  );
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const formatPrice = (value) => {
  const parsed = parseNumericPrice(value);
  if (!Number.isFinite(parsed)) {
    return "";
  }
  return `PKR ${parsed.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getAvailabilityLabel = (status) => {
  const normalizedStatus = normalize(status);
  if (normalizedStatus === "out-of-stock") {
    return "Out of Stock";
  }
  if (normalizedStatus === "discontinued") {
    return "Discontinued";
  }
  return "In Stock";
};

const PRODUCT_TERMS = [
  { term: "visvisal", weight: 5 },
  { term: "viviscal", weight: 5 },
  { term: "gorgeous growth", weight: 2 },
  { term: "densifying", weight: 2 },
  { term: "shampoo", weight: 1 },
  { term: "conditioner", weight: 1 },
  { term: "hair", weight: 1 },
];

const scoreProduct = (product) => {
  const text = [
    product?.title,
    product?.short_description,
    product?.shortDescription,
    product?.description,
    product?.brand?.name,
    product?.category?.name,
    ...(Array.isArray(product?.tags) ? product.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return PRODUCT_TERMS.reduce(
    (score, entry) => (text.includes(entry.term) ? score + entry.weight : score),
    0
  );
};

const pickPriorityProducts = (products = []) => {
  const scored = products
    .filter((item) => isActiveProduct(item) && isRetailProduct(item))
    .map((item) => ({ item, score: scoreProduct(item) }))
    .filter((entry) => entry.score >= 3)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((entry) => entry.item);
};

const getProductImage = (product) =>
  product?.img ||
  (Array.isArray(product?.imageURLs) ? product.imageURLs[0]?.img || "" : "") ||
  FALLBACK_PRODUCT.img;

const VisvisalPriorityPage = ({ primaryProduct, relatedProducts }) => {
  const activeProduct = primaryProduct || FALLBACK_PRODUCT;
  const canonical = "/visvisal";
  const pageTitle =
    primaryProduct
      ? `Visvisal (Viviscal) Price & Product Details | ${getProductMetaTitle(activeProduct)}`
      : "Visvisal (Viviscal) Product Price & Details in Pakistan | NEES Medical";
  const pageDescription = primaryProduct
    ? getProductMetaDescription(activeProduct)
    : "Looking for Visvisal? Find authentic Viviscal product details, current prices, and availability on NEES Medical.";
  const structuredData = [
    buildProductStructuredData({
      product: activeProduct,
      canonicalPath: canonical,
    }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Visvisal the same as Viviscal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Visvisal is a common spelling variation people use when searching for Viviscal hair products.",
          },
        },
        {
          "@type": "Question",
          name: "Can I check Viviscal price before ordering?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. This page links to live Viviscal product pages where current price, stock status, and details are shown.",
          },
        },
      ],
    },
  ];

  const displayPrice = formatPrice(activeProduct?.price);
  const productPath = primaryProduct ? buildProductPath(primaryProduct) : "/search?searchText=viviscal";
  const imageSrc = getProductImage(activeProduct);
  const brandName = activeProduct?.brand?.name || "Viviscal";
  const categoryName = activeProduct?.category?.name || "Hair Care";
  const availability = getAvailabilityLabel(activeProduct?.status);

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical={canonical}
        image={imageSrc}
        type="product"
        structuredData={structuredData}
      />
      <HeaderThree />

      <section className="pt-80 pb-90">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-5">
              <Image
                src={imageSrc}
                alt="Visvisal search result page showing Viviscal product details and price"
                width={560}
                height={560}
                priority={true}
                sizes="(max-width: 991px) 100vw, 50vw"
                style={{ width: "100%", height: "auto", borderRadius: "16px" }}
              />
            </div>
            <div className="col-lg-7">
              <span className="tp-section-title-pre-2">High-Priority SEO Product</span>
              <h1 className="mb-15">Visvisal (Viviscal) Product Price & Details</h1>
              <p className="mb-15">
                Searching for <strong>Visvisal</strong>? This usually refers to{" "}
                <strong>Viviscal</strong> hair care products.
              </p>
              <p className="mb-15">
                <strong>Matched Product:</strong> {activeProduct?.title || "Viviscal Product"}
              </p>
              {displayPrice ? (
                <p className="mb-20">
                  <strong>Current Price:</strong> {displayPrice}
                </p>
              ) : null}
              <p className="mb-25">
                Compare details, check stock, and open the live product page for latest buying
                information.
              </p>
              <ul className="mb-25">
                <li><strong>Brand:</strong> {brandName}</li>
                <li><strong>Category:</strong> {categoryName}</li>
                <li><strong>Availability:</strong> {availability}</li>
              </ul>
              <div className="d-flex flex-wrap gap-2">
                <Link href={productPath} className="tp-btn">
                  Open Viviscal Product
                </Link>
                <Link href="/search?searchText=viviscal" className="tp-btn tp-btn-border">
                  View All Viviscal Results
                </Link>
                <Link href="/shop" className="tp-btn tp-btn-border">
                  Browse Full Catalog
                </Link>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="row mt-50">
              <div className="col-lg-12">
                <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                  <h2 className="mb-20">Related Viviscal Products</h2>
                  <div className="d-flex flex-wrap gap-2">
                    {relatedProducts.map((item) => (
                      <Link key={item?._id || item?.title} href={buildProductPath(item)} className="tp-btn tp-btn-border">
                        {item?.title || "Product"}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer style_3={true} />
    </Wrapper>
  );
};

export const getServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return {
      props: {
        primaryProduct: null,
        relatedProducts: [],
      },
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/product/all`);
    if (!response.ok) {
      return {
        props: {
          primaryProduct: null,
          relatedProducts: [],
        },
      };
    }

    const payload = await response.json();
    const products = Array.isArray(payload?.data) ? payload.data : [];
    const prioritized = pickPriorityProducts(products);
    const [primaryProduct, ...relatedProducts] = prioritized;

    return {
      props: {
        primaryProduct: primaryProduct || null,
        relatedProducts: relatedProducts || [],
      },
    };
  } catch (error) {
    console.error("Failed to resolve Visvisal priority products:", error);
    return {
      props: {
        primaryProduct: null,
        relatedProducts: [],
      },
    };
  }
};

export default VisvisalPriorityPage;
