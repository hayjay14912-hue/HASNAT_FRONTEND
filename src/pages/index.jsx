import SEO from "@/components/seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import Wrapper from "@/layout/wrapper";
import HeaderThree from '@/layout/headers/header-3';
import BeautyBanner from '@/components/banner/beauty-banner';
import BeautyCategory from '@/components/categories/beauty-category';
import FeaturedOfferBanner from "@/components/home/featured-offer-banner";
// import BeautyFeatured from '@/components/features/beauty-featured';
import ProductAreaTwo from '@/components/products/beauty/product-area-2';
import BeautyTestimonial from '@/components/testimonial/beauty-testimonial';
import FeatureAreaTwo from '@/components/features/feature-area-2';
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";
import { getActiveBogoOffer } from "@/utils/bogo";
import { toSlug } from "@/utils/slug";
import { getSiteUrl } from "@/utils/seo-utils";

import Footer from '@/layout/footers/footer';

const TrendingSpecialPrd = dynamic(
  () => import('@/components/products/beauty/trending-special-prd'),
  { ssr: false }
);

const toHomeProduct = (item) => {
  const description = typeof item?.description === "string"
    ? item.description.trim().slice(0, 320)
    : "";

  return {
    _id: item?._id,
    img: item?.img || "",
    title: item?.title || "",
    price: Number(item?.price || 0),
    discount: Number(item?.discount || 0),
    tags: Array.isArray(item?.tags) ? item.tags.slice(0, 3) : [],
    status: item?.status || "in-stock",
    quantity: Number(item?.quantity || 0),
    feature: Boolean(item?.feature),
    featured: Boolean(item?.featured),
    createdAt: item?.createdAt || "",
    description,
    parent: item?.parent || "",
    brand: {
      name: item?.brand?.name || item?.brandName || "",
      logo: item?.brand?.logo || "",
    },
    category: {
      id: item?.category?.id || item?.category?._id || "",
      _id: item?.category?._id || item?.category?.id || "",
      name: item?.category?.name || "",
    },
    inquiryOnly: Boolean(item?.inquiryOnly),
    isInquiryOnly: Boolean(item?.isInquiryOnly),
    professionalUseOnly: Boolean(item?.professionalUseOnly),
    bogoOffer: item?.bogoOffer
      ? {
          enabled: Boolean(item?.bogoOffer?.enabled),
          label: String(item?.bogoOffer?.label || "").trim(),
          bundleSize: Number(item?.bogoOffer?.bundleSize || 0),
          bundlePrice: Number(item?.bogoOffer?.bundlePrice || 0),
        }
      : null,
  };
};

export default function Home({
  initialCategories = null,
  initialCategoryCounts = null,
  initialProducts = null,
  featuredBogoProduct = null,
}) {
  const siteUrl = getSiteUrl();
  const canonical = "/";
  const pageTitle = "Shop Premium Skincare and Beauty Essentials";
  const description =
    "Discover premium skincare, beauty, and wellness essentials with trusted formulations, transparent product details, and fast checkout.";
  const keywords =
    "skincare pakistan, beauty products pakistan, sunscreen pakistan, serum pakistan, dermatologist skincare store";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HASNAT",
    url: `${siteUrl}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?searchText={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={description}
        canonical={canonical}
        keywords={keywords}
        structuredData={structuredData}
      />
      <HeaderThree/>
      <BeautyBanner/>
      <FeaturedOfferBanner product={featuredBogoProduct} />
      <BeautyCategory
        initialCategories={initialCategories}
        initialCategoryCounts={initialCategoryCounts}
      />
      <ProductAreaTwo initialProducts={initialProducts} />
      <section className="pt-20 pb-20">
        <div className="container">
          <div
            className="p-4"
            style={{
              border: "1px solid #e9ebf1",
              borderRadius: "14px",
              background: "#f8fafc",
            }}
          >
            <h2 className="h4 mb-10">Sunscreen in Pakistan</h2>
            <p className="mb-15">
              Explore SPF 50 sunscreen options and compare top daily-use products from our live catalog.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link className="tp-btn tp-btn-border" href="/products/keyword/sunscreen">
                View Sunscreen Products
              </Link>
              <Link
                className="tp-btn tp-btn-border"
                href="/blog/best-sunscreen-stick-pakistan-2026-spf-50-sunstick-guide"
              >
                Read Sunscreen Stick Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* <BeautyFeatured/> */}
      <TrendingSpecialPrd/>
      <BeautyTestimonial/>
      <FeatureAreaTwo/>
      <Footer style_3={true} />
    </Wrapper>
  )
}

const fetchApiJson = async (baseUrl, path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`);
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return null;
  }
};

export async function getStaticProps() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return {
      props: {
        initialCategories: null,
        initialCategoryCounts: null,
        initialProducts: null,
      },
      revalidate: 120,
    };
  }

  const [categoriesRes, allProductsRes] = await Promise.all([
    fetchApiJson(baseUrl, "/api/category/show/beauty"),
    fetchApiJson(baseUrl, "/api/product/all"),
  ]);

  const allProducts = Array.isArray(allProductsRes?.data) ? allProductsRes.data : [];
  const activeProducts = allProducts.filter(
    (item) => isActiveProduct(item) && isRetailProduct(item)
  );
  const categoryCounts = activeProducts.reduce((acc, item) => {
    const categoryId = String(item?.category?.id || item?.category?._id || "");
    const categorySlug = toSlug(item?.category?.name || item?.parent || "");

    if (categoryId) {
      acc[categoryId] = (acc[categoryId] || 0) + 1;
    }
    if (categorySlug) {
      acc[categorySlug] = (acc[categorySlug] || 0) + 1;
    }
    return acc;
  }, {});

  const featuredRetailProducts = activeProducts.filter(
    (item) => Boolean(item?.feature ?? item?.featured)
  );
  const bogoRetailProducts = activeProducts.filter((item) => Boolean(getActiveBogoOffer(item)));
  const featuredBogoSource =
    bogoRetailProducts.find((item) => Boolean(item?.feature ?? item?.featured)) ||
    bogoRetailProducts[0] ||
    null;
  const newInRetailProducts = activeProducts
    .slice()
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 9);
  const homePoolMap = new Map();

  [...featuredRetailProducts, ...newInRetailProducts].forEach((item) => {
    if (item?._id && !homePoolMap.has(item._id)) {
      homePoolMap.set(item._id, item);
    }
  });

  const homeRetailProducts = Array.from(homePoolMap.values()).map(toHomeProduct);

  const initialCategories =
    categoriesRes && Array.isArray(categoriesRes?.result) ? categoriesRes : null;
  const initialCategoryCounts =
    allProductsRes && Array.isArray(allProductsRes?.data) ? categoryCounts : null;
  const initialProducts =
    allProductsRes && Array.isArray(allProductsRes?.data)
      ? { data: homeRetailProducts, prefiltered: true }
      : null;
  const featuredBogoProduct = featuredBogoSource ? toHomeProduct(featuredBogoSource) : null;

  return {
    props: {
      initialCategories,
      initialCategoryCounts,
      initialProducts,
      featuredBogoProduct,
    },
    revalidate: 120,
  };
}
