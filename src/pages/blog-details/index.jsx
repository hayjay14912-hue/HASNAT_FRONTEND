import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import blogData from "@/data/blog-data";

const BlogDetailsPage = () => {
  const featuredBlog =
    blogData.find((item) => item.blog === "blog-postbox" && item.content) || blogData[0];

  return (
    <Wrapper>
      <SEO
        pageTitle={featuredBlog?.title || "Blog Details"}
        description={featuredBlog?.excerpt || featuredBlog?.desc || "NEES Medical blog article"}
        canonical={featuredBlog?.canonical || "/blog-details"}
        keywords={featuredBlog?.keywords || ""}
      />
      <HeaderTwo style_2={true} />
      <BlogDetailsArea blog={featuredBlog} />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogDetailsPage;

