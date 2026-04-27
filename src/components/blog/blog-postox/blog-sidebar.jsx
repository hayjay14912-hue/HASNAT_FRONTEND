import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import user from '@assets/img/users/pk-girl-1.jpg';
import signature from '@assets/img/blog/signature/signature.png';
import { Search } from '@/svg';
import blogData from '@/data/blog-data';

// latest post
const latest_post = blogData.filter((b) => b.blog === "blog-postbox").slice(0, 3);
const getBlogHref = (item = {}) => (item?.slug ? `/blog/${item.slug}` : `/blog-details/${item.id}`);

const BlogSidebar = ({ latestPosts = [] }) => {
  const latestItems = Array.isArray(latestPosts) && latestPosts.length > 0 ? latestPosts : latest_post;
  return (
    <>
      <div className="tp-sidebar-wrapper tp-sidebar-ml--24">
        <div className="tp-sidebar-widget mb-35">
          <div className="tp-sidebar-search">
            <form action="#">
              <div className="tp-sidebar-search-input">
                <input type="text" placeholder="Search..." />
                <button type="submit">
                  <Search/>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* about  */}
        <div className="tp-sidebar-widget mb-35">
          <h3 className="tp-sidebar-widget-title">About NEES Medical</h3>
          <div className="tp-sidebar-widget-content">
            <div className="tp-sidebar-about">
              <div className="tp-sidebar-about-thumb mb-25">
                <a href="#">
                  <Image src={user} alt="user" />
                </a>
              </div>
              <div className="tp-sidebar-about-content">
                <h3 className="tp-sidebar-about-title">
                  <a href="#">NEES Medical</a>
                </h3>
                <span className="tp-sidebar-about-designation">Skincare and Clinical Aesthetic Supplier</span>
                <p>
                  Content focused on skincare, professional products, medical devices,
                  and search-friendly buying guides for Pakistan.
                </p>
                <div className="tp-sidebar-about-signature">
                  <Image src={signature} alt="signature" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- about end --> */}

        {/* <!-- latest post start --> */}
        <div className="tp-sidebar-widget mb-35">
          <h3 className="tp-sidebar-widget-title">Latest Posts</h3>
          <div className="tp-sidebar-widget-content">
            <div className="tp-sidebar-blog-item-wrapper">
              {latestItems.map((b, index) => (
              <div key={b.id} className="tp-sidebar-blog-item d-flex align-items-center">
                <div className="tp-sidebar-blog-thumb">
                  {b?.img ? (
                    <Link href={getBlogHref(b)}>
                      <Image src={b.img} alt="blog img" />
                    </Link>
                  ) : (
                    <div
                      style={{
                        width: 85,
                        height: 75,
                        borderRadius: 8,
                        background: "#eef1f5",
                      }}
                    />
                  )}
                </div>
                <div className="tp-sidebar-blog-content">
                  <div className="tp-sidebar-blog-meta">
                    <span>{b.date || "-"}</span>
                  </div>
                  <h3 className="tp-sidebar-blog-title">
                    <Link href={getBlogHref(b)}>{b.title || `Post ${index + 1}`}</Link>
                  </h3>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
        {/* <!-- latest post end --> */}

        {/* <!-- categories start --> */}
        <div className="tp-sidebar-widget widget_categories mb-35">
          <h3 className="tp-sidebar-widget-title">Categories</h3>
          <div className="tp-sidebar-widget-content">
            <ul>
              <li><Link href="/blog">Skincare Guides <span>(3)</span></Link></li>
              <li><Link href="/blog">Professional Products <span>(2)</span></Link></li>
              <li><Link href="/blog">Medical Devices <span>(2)</span></Link></li>
              <li><Link href="/blog">Clinic SEO <span>(4)</span></Link></li>
            </ul>
          </div>
        </div>
        {/* <!-- categories end --> */}

        {/* <!-- tag cloud start --> */}
        <div className="tp-sidebar-widget mb-35">
          <h3 className="tp-sidebar-widget-title">Popular Tags</h3>
          <div className="tp-sidebar-widget-content tagcloud">
            <a href="#">Dermatologist Store Pakistan</a>
            <a href="#">Exosome Products Pakistan</a>
            <a href="#">Clinical Products</a>
            <a href="#">Medical Devices Pakistan</a>
            <a href="#">Aesthetic Clinic Supplier Lahore</a>
            <a href="#">NEES Medical</a>
          </div>
        </div>
        {/* <!-- tag cloud end --> */}

      </div>
    </>
  );
};

export default BlogSidebar;
