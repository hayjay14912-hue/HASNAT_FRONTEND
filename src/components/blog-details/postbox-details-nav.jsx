import React from 'react';
import Link from 'next/link';
import { ArrowRightLong, ArrowRightLongPrev } from '@/svg';
import blogData from '@/data/blog-data';

const blogPosts = blogData.filter((entry) => entry.blog === "blog-postbox");

const PostboxDetailsNav = ({ currentBlogId }) => {
  const currentIndex = blogPosts.findIndex((entry) => entry.id === currentBlogId);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="tp-postbox-details-navigation d-none d-md-flex justify-content-between align-items-center">
      <div className="tp-postbox-details-navigation-item d-flex align-items-center">
        {previousPost ? (
          <>
            <div className="tp-postbox-details-navigation-icon mr-15">
              <span>
                <Link href={`/blog-details/${previousPost.id}`}>
                  <ArrowRightLongPrev/>
                </Link>
              </span>
            </div>
            <div className="tp-postbox-details-navigation-content">
              <span>Previous Post</span>
              <h3 className="tp-postbox-details-navigation-title">
                <Link href={`/blog-details/${previousPost.id}`}>{previousPost.title}</Link>
              </h3>
            </div>
          </>
        ) : (
          <div className="tp-postbox-details-navigation-content">
            <span>Previous Post</span>
            <h3 className="tp-postbox-details-navigation-title">No earlier post</h3>
          </div>
        )}
      </div>
      <div className="tp-postbox-details-navigation-item d-flex align-items-center text-end">
        {nextPost ? (
          <>
            <div className="tp-postbox-details-navigation-content">
              <span>Next Post</span>
              <h3 className="tp-postbox-details-navigation-title">
                <Link href={`/blog-details/${nextPost.id}`}>{nextPost.title}</Link>
              </h3>
            </div>
            <div className="tp-postbox-details-navigation-icon ml-15">
              <span>
                <Link href={`/blog-details/${nextPost.id}`}>
                  <ArrowRightLong/>
                </Link>
              </span>
            </div>
          </>
        ) : (
          <div className="tp-postbox-details-navigation-content">
            <span>Next Post</span>
            <h3 className="tp-postbox-details-navigation-title">No newer post</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostboxDetailsNav;
