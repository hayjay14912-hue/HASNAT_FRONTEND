import React from 'react';
import Image from 'next/image';
// internal
import BlogSidebar from '../blog/blog-postox/blog-sidebar';
import BlogPostCommentForm from '../forms/blog-post-comment-form';
import BlogDetailsAuthor from './blog-details-author';
import BlogDetailsComments from './blog-details-comments';
import PostboxDetailsNav from './postbox-details-nav';
import PostboxDetailsTop from './postbox-details-top';
import shape_line from '@assets/img/blog/details/shape/line.png';
import shape_line_2 from '@assets/img/blog/details/shape/quote.png';
import blog_details_big_img from '@assets/img/blog/details/blog-big-1.jpg';
import blog_details_sm_img from '@assets/img/blog/details/blog-details-sm-1.jpg';
import social_data from '@/data/social-data';
import comment_data from '@/data/blog-comment-data';

const BlogDetailsArea = ({blog}) => {
  const sections = Array.isArray(blog?.content?.sections) ? blog.content.sections : [];
  const faq = Array.isArray(blog?.content?.faq)
    ? blog.content.faq
    : Array.isArray(blog?.faqItems)
      ? blog.faqItems
      : [];
  const hasStructuredContent =
    blog?.content && typeof blog.content === "object" && !Array.isArray(blog.content);
  const hasHtmlContent = typeof blog?.content === "string" && blog.content.trim().length > 0;
  const authorName = blog?.author?.name || blog?.author || "Ayesha Fiza";

  return (
    <section className="tp-postbox-details-area pb-120 pt-95">
      <div className="container">
        <div className="row">
          <div className="col-xl-9">
            {/* PostboxDetailsTop */}
            <PostboxDetailsTop blog={blog} />
            {/* PostboxDetailsTop */}
          </div>
          <div className="col-xl-12">
            <div className="tp-postbox-details-thumb">
              <Image src={blog_details_big_img} alt="blog-big-img" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <div className="tp-postbox-details-main-wrapper">
              <div className="tp-postbox-details-content">
                {hasStructuredContent ? (
                  <>
                    <p className="tp-dropcap">{blog.content.intro}</p>

                    {sections.map((section) => (
                      <React.Fragment key={section.heading}>
                        <h4 className="tp-postbox-details-heading">{section.heading}</h4>
                        {Array.isArray(section.paragraphs)
                          ? section.paragraphs.map((paragraph, index) => (
                              <p key={`${section.heading}-${index}`}>{paragraph}</p>
                            ))
                          : null}
                        {Array.isArray(section.list) && section.list.length > 0 ? (
                          <div className="tp-postbox-details-list">
                            <ul>
                              {section.list.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </React.Fragment>
                    ))}

                    <div className="tp-postbox-details-desc-thumb text-center">
                      <Image src={blog_details_sm_img} alt="details-sm-img" />
                      <span className="tp-postbox-details-desc-thumb-caption">
                        Search-focused content works best when it supports the same categories users already visit.
                      </span>
                    </div>

                    {blog?.content?.quote ? (
                      <div className="tp-postbox-details-quote">
                        <blockquote>
                          <div className="tp-postbox-details-quote-shape">
                            <Image className="tp-postbox-details-quote-shape-1" src={shape_line} alt="shape" />
                            <Image className="tp-postbox-details-quote-shape-2" src={shape_line_2} alt="shape" />
                          </div>
                          <p>{blog.content.quote.text}</p>
                          <cite>{blog.content.quote.author}</cite>
                        </blockquote>
                      </div>
                    ) : null}

                    {faq.length > 0 ? (
                      <>
                        <h4 className="tp-postbox-details-heading">Frequently Asked Questions</h4>
                        {faq.map((item) => (
                          <React.Fragment key={item.question}>
                            <p><strong>{item.question}</strong></p>
                            <p>{item.answer}</p>
                          </React.Fragment>
                        ))}
                      </>
                    ) : null}

                    {blog?.content?.conclusion ? <p>{blog.content.conclusion}</p> : null}
                  </>
                ) : hasHtmlContent ? (
                  <>
                    <div
                      className="tp-postbox-details-html-content"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    {faq.length > 0 ? (
                      <>
                        <h4 className="tp-postbox-details-heading">Frequently Asked Questions</h4>
                        {faq.map((item, index) => (
                          <React.Fragment key={`${item?.question || "faq"}-${index}`}>
                            <p><strong>{item?.question}</strong></p>
                            <p>{item?.answer}</p>
                          </React.Fragment>
                        ))}
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="tp-dropcap">sales process is critically important to the success of your reps and your business. If you have never seen a really skilled salesperson work, it seems almost effortless. They ask great questions, craftt perfect proposal, answer questions, address concerns and seamlessly seal the Underneath the surface of all of that, the salesperson has probably dedicated hours honing their craft and ensuring the process moves smoothly.</p>

                    <p>One of the challenges that often surfaces when  working with a remote sales team is a lack of transparency over what is happening, and where in the process things are taking place. We’re going to peel back the curtain and show you how to create the best sales.</p>

                    <h4 className="tp-postbox-details-heading">Breaking Up With Fast Fashion Has Been Easier</h4>
                    <p>Lommodo ligula eget dolor. Aenean massa. Cum sociis que penatibus magnis dis parturient montes lorem, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque euro, pretium, sem. Nulla onsequat massa quis enim. donec pede justo fringilla vel aliquet.</p>

                    <div className="tp-postbox-details-desc-thumb text-center">
                      <Image src={blog_details_sm_img} alt="details-sm-img" />
                      <span className="tp-postbox-details-desc-thumb-caption">Gucci’s Women’s Cruise Collection 2023 Lookbook Has Arrived</span>
                    </div>
                    <p>“We’re so glad we’ll be working with you to get your new marketing strategy up and running. I have attached the details of your package. Next you’ll get an email from Jen to schedule your kick-off meeting and be assigned your account rep. During your kick-off meeting, we will introduce your project team, let you know what access we need to start.” </p>

                    <div className="tp-postbox-details-quote">
                      <blockquote>
                        <div className="tp-postbox-details-quote-shape">
                          <Image className="tp-postbox-details-quote-shape-1" src={shape_line} alt="shape" />
                          <Image className="tp-postbox-details-quote-shape-2" src={shape_line_2} alt="shape" />
                        </div>
                        <p>There is a way out of every box, a solution to every puzzle its just a matter of finding it.</p>
                        <cite>Ayesha Fiza</cite>
                      </blockquote>
                    </div>

                    <h4 className="tp-postbox-details-heading">Exploring the English Countryside</h4>
                    <p>Lorem ligula eget dolor. Aenean massa. Cum sociis que penatibus et magnis dis parturient montes lorem,nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque euro, pretium quis, sem. Nulla onsequat massa quis enim.</p>

                    <div className="tp-postbox-details-list">
                      <ul>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>At vero eos et accusamus et iusto odio.</li>
                        <li>Excepteur sint occaecat cupidatat non proident.</li>
                      </ul>
                    </div>
                    <p>Rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer cidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae lorem.</p>
                  </>
                )}

                <div className="tp-postbox-details-share-wrapper">
                  <div className="row">
                    <div className="col-xl-8 col-lg-6">
                      <div className="tp-postbox-details-tags tagcloud">
                        <span>Tags:</span>
                        {(blog?.tags || ["Lifesttyle", "Awesome", "Winter", "Sunglasses"]).map((tag) => (
                          <a href="#" key={tag}>{tag}</a>
                        ))}
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="tp-postbox-details-share text-md-end">
                        <span>Share:</span>
                        {social_data.map((s) => (
                          <a href={s.link} className="me-1" target="_blank" key={s.id}>
                            <i className={s.icon}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PostboxDetailsNav */}
                <PostboxDetailsNav currentBlogId={blog?.id} />
                {/* PostboxDetailsNav */}

                {/* author details start */}
                <BlogDetailsAuthor authorName={authorName} />
                {/* author details end */}

                <div className="tp-postbox-details-comment-wrapper">
                  <h3 className="tp-postbox-details-comment-title">Comments ({comment_data.length})</h3>
                  {/* BlogDetailsComments */}
                  <BlogDetailsComments />
                  {/* BlogDetailsComments */}
                </div>

                <div className="tp-postbox-details-form">
                  <h3 className="tp-postbox-details-form-title">Leave a Reply</h3>
                  <p>Your email address will not be published. Required fields are marked *</p>

                  {/* form start */}
                  <BlogPostCommentForm />
                  {/* form end */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            {/* sidebar start */}
            <BlogSidebar />
            {/* sidebar end */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;
