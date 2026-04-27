import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import { getSiteUrl } from "@/utils/seo-utils";

const formatDateLabel = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const normalizeBlogForUi = (blog) => {
  const publishDate = blog?.workflow?.publishedAt || blog?.createdAt || new Date().toISOString();
  const incomingAuthor = blog?.author?.name || blog?.author || "";
  const normalizedAuthor =
    /nees medical/i.test(String(incomingAuthor)) || !incomingAuthor
      ? "Ayesha Noor"
      : incomingAuthor;
  return {
    ...blog,
    id: blog?._id || blog?.id || "",
    author: normalizedAuthor,
    date: formatDateLabel(publishDate),
    comments: Number(blog?.comments || 0),
  };
};

const BlogSlugPage = ({ blog }) => {
  if (!blog) return null;
  const siteUrl = getSiteUrl();
  const pageTitle = blog?.seo?.metaTitle || blog?.title || "Blog";
  const description = blog?.seo?.metaDescription || blog?.excerpt || "NEES Medical blog post.";
  const canonicalPath = `/blog/${blog.slug}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const keywordString = Array.isArray(blog?.tags) ? blog.tags.join(", ") : "";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog?.title,
    description,
    datePublished: blog?.workflow?.publishedAt || blog?.createdAt,
    dateModified: blog?.updatedAt || blog?.workflow?.publishedAt || blog?.createdAt,
    author: {
      "@type": "Organization",
      name: blog?.author?.name || "NEES Medical",
    },
    publisher: {
      "@type": "Organization",
      name: "NEES Medical",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/img/logo/brand-logo-favicon.png`,
      },
    },
    mainEntityOfPage: canonicalUrl,
    keywords: blog?.tags || [],
  };

  return (
    <Wrapper>
      <SEO
        pageTitle={pageTitle}
        description={description}
        canonical={canonicalPath}
        keywords={keywordString}
        type="article"
        structuredData={structuredData}
      />
      <HeaderTwo style_2={true} />
      <BlogDetailsArea blog={normalizeBlogForUi(blog)} />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogSlugPage;

export const getServerSideProps = async (context) => {
  const slugValue = String(context?.params?.slug || "").trim();
  if (!slugValue) {
    return { notFound: true };
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return { notFound: true };
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/blogs/${encodeURIComponent(slugValue)}`
    );

    if (!response.ok) {
      return { notFound: true };
    }

    const payload = await response.json();
    const blog = payload?.data || null;

    if (!blog || String(blog?.workflow?.status || "").toLowerCase() !== "published") {
      return { notFound: true };
    }

    return {
      props: {
        blog,
      },
    };
  } catch (error) {
    console.error("Failed to load blog by slug:", error);
    return { notFound: true };
  }
};
