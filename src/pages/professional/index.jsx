import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import ProfessionalProductCard from "@/components/b2b/professional-product-card";
import { isActiveProduct } from "@/utils/product-access";
import {
  CLINICAL_CATEGORY_ORDER,
  getClinicalCategoryName,
} from "@/config/clinical-categories";
import { normalizeQuerySlug, toSlug } from "@/utils/slug";
import { buildClinicalKeywordIndex } from "@/utils/clinical-keywords";

const ProfessionalProductsPage = () => {
  const router = useRouter();
  const { data: products, isLoading, isError } = useGetAllProductsQuery();
  const selectedCategorySlug = normalizeQuerySlug(router.query?.category);
  const selectedCategoryLabel = selectedCategorySlug
    ? selectedCategorySlug.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
    : "";
  const pageTitle = selectedCategoryLabel
    ? `${selectedCategoryLabel} Clinical Products`
    : "Professional Clinical Products";
  const pageDescription = selectedCategoryLabel
    ? `Explore ${selectedCategoryLabel} clinical products for professional use with clear product details and dedicated clinic support.`
    : "Browse NEES Medical professional catalog including fillers, boosters, premium products, and threads for licensed clinics.";
  const pageKeywords = selectedCategoryLabel
    ? `${selectedCategoryLabel} clinical products, ${selectedCategoryLabel} pakistan, professional injectables lahore, clinic use only products`
    : "dermaqual pakistan, dermaqual exosome, asce exosome pakistan, asce exobio exosome, pdrn skin booster pakistan, botulax 100 units pakistan, professional clinical products lahore";
  const canonical = selectedCategorySlug
    ? `/professional?category=${selectedCategorySlug}`
    : "/professional";

  let content = null;

  if (isLoading) {
    content = <p className="text-center">Loading professional products...</p>;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error loading professional products." />;
  }

  if (!isLoading && !isError && products?.data?.length > 0) {
    const clinicalItems = products.data.filter(
      (item) =>
        isActiveProduct(item) &&
        String(item?.productType || "").trim().toLowerCase() === "clinical"
    );

    if (!clinicalItems.length) {
      content = <ErrorMsg msg="No clinical products found." />;
    } else {
      const groupedMap = clinicalItems.reduce((acc, item) => {
        const categoryName = getClinicalCategoryName(item);
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
      }, {});

      const knownOrderMap = new Map(
        CLINICAL_CATEGORY_ORDER.map((name, idx) => [toSlug(name), idx])
      );
      const categoryNames = Object.keys(groupedMap).sort((a, b) => {
        const aOrder = knownOrderMap.has(toSlug(a)) ? knownOrderMap.get(toSlug(a)) : Number.MAX_SAFE_INTEGER;
        const bOrder = knownOrderMap.has(toSlug(b)) ? knownOrderMap.get(toSlug(b)) : Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.localeCompare(b);
      });

      const selectedCategoryName = categoryNames.find(
        (name) => toSlug(name) === selectedCategorySlug
      );
      const orderedCategories = selectedCategoryName
        ? [
            selectedCategoryName,
            ...categoryNames.filter((name) => name !== selectedCategoryName),
          ]
        : categoryNames;
      const topClinicalKeywords = buildClinicalKeywordIndex(products.data, {
        maxKeywords: 12,
        minProductMatches: 1,
      });

      content = (
        <>
          <div className="nees-prof-category-links d-flex flex-wrap justify-content-center gap-2 mb-35">
            <Link href="/professional" className={`tp-btn tp-btn-sm ${!selectedCategorySlug ? "active" : ""}`}>
              All Clinical Products
            </Link>
            {CLINICAL_CATEGORY_ORDER.map((name) => (
              <Link
                key={name}
                href={`/professional?category=${toSlug(name)}`}
                className={`tp-btn tp-btn-sm ${selectedCategorySlug === toSlug(name) ? "active" : ""}`}
              >
                {name}
              </Link>
            ))}
          </div>

          {selectedCategorySlug && !selectedCategoryName && (
            <div className="mb-35">
              <ErrorMsg msg="No products found in this clinical category. Showing available categories below." />
            </div>
          )}

          {orderedCategories.map((categoryName) => (
            <section key={categoryName} className="mb-45">
              <div className="d-flex align-items-end justify-content-between mb-20">
                <h3 className="tp-section-title mb-0">{categoryName}</h3>
                <span className="tp-product-count">{groupedMap[categoryName].length} Products</span>
              </div>
              <div className="row g-4">
                {groupedMap[categoryName].map((item) => (
                  <div key={item._id} className="col-xl-4 col-md-6">
                    <ProfessionalProductCard product={item} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {topClinicalKeywords.length > 0 && (
            <section className="mt-50">
              <div className="p-4" style={{ border: "1px solid #e9ebf1", borderRadius: "14px" }}>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-20">
                  <h3 className="mb-0">Clinical Search Keywords</h3>
                  <Link href="/professional-keywords" className="tp-btn tp-btn-border">
                    View All Clinical Keywords
                  </Link>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {topClinicalKeywords.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/professional/keyword/${entry.slug}`}
                      className="tp-btn tp-btn-border"
                    >
                      {entry.keyword} ({entry.productCount})
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      );
    }
  }

  if (!isLoading && !isError && (!products?.data || products.data.length === 0)) {
    content = <ErrorMsg msg="No products found." />;
  }

  return (
    <Wrapper>
      <SEO pageTitle={pageTitle} description={pageDescription} canonical={canonical} keywords={pageKeywords} />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Professional Products" subtitle="Professional Catalog" bg_clr={true} />

      <section className="nees-prof-listing pt-70 pb-90">
        <div className="container">
          <div className="nees-section-head text-center mb-40">
            <span>Open Professional Catalog</span>
            <h2>Imported Injectables and Clinic-Use Products</h2>
            <p className="mb-0">
              Search-focused catalog for Dermaqual queries, ASCE+ exosome, PDRN boosters, botulax
              100 units, dermal filler, and mesotherapy procurement by licensed clinics in Pakistan.
            </p>
          </div>
          {content}
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProfessionalProductsPage;
