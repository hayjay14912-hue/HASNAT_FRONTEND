import Link from "next/link";
import Image from "next/image";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import Footer from "@/layout/footers/footer";
import {
  buildProductPath,
  buildProductStructuredData,
  getProductMetaDescription,
  getProductMetaTitle,
} from "@/utils/seo-utils";

const FALLBACK_PRODUCT = {
  _id: "glutanex-retinol-eye-cream",
  title: "Glutanex Retinol Eye Cream",
  short_description:
    "Retinol-based eye cream to reduce the appearance of fine lines, puffiness, and dark circles with consistent nighttime use.",
  description:
    "Glutanex Retinol Eye Cream supports under-eye renewal with a lightweight formula suitable for nightly routines.",
  img: "/assets/img/product/product-14.jpg",
  status: "in-stock",
  category: { name: "Eye Care" },
  brand: { name: "Glutanex" },
  tags: ["Fine line support", "Dark circle care", "Night repair"],
};

const normalize = (value) => String(value || "").toLowerCase().trim();

const productScore = (product) => {
  const text = [
    product?.title,
    product?.short_description,
    product?.shortDescription,
    product?.description,
    product?.brand?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const mustMatch = ["glutanex", "retinol", "eye", "cream"];
  return mustMatch.reduce((score, term) => (text.includes(term) ? score + 1 : score), 0);
};

const pickGlutanexProduct = (products = []) => {
  const scored = products
    .map((item) => ({ item, score: productScore(item) }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score >= 2 ? scored[0].item : null;
};

const GlutanexRetinolEyeCreamPage = ({ product }) => {
  const activeProduct = product || FALLBACK_PRODUCT;
  const parsedPrice = Number.parseFloat(
    String(activeProduct?.price ?? "")
      .replace(/[^0-9.,-]/g, "")
      .replace(/,/g, "")
  );
  const hasPrice = Number.isFinite(parsedPrice);
  const displayPrice = hasPrice
    ? `PKR ${parsedPrice.toLocaleString("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "";
  const pageTitle = getProductMetaTitle(activeProduct);
  const pageDescription = getProductMetaDescription(activeProduct);
  const canonical = "/glutanex-retinol-eye-cream";
  const productSchema = buildProductStructuredData({
    product: activeProduct,
    canonicalPath: canonical,
  });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Glutanex Retinol Eye Cream available in Lahore?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. NEES Medical supports same-day dispatch in Lahore for eligible orders.",
        },
      },
      {
        "@type": "Question",
        name: "Who should use Glutanex Retinol Eye Cream?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is suitable for users targeting the appearance of fine lines, dullness, and uneven under-eye texture in evening routines.",
        },
      },
      {
        "@type": "Question",
        name: "How should I apply this eye cream?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Apply a small amount at night on clean skin around the eye area, then follow with a moisturizer.",
        },
      },
    ],
  };
  const structuredData = [productSchema, faqSchema];
  const productPath = product?._id
    ? buildProductPath(product)
    : "/search?searchText=glutanex%20retinol%20eye%20cream";

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical={canonical}
        image={activeProduct?.img}
        type="product"
        structuredData={structuredData}
      />
      <HeaderThree />

      <section className="pt-80 pb-90">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-5">
              <Image
                src={activeProduct?.img || FALLBACK_PRODUCT.img}
                alt="Glutanex Retinol Eye Cream - Fine line support - NEES Medical Lahore"
                width={560}
                height={560}
                priority={true}
                sizes="(max-width: 991px) 100vw, 50vw"
                style={{ width: "100%", height: "auto", borderRadius: "16px" }}
              />
            </div>
            <div className="col-lg-7">
              <span className="tp-section-title-pre-2">Lahore Priority Product</span>
              <h1 className="mb-15">Glutanex Retinol Eye Cream</h1>
              {hasPrice && (
                <p className="mb-10">
                  <strong>Current Price:</strong> {displayPrice}
                </p>
              )}
              <p className="mb-20">
                Dermatology-focused eye care for daily night routines. Designed to reduce the
                appearance of fine lines, puffiness, and dull under-eye texture with consistent use.
              </p>
              <p className="mb-25">
                Available across Pakistan with same-day dispatch support in Lahore for eligible orders.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-25">
                <Link href={productPath} className="tp-btn">
                  Open Product Page
                </Link>
                <Link href="/shop?status=in-stock" className="tp-btn tp-btn-border">
                  View In-Stock Skincare
                </Link>
                <Link href="/contact" className="tp-btn tp-btn-border">
                  Contact NEES Lahore
                </Link>
              </div>
              <ul>
                <li>Supports smoother under-eye texture in 3-4 weeks of regular use</li>
                <li>Targets tired-eye appearance after long screen and sun exposure days</li>
                <li>Pairs well with hydration serums in evening routines</li>
              </ul>
            </div>
          </div>

          <div className="row mt-50">
            <div className="col-lg-12">
              <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h2 className="mb-20">Frequently Bought Together</h2>
                <div className="d-flex flex-wrap gap-2">
                  <Link href="/search?searchText=hyaluronic%20acid" className="tp-btn tp-btn-border">Hyaluronic Acid Serum</Link>
                  <Link href="/search?searchText=vitamin%20c%20serum" className="tp-btn tp-btn-border">Vitamin C Serum</Link>
                  <Link href="/shop" className="tp-btn tp-btn-border">Browse Full Skincare Catalog</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-40">
            <div className="col-lg-12">
              <h3>FAQ</h3>
              <p><strong>Is this available in Lahore?</strong> Yes, same-day dispatch support is available for eligible Lahore orders.</p>
              <p><strong>Who should use it?</strong> Users managing under-eye fine lines, uneven texture, and dullness in night routines.</p>
              <p><strong>How to use?</strong> Apply a small amount at night on clean skin and follow with a moisturizer.</p>
            </div>
          </div>
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
        product: null,
      },
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/product/all`);
    if (!response.ok) {
      return {
        props: {
          product: null,
        },
      };
    }

    const payload = await response.json();
    const products = Array.isArray(payload?.data) ? payload.data : [];
    const selected = pickGlutanexProduct(products);

    if (!selected || normalize(selected?.status) === "inactive") {
      return {
        props: {
          product: null,
        },
      };
    }

    return {
      props: {
        product: selected,
      },
    };
  } catch (error) {
    console.error("Failed to resolve Glutanex page product:", error);
    return {
      props: {
        product: null,
      },
    };
  }
};

export default GlutanexRetinolEyeCreamPage;
