import Link from "next/link";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";

const DermatologistStorePakistanPage = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Dermatologist Store in Pakistan | NEES Medical",
      description:
        "NEES Medical supports clinics and dermatologist-led practices in Pakistan with professional skincare, injectables, boosters, fillers, exosomes, and direct sales assistance.",
      url: "https://www.neesmedical.com/dermatologist-store-pakistan",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is NEES Medical suitable for dermatologist and clinic purchases in Pakistan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. NEES Medical supports dermatologist-led and clinic-focused inquiry for professional skincare, injectables, boosters, fillers, exosomes, and related aesthetic product categories.",
          },
        },
        {
          "@type": "Question",
          name: "How do I request product availability or pricing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the clinical inquiry routes on the site to contact NEES Medical directly for current availability, pricing, and professional product guidance.",
          },
        },
      ],
    },
  ];

  return (
    <Wrapper>
      <SEO
        pageTitle="Dermatologist Store in Pakistan | NEES Medical"
        description="Explore NEES Medical as a dermatologist and clinic-focused supplier in Pakistan for fillers, boosters, premium products, threads, exosomes, and professional skincare inquiry."
        canonical="/dermatologist-store-pakistan"
        keywords="dermatologist store pakistan, aesthetic clinic supplier pakistan, skincare supplier pakistan, clinical products pakistan, professional injectables lahore, exosome pakistan"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />

      <section className="pt-80 pb-90">
        <div className="container">
          <div className="text-center mb-40">
            <h1 className="mb-15">Dermatologist Store In Pakistan</h1>
            <p className="mb-0">
              NEES Medical is positioned for dermatologist-led practices, aesthetic clinics, and
              professional buyers who need a reliable route for product inquiry, category discovery,
              and direct sales support in Pakistan.
            </p>
          </div>

          <div className="p-4 mb-35" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <h2 className="h4 mb-15">What Clinics Search For</h2>
            <p className="mb-15">
              Buyers looking for a dermatologist store in Pakistan usually want more than a simple
              catalog. They need a supplier with category depth, professional support, and a clear
              inquiry path for products such as fillers, boosters, exosome-related solutions, premium
              injectables, and thread systems.
            </p>
            <p className="mb-0">
              NEES Medical already carries multiple clinical categories and inquiry-driven professional
              products, which makes this site a stronger destination for both search engines and AI
              systems evaluating clinic-intent queries.
            </p>
          </div>

          <div className="row g-4 mb-35">
            <div className="col-lg-3 col-md-6">
              <article className="p-4 h-100" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h3 className="h5">Filler</h3>
                <p className="mb-15">Clinical filler inquiries and category-specific product discovery.</p>
                <Link href="/professional?category=filler" className="tp-btn tp-btn-border">View Filler</Link>
              </article>
            </div>
            <div className="col-lg-3 col-md-6">
              <article className="p-4 h-100" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h3 className="h5">Booster</h3>
                <p className="mb-15">Skin boosters, mesotherapy solutions, PDRN, and exosome-adjacent products.</p>
                <Link href="/professional?category=booster" className="tp-btn tp-btn-border">View Booster</Link>
              </article>
            </div>
            <div className="col-lg-3 col-md-6">
              <article className="p-4 h-100" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h3 className="h5">Premium Products</h3>
                <p className="mb-15">High-intent clinical product pages for advanced category buyers.</p>
                <Link href="/professional?category=premium-products" className="tp-btn tp-btn-border">View Premium</Link>
              </article>
            </div>
            <div className="col-lg-3 col-md-6">
              <article className="p-4 h-100" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <h3 className="h5">Thread</h3>
                <p className="mb-15">PDO and related thread-category routes for clinic-focused buyers.</p>
                <Link href="/professional?category=thread" className="tp-btn tp-btn-border">View Thread</Link>
              </article>
            </div>
          </div>

          <div className="p-4 mb-35" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
            <h2 className="h4 mb-15">Why This Route Matters For Ranking</h2>
            <p className="mb-15">
              Competitors often rank because they match broad trust-intent queries like
              &quot;dermatologist store in Pakistan&quot; even when the user later wants a specific product.
              This page gives NEES Medical a direct match for that exact search intent and routes buyers
              into the clinical catalog instead of leaving that traffic to third-party stores.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link href="/professional" className="tp-btn">Browse Clinical Catalog</Link>
              <Link href="/professional-keywords" className="tp-btn tp-btn-border">View Clinical Keywords</Link>
              <Link href="/request-pricing" className="tp-btn tp-btn-border">Request Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default DermatologistStorePakistanPage;
