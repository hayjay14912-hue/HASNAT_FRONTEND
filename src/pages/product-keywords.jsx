import Link from "next/link";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import Footer from "@/layout/footers/footer";
import { buildProductPath, getProductPricing } from "@/utils/seo-utils";
import { buildKeywordIndex, getRetailActiveProducts } from "@/utils/product-keywords";
import { FEATURED_RETAIL_SEARCHES } from "@/data/pakistan-skincare-keywords";
import { toSlug } from "@/utils/slug";

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

const ProductKeywordsPage = ({ keywordIndex, featuredProducts }) => {
  const pageTitle = "Product Keywords & Price Index | NEES Medical";
  const description =
    "Crawlable product keyword directory for NEES Medical. Discover Pakistan skincare search routes for sunscreen, acne, pigmentation, vitamin C, niacinamide, and product price intent pages generated from live catalog data.";
  const canonical = "/product-keywords";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NEES Medical Product Keyword Index",
    numberOfItems: keywordIndex.length,
    itemListElement: keywordIndex.slice(0, 30).map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.keyword,
      url: `https://www.neesmedical.com/products/keyword/${entry.slug}`,
    })),
  };

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={description}
        canonical={canonical}
        type="website"
        structuredData={structuredData}
      />
      <HeaderThree />

      <section className="pt-80 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="mb-15">Product Keyword SEO Hub</h1>
              <p className="mb-30">
                This page is generated from live product API data to help search engines crawl
                product keywords, details, and price intent pages.
              </p>
            </div>
          </div>

          <div className="row g-4 mb-40">
            <div className="col-lg-12">
              <div className="p-4 mb-30" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h2 className="mb-20">Pakistan Search Intent Routes</h2>
                <div className="d-flex flex-wrap gap-2">
                  {FEATURED_RETAIL_SEARCHES.map((keyword) => (
                    <Link
                      key={keyword}
                      href={`/products/keyword/${toSlug(keyword)}`}
                      className="tp-btn tp-btn-border"
                    >
                      {keyword}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h2 className="mb-20">Featured Product Links (Price + Details)</h2>
                <div className="d-flex flex-wrap gap-2">
                  {featuredProducts.map((product) => {
                    const pricing = getProductPricing(product);
                    return (
                      <Link
                        key={product?._id || product?.id || product?.title}
                        href={buildProductPath(product)}
                        className="tp-btn tp-btn-border"
                      >
                        {product?.title}
                        {pricing.hasBasePrice ? " - " : ""}
                        {pricing.hasSalePrice ? (
                          <>
                            <span
                              style={{
                                textDecoration: "line-through",
                                color: "#8b93a7",
                                marginInline: "6px",
                              }}
                            >
                              {formatPrice(pricing.basePrice)}
                            </span>
                            <span style={{ color: "#b45309", fontWeight: 700 }}>
                              {formatPrice(pricing.salePrice)}
                            </span>
                          </>
                        ) : pricing.hasBasePrice ? (
                          <span>{formatPrice(pricing.basePrice)}</span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-12">
              <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h2 className="mb-20">Top Product Keywords</h2>
                <div className="d-flex flex-wrap gap-2">
                  {keywordIndex.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/products/keyword/${entry.slug}`}
                      className="tp-btn tp-btn-border"
                    >
                      {entry.keyword} ({entry.productCount})
                    </Link>
                  ))}
                </div>
              </div>
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
    return { props: { keywordIndex: [], featuredProducts: [] } };
  }

  try {
    const response = await fetch(`${baseUrl}/api/product/all`);
    if (!response.ok) {
      return { props: { keywordIndex: [], featuredProducts: [] } };
    }

    const payload = await response.json();
    const products = Array.isArray(payload?.data) ? payload.data : [];
    const retailProducts = getRetailActiveProducts(products);
    const keywordIndex = buildKeywordIndex(products, {
      maxKeywords: 120,
      minProductMatches: 2,
    });

    return {
      props: {
        keywordIndex,
        featuredProducts: retailProducts.slice(0, 24),
      },
    };
  } catch (error) {
    console.error("Failed to resolve product keywords page:", error);
    return { props: { keywordIndex: [], featuredProducts: [] } };
  }
};

export default ProductKeywordsPage;
