import Link from "next/link";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import {
  buildClinicalKeywordIndex,
  findClinicalProductsByKeyword,
  getClinicalActiveProducts,
  resolveClinicalKeywordFromSlug,
} from "@/utils/clinical-keywords";

const toDisplayKeyword = (value = "") =>
  String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

const cleanText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const getDescription = (product) =>
  cleanText(product?.short_description || product?.shortDescription || product?.description || "");

const getKeywordIntentSummary = (keyword = "") => {
  const value = String(keyword || "").toLowerCase();

  if (value.includes("dermaqual")) {
    return "Researching Dermaqual in Pakistan usually means buyers want a reliable professional supply route, transparent availability, and confirmation of sourcing before ordering.";
  }

  if (value.includes("exosome")) {
    return "Exosome-related searches are usually high-trust clinical purchase queries where buyers want professional support, sourcing clarity, and the right product fit for their clinic.";
  }

  if (value.includes("pdrn")) {
    return "PDRN searches usually come from clinics comparing protocol fit, availability, and professional procurement support before placing an order.";
  }

  if (value.includes("mesotherapy")) {
    return "Mesotherapy buyers usually want clinic-oriented product comparison, availability, and help choosing the right formulation for professional use.";
  }

  return "These professional keyword pages are built for clinics and advanced skincare buyers comparing availability, use case, and procurement options in Pakistan.";
};

const getFaqItems = (keyword = "") => {
  const value = String(keyword || "").trim();

  return [
    {
      question: `Can I inquire about ${value} through NEES Medical?`,
      answer:
        "Yes. You can contact NEES Medical for current availability, professional pricing inquiries, and product guidance for clinical or dermatologist-led use.",
    },
    {
      question: `What should I verify before buying ${value} or similar professional products in Pakistan?`,
      answer:
        "Ask for current availability, packaging condition, batch details, intended use, and whether the product is suitable for professional workflow before confirming an order.",
    },
    {
      question: "Is online checkout available for all professional products?",
      answer:
        "No. Many professional-use items are handled through direct inquiry so the sales team can confirm product fit, availability, and procurement details first.",
    },
  ];
};

