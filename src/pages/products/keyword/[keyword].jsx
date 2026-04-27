import Link from "next/link";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import Footer from "@/layout/footers/footer";
import { buildProductPath, getProductPricing } from "@/utils/seo-utils";
import {
  buildKeywordIndex,
  findProductsByKeyword,
  getRetailActiveProducts,
  resolveKeywordFromSlug,
} from "@/utils/product-keywords";

const formatPrice = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return "";
  }
  return `PKR ${parsed.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getDescription = (product) =>
  String(product?.short_description || product?.shortDescription || product?.description || "")
    .replace(/\s+/g, " ")
    .trim();

const toDisplayKeyword = (value = "") =>
  String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

const KeywordProductsPage = ({ keyword, products, relatedKeywords }) => {
  const displayKeyword = toDisplayKeyword(keyword);
  const keywordSlug = String(keyword || "").toLowerCase().replace(/\s+/g, "-");
  const isSunscreenIntent =
    keywordSlug.includes("sunscreen") ||
    keywordSlug.includes("sun-stick") ||
    keywordSlug.includes("sunstick");
  const pageTitle = isSunscreenIntent
    ? "Sunscreen in Pakistan - SPF 50 Sunstick & Daily UV Protection | NEES Medical"
    : `${displayKeyword} Products in Pakistan - Price & Details | NEES Medical`;
  const pageDescription = isSunscreenIntent
    ? "Explore sunscreen in Pakistan with SPF 50 options, sunsticks, and daily UV protection products. Compare prices and details from live NEES Medical catalog data."
    : `Browse ${displayKeyword} products with current PKR prices and details at NEES Medical. Updated from live catalog data.`;
  const canonical = `/products/keyword/${keyword.replace(/\s+/g, "-").toLowerCase()}`;
  const pageKeywords = isSunscreenIntent
    ? "sunscreen in pakistan, sunscreen stick pakistan, spf 50 sunscreen pakistan, best sunscreen stick in pakistan, korean sunscreen stick"
    : `${displayKeyword} in pakistan, ${displayKeyword} price in pakistan`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayKeyword} Products`,
    about: displayKeyword,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.neesmedical.com${buildProductPath(product)}`,
        name: product?.title || "Product",
      })),
    },
  };

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical={canonical}
        keywords={pageKeywords}
        type="website"
        structuredData={structuredData}
      />
      <HeaderThree />

      <section className="pt-80 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="mb-15">
                {isSunscreenIntent
                  ? "Sunscreen in Pakistan - SPF 50 Products, Price & Details"
                  : `${displayKeyword} Products - Price & Details`}
              </h1>
              {isSunscreenIntent ? (
                <p className="mb-30">
                  Looking for the best sunscreen in Pakistan? Compare SPF 50 sunscreen options and sunsticks with
                  updated product details. For buying guidance, read our{" "}
                  <Link href="/blog/best-sunscreen-stick-pakistan-2026-spf-50-sunstick-guide">
                    Sunscreen Stick guide
                  </Link>{" "}
                  or open the{" "}
                  <Link href="/product/dermaheal-spf-50-pa-sunscreen">Dermheal SPF 50 sunscreen page</Link>.
                </p>
              ) : (
                <p className="mb-30">
                  Live filtered results for <strong>{displayKeyword}</strong>. Click any product for full
                  details, availability, and checkout/inquiry options.
                </p>
              )}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="row">
              <div className="col-lg-12">
                <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                  <p className="mb-20">
                    No direct matches found for this keyword right now. Explore all products:
                  </p>
                  <Link href="/shop" className="tp-btn">
                    Browse Full Catalog
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product) => {
                const pricing = getProductPricing(product);
                const description = getDescription(product);
                return (
                  <div key={product?._id || product?.id || product?.title} className="col-lg-6">
                    <article
                      className="p-4 h-100"
                      style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}
                    >
                      <h2 className="h5 mb-10">{product?.title}</h2>
                      {pricing.hasBasePrice ? (
                        <p className="mb-10">
                          <strong>Price:</strong>{" "}
                          {pricing.hasSalePrice ? (
                            <>
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "#8b93a7",
                                  marginRight: "8px",
                                }}
                              >
                                {formatPrice(pricing.basePrice)}
                              </span>
                              <span style={{ color: "#b45309", fontWeight: 700 }}>
                                {formatPrice(pricing.salePrice)}
                              </span>
                            </>
                          ) : (
                            <span>{formatPrice(pricing.basePrice)}</span>
                          )}
                        </p>
                      ) : null}
                      {description ? <p className="mb-15">{description}</p> : null}
                      <div className="d-flex flex-wrap gap-2">
                        <Link href={buildProductPath(product)} className="tp-btn tp-btn-border">
                          Open Product
                        </Link>
                        <Link href="/request-pricing" className="tp-btn tp-btn-border">
                          Request Pricing
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          )}

          {relatedKeywords.length > 0 ? (
            <div className="row mt-50">
              <div className="col-lg-12">
                <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                  <h3 className="mb-20">Related Product Keywords</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {relatedKeywords.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/products/keyword/${item.slug}`}
                        className="tp-btn tp-btn-border"
                      >
                        {item.keyword} ({item.productCount})
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {isSunscreenIntent ? (
            <div className="row mt-40">
              <div className="col-lg-12">
                <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                  <h2 className="mb-20">Sunscreen FAQ (Pakistan)</h2>
                  <p>
                    <strong>Is sunscreen stick better than cream?</strong>
                    <br />
                    Sunscreen sticks are usually easier to reapply and less greasy for daily outdoor use.
                  </p>
                  <p className="mb-0">
                    <strong>Can oily skin use SPF 50 sunstick?</strong>
                    <br />
                    Yes, lightweight SPF 50 sunsticks are commonly preferred for oily and acne-prone skin in hot weather.
                  </p>
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

export const getServerSideProps = async ({ params }) => {
  const safeSlug = String(params?.keyword || "").trim().toLowerCase();
  const keywordFromSlug = resolveKeywordFromSlug(safeSlug);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!safeSlug || !baseUrl) {
    return { notFound: true };
  }

  try {
    const response = await fetch(`${baseUrl}/api/product/all`);
    if (!response.ok) {
      return { notFound: true };
    }

    const payload = await response.json();
    const products = Array.isArray(payload?.data) ? payload.data : [];
    const retailProducts = getRetailActiveProducts(products);
    const keywordIndex = buildKeywordIndex(products, {
      maxKeywords: 200,
      minProductMatches: 1,
    });
    const exactEntry = keywordIndex.find((entry) => entry.slug === safeSlug);
    const resolvedKeyword = exactEntry?.keyword || keywordFromSlug;
    const directMatches = exactEntry
      ? retailProducts.filter((product) =>
          exactEntry.productIds.includes(String(product?._id || product?.id || ""))
        )
      : [];
    const fallbackMatches = directMatches.length > 0 ? [] : findProductsByKeyword(products, resolvedKeyword);
    const matchedProducts = directMatches.length > 0 ? directMatches : fallbackMatches;

    if (!resolvedKeyword) {
      return { notFound: true };
    }

    if (matchedProducts.length === 0) {
      return {
        props: {
          keyword: resolvedKeyword,
          products: [],
          relatedKeywords: keywordIndex.slice(0, 15),
        },
      };
    }

    const relatedKeywords = keywordIndex
      .filter((entry) => entry.slug !== safeSlug)
      .slice(0, 15);

    return {
      props: {
        keyword: resolvedKeyword,
        products: matchedProducts.slice(0, 36),
        relatedKeywords,
      },
    };
  } catch (error) {
    console.error("Failed to resolve keyword products page:", error);
    return { notFound: true };
  }
};

export default KeywordProductsPage;
