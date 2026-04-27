import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import blogData from "@/data/blog-data";
import { getSiteUrl } from "@/utils/seo-utils";

const BlogDetailsPage = ({query}) => {
  const blogItem = blogData.find(b => Number(b.id) === Number(query.id));
  const siteUrl = getSiteUrl();
  const pageTitle = blogItem?.title || "Blog Details";
  const description = blogItem?.excerpt || blogItem?.desc || "Read the latest NEES Medical blog article.";
  const keywords = blogItem?.keywords || "";
  const canonical = blogItem?.canonical || `/blog-details/${query.id}`;
  const structuredData = blogItem
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blogItem.title,
        description,
        datePublished: blogItem.date,
        dateModified: blogItem.date,
        author: {
          "@type": "Organization",
          name: blogItem.author || "NEES Medical",
        },
        publisher: {
          "@type": "Organization",
          name: "NEES Medical",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/assets/img/logo/brand-logo-favicon.png`,
          },
        },
        mainEntityOfPage: `${siteUrl}${canonical}`,
        keywords: blogItem?.tags || [],
      }
    : null;

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={description}
        canonical={canonical}
        keywords={keywords}
        type="article"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      <BlogDetailsArea blog={blogItem} />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogDetailsPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
