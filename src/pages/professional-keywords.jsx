import Link from "next/link";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import { buildClinicalKeywordIndex } from "@/utils/clinical-keywords";

const FEATURED_QUERY_LINKS = [
  { keyword: "ASCE Exosome", slug: "asce-exosome" },
  { keyword: "Dermaqual", slug: "dermaqual" },
  { keyword: "Dermaqual Exosome", slug: "dermaqual-exosome" },
  { keyword: "Dermaqual Exocell", slug: "dermaqual-exocell" },
  { keyword: "Exosome Serum", slug: "exosome-serum" },
  { keyword: "PDRN Skin Booster", slug: "pdrn-skin-booster" },
];

const toDisplayKeyword = (value = "") =>
  String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

const ProfessionalKeywordsPage = ({ keywordIndex = [] }) => {
  const pageTitle = "Clinical Product Keywords in Pakistan | NEES Medical";
  const description =
    "SEO keyword index for NEES Medical professional clinical catalog. Explore ASCE exosome, Dermaqual, botulax, PDRN, filler, and mesotherapy related clinical product pages.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NEES Medical Clinical Keyword Index",
    numberOfItems: keywordIndex.length,
    itemListElement: keywordIndex.slice(0, 60).map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.keyword,
      url: `https://www.neesmedical.com/professional/keyword/${entry.slug}`,
    })),
  };

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={description}
        canonical="/professional-keywords"
        keywords="asce exosome pakistan, asce+ exosome pakistan, dermaqual pakistan, dermaqual exosome, clinical products pakistan, professional injectables lahore, pdrn skin booster, botulax 100 units"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />

      <section className="pt-80 pb-90">
        <div className="container">
          <h1 className="mb-15">Clinical Keyword Directory</h1>
          <p className="mb-30">
            Index of high-intent clinical search terms connected to live professional catalog pages.
          </p>

          <div className="p-4 mb-30" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <h2 className="h5 mb-15">ASCE Search Route</h2>
            <p className="mb-15">
              If buyers search for ASCE exosome in Pakistan, send them to the dedicated ASCE page or
              the exact clinical keyword route below.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link href="/asce-exosome-pakistan" className="tp-btn tp-btn-border">
                Open ASCE Landing Page
              </Link>
              <Link href="/professional/keyword/asce-exosome" className="tp-btn tp-btn-border">
                Open ASCE Keyword Route
              </Link>
            </div>
          </div>

          <div className="p-4 mb-30" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <h2 className="h5 mb-15">Featured Clinical Search Routes</h2>
            <div className="d-flex flex-wrap gap-2">
              {FEATURED_QUERY_LINKS.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/professional/keyword/${entry.slug}`}
                  className="tp-btn tp-btn-border"
                >
                  {entry.keyword}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <div className="d-flex flex-wrap gap-2">
              {keywordIndex.map((entry) => (
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
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export const getServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return { props: { keywordIndex: [] } };
  }

  try {
    const response = await fetch(`${baseUrl}/api/product/all`);
    if (!response.ok) {
      return { props: { keywordIndex: [] } };
    }

    const payload = await response.json();
    const products = Array.isArray(payload?.data) ? payload.data : [];

    return {
      props: {
        keywordIndex: buildClinicalKeywordIndex(products, {
          maxKeywords: 220,
          minProductMatches: 1,
        }),
      },
    };
  } catch (error) {
    console.error("Failed to resolve professional keyword index:", error);
    return { props: { keywordIndex: [] } };
  }
};

export default ProfessionalKeywordsPage;
