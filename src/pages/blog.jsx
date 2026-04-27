import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogBreadcrumb from "@/components/breadcrumb/blog-breadcrumb";
import BlogPostboxArea from "@/components/blog/blog-postox/blog-postbox-area";
import blogData from "@/data/blog-data";

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

const normalizeCmsBlog = (entry) => {
  const publishedAt = entry?.workflow?.publishedAt || entry?.createdAt || "";
  const incomingAuthor = entry?.author?.name || "";
  const normalizedAuthor =
    /nees medical/i.test(String(incomingAuthor)) || !incomingAuthor
      ? "Ayesha Noor"
      : incomingAuthor;
  return {
    id: entry?._id || entry?.id || "",
    slug: entry?.slug || "",
    img: entry?.featuredImage || entry?.galleryImages?.[0] || "",
    date: formatDateLabel(publishedAt) || "Published",
    author: normalizedAuthor,
    comments: 0,
    tags: Array.isArray(entry?.tags) ? entry.tags : [],
    category: entry?.category || "Blog",
    title: entry?.title || "Blog Post",
    desc: entry?.excerpt || "",
    excerpt: entry?.excerpt || "",
    blog: "blog-postbox",
  };
};

const fallbackPosts = blogData.filter((b) => b.blog === "blog-postbox");

const BlogPostBoxPage = ({ cmsPosts = [] }) => {
  const posts = Array.isArray(cmsPosts) && cmsPosts.length > 0 ? cmsPosts : fallbackPosts;
  return (
    <Wrapper>
      <SEO
        pageTitle="Blog"
        description="Read NEES Medical blog articles about dermatologist store searches in Pakistan, professional clinical products, skincare categories, and aesthetic device buying guides."
        canonical="/blog"
        keywords="dermatologist store pakistan, professional clinical products pakistan, aesthetic clinic supplier lahore, medical devices pakistan, nees medical blog"
      />
      <HeaderTwo style_2={true} />
      <BlogBreadcrumb/>
      <BlogPostboxArea items={posts} />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogPostBoxPage;

export const getServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return { props: { cmsPosts: [] } };
  }

  try {
    const response = await fetch(`${baseUrl}/api/blogs?status=published&limit=100`);
    if (!response.ok) {
      return { props: { cmsPosts: [] } };
    }
    const payload = await response.json();
    const items = Array.isArray(payload?.data) ? payload.data.map(normalizeCmsBlog) : [];
    return { props: { cmsPosts: items } };
  } catch (error) {
    console.error("Failed to fetch CMS blog posts:", error);
    return { props: { cmsPosts: [] } };
  }
};