const KeywordClinicalPage = ({ keyword, products, relatedKeywords }) => {
  const displayKeyword = toDisplayKeyword(keyword);
  const slug = String(keyword || "").trim().replace(/\s+/g, "-").toLowerCase();
  const pageTitle = `${displayKeyword} Clinical Products in Pakistan | NEES Medical`;
  const pageDescription =
    `Explore ${displayKeyword} clinical products for licensed clinics in Pakistan. ` +
    `Compare formulations and request professional pricing from NEES Medical.`;
  const canonical = `/professional/keyword/${slug}`;
  const intentSummary = getKeywordIntentSummary(keyword);
  const faqItems = getFaqItems(displayKeyword);

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayKeyword} Clinical Products`,
    about: displayKeyword,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.neesmedical.com/professional/${product?._id || product?.id || ""}`,
        name: product?.title || "Clinical Product",
      })),
    },
  };
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const structuredData = [collectionStructuredData, faqStructuredData];

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={pageDescription}
        canonical={canonical}
        keywords={`${displayKeyword}, ${displayKeyword} pakistan, ${displayKeyword} lahore, ${displayKeyword} professional inquiry, clinical products pakistan, professional injectables pakistan`}
        type="website"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />

      <section className="pt-80 pb-90">
        <div className="container">
          <div className="mb-30 text-center">
            <h1 className="mb-10">{displayKeyword} Clinical Products</h1>
            <p className="mb-0">
              Professional-use product results for <strong>{displayKeyword}</strong>. These pages are
              optimized for clinical procurement and research intent.
            </p>
          </div>

          <div className="mb-35 p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <h2 className="h4 mb-15">Professional Inquiry Guidance</h2>
            <p className="mb-15">{intentSummary}</p>
            <p className="mb-20">
              NEES Medical supports professional product research with direct inquiry handling,
              availability checks, and product guidance for clinics, dermatologist-led practices, and
              advanced buyers who need a clear next step instead of generic marketplace listings.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link
                href={`/request-pricing?product=${encodeURIComponent(displayKeyword)}`}
                className="tp-btn"
              >
                Request Professional Pricing
              </Link>
              <Link href="/professional" className="tp-btn tp-btn-border">
                Browse Clinical Catalog
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
              <p className="mb-15">No direct product matches were found for this keyword right now.</p>
              <p className="mb-20">
                If you are searching for a brand or formulation such as {displayKeyword}, contact the
                NEES Medical team directly so they can confirm current availability or suggest a suitable
                professional alternative.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link href="/professional" className="tp-btn">Browse Clinical Catalog</Link>
                <Link href="/request-pricing" className="tp-btn tp-btn-border">Request Pricing</Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product) => (
                <div key={product?._id || product?.id || product?.title} className="col-lg-6">
                  <article className="p-4 h-100" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                    <h2 className="h5 mb-10">{product?.title || "Clinical Product"}</h2>
                    {getDescription(product) ? <p className="mb-15">{getDescription(product)}</p> : null}
                    <div className="d-flex flex-wrap gap-2">
                      <Link
                        href={`/professional/${product?._id || product?.id || ""}`}
                        className="tp-btn tp-btn-border"
                      >
                        Open Clinical Product
                      </Link>
                      <Link
                        href={`/request-pricing?product=${encodeURIComponent(product?.title || "")}`}
                        className="tp-btn tp-btn-border"
                      >
                        Request Pricing
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {relatedKeywords.length > 0 ? (
            <div className="mt-50 p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
              <h3 className="mb-20">Related Clinical Keywords</h3>
              <div className="d-flex flex-wrap gap-2">
                {relatedKeywords.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/professional/keyword/${entry.slug}`}
                    className="tp-btn tp-btn-border"
                  >
                    {toDisplayKeyword(entry.keyword)} ({entry.productCount})
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-50 p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <h3 className="mb-20">How To Verify Professional Product Supply</h3>
            <div className="row g-4">
              <div className="col-lg-4">
                <article>
                  <h4 className="h6 mb-10">Confirm Current Availability</h4>
                  <p className="mb-0">
                    Ask for the current product title, size, and intended use before placing a clinic
                    order so there is no mismatch between expectation and stock.
                  </p>
                </article>
              </div>
              <div className="col-lg-4">
                <article>
                  <h4 className="h6 mb-10">Request Batch And Packaging Details</h4>
                  <p className="mb-0">
                    For professional skincare and injectables, buyers should verify packaging condition,
                    batch information, and handling details before confirmation.
                  </p>
                </article>
              </div>
              <div className="col-lg-4">
                <article>
                  <h4 className="h6 mb-10">Use Direct Inquiry For Fit</h4>
                  <p className="mb-0">
                    Professional products are best handled through direct sales inquiry so the team can
                    guide clinics toward the right formulation or a close alternative when needed.
                  </p>
                </article>
              </div>
            </div>
          </div>

          <div className="mt-50 p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <h3 className="mb-20">{displayKeyword} FAQ</h3>
            <div className="row g-4">
              {faqItems.map((item) => (
                <div key={item.question} className="col-lg-4">
                  <article>
                    <h4 className="h6 mb-10">{item.question}</h4>
                    <p className="mb-0">{item.answer}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export const getServerSideProps = async ({ params }) => {
  const safeSlug = String(params?.keyword || "").trim().toLowerCase();
  const keywordFromSlug = resolveClinicalKeywordFromSlug(safeSlug);
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
    const clinicalProducts = getClinicalActiveProducts(products);
    const keywordIndex = buildClinicalKeywordIndex(products, {
      maxKeywords: 200,
      minProductMatches: 1,
    });

    const exactEntry = keywordIndex.find((entry) => entry.slug === safeSlug);
    const resolvedKeyword = exactEntry?.keyword || keywordFromSlug;

    if (!resolvedKeyword) {
      return { notFound: true };
    }

    const directMatches = exactEntry
      ? clinicalProducts.filter((product) =>
          exactEntry.productIds.includes(String(product?._id || product?.id || ""))
        )
      : [];

    const fallbackMatches = directMatches.length > 0
      ? []
      : findClinicalProductsByKeyword(products, resolvedKeyword);

    const matchedProducts = directMatches.length > 0 ? directMatches : fallbackMatches;

    const relatedKeywords = keywordIndex
      .filter((entry) => entry.slug !== safeSlug)
      .slice(0, 18);

    return {
      props: {
        keyword: resolvedKeyword,
        products: matchedProducts.slice(0, 36),
        relatedKeywords,
      },
    };
  } catch (error) {
    console.error("Failed to resolve clinical keyword page:", error);
    return { notFound: true };
  }
};

export default KeywordClinicalPage;
