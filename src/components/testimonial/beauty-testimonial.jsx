import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import insta_1 from '@assets/img/instagram/4/instagram-1.jpg';
import insta_2 from '@assets/img/instagram/4/instagram-2.jpg';
import insta_3 from '@assets/img/instagram/4/instagram-3.jpg';
import insta_4 from '@assets/img/instagram/4/instagram-4.jpg';
import insta_5 from '@assets/img/instagram/4/instagram-5.jpg';
import insta_6 from '@assets/img/instagram/4/instagram-6.jpg';
import { Play } from "@/svg";

const instagram_proof_data = [
  {
    id: 1,
    type: 'Post',
    title: 'Doctor Recommended Glow Protocol',
    excerpt: 'A dermatologist highlights visible brightening results after a guided routine.',
    doctor: 'Dr. Sana Aesthetic Clinic',
    media: insta_1,
    link: 'https://www.instagram.com/neesmedicalinc/?hl=en'
  },
  {
    id: 2,
    type: 'Reel',
    title: 'Clinic Shelf Essentials Breakdown',
    excerpt: 'Real-time reel featuring top-performing formulas used in treatment support plans.',
    doctor: 'Dr. Haseeb Dermatology',
    media: insta_2,
    link: 'https://www.instagram.com/neesmedicalinc/?hl=en'
  },
  {
    id: 3,
    type: 'Video',
    title: 'Post-Procedure Skincare Guidance',
    excerpt: 'Specialist explains recovery-safe product choices and patient care consistency.',
    doctor: 'Aesthetic Care Studio',
    media: insta_3,
    link: 'https://www.instagram.com/neesmedicalinc/?hl=en'
  },
  {
    id: 4,
    type: 'Reel',
    title: 'Clinical Texture Improvement Story',
    excerpt: 'A short-form reel showing before and after progress shared by a partner clinic.',
    doctor: 'Skin Science Center',
    media: insta_4,
    link: 'https://www.instagram.com/neesmedicalinc/?hl=en'
  },
  {
    id: 5,
    type: 'Post',
    title: 'Trusted by Dermatology Professionals',
    excerpt: 'Doctor-led recommendation post focused on product tolerance and performance.',
    doctor: 'Dermacare Practice',
    media: insta_5,
    link: 'https://www.instagram.com/neesmedicalinc/?hl=en'
  },
  {
    id: 6,
    type: 'Video',
    title: 'In-Clinic Product Demo',
    excerpt: 'Hands-on product showcase recorded by a clinic team for patient education.',
    doctor: 'Rejuve Medical Aesthetics',
    media: insta_6,
    link: 'https://www.instagram.com/neesmedicalinc/?hl=en'
  }
];

function toImgSrc(media) {
  if (!media) return "";
  if (typeof media === "string") return media;
  if (typeof media?.src === "string") return media.src;
  return "";
}

const BeautyTestimonial = () => {
  const railRef = useRef(null);
  const [igItems, setIgItems] = useState([]);
  const [igOk, setIgOk] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/instagram/media?limit=6")
      .then((r) => r.json())
      .then((json) => {
        if (!isMounted) return;
        if (json?.ok && Array.isArray(json?.items)) {
          setIgOk(true);
          setIgItems(json.items);
        } else {
          setIgOk(false);
          setIgItems([]);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setIgOk(false);
        setIgItems([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Play/pause videos when visible inside the horizontal rail (IG-like behavior).
  useEffect(() => {
    const rootEl = railRef.current;
    if (!rootEl) return;

    const videos = Array.from(rootEl.querySelectorAll("video[data-ig-video='1']"));
    if (videos.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target;
          if (!(vid instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting) {
            const p = vid.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { root: rootEl, threshold: 0.6 }
    );

    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [igItems]);

  const reelItems = useMemo(() => {
    if (igOk && igItems.length > 0) {
      return igItems.slice(0, 6).map((item) => {
        const type = item?.type || "Post";
        const title =
          (typeof item?.caption === "string" && item.caption.trim().split("\n")[0].slice(0, 60)) ||
          "Instagram";
        return {
          id: item?.id,
          type,
          title,
          link: item?.permalink,
          media_url: item?.media_url || "",
          thumbnail_url: item?.thumbnail_url || "",
          isVideo: String(item?.media_type || "").toUpperCase() === "VIDEO",
        };
      });
    }

    return instagram_proof_data.map((item) => ({
      id: String(item.id),
      type: item.type,
      title: item.title,
      link: item.link,
      media_url: toImgSrc(item.media),
      thumbnail_url: "",
      isVideo: false,
    }));
  }, [igItems, igOk]);

  return (
    <>
      <section className="tp-proof-area pt-115 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-proof-heading-wrap text-center mb-50">
                <span className="tp-proof-chip">Instagram Proof</span>
                <h3 className="tp-proof-title">Doctor-Recommended Posts, Reels and Videos</h3>
                <p className="tp-proof-description">
                  We are replacing generic reviews with real social proof from clinics and doctors.
                  This section can be updated anytime with your newest Instagram content.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="aura-proof-reels-bleed">
                <div ref={railRef} className="tp-proof-grid aura-proof-reels" role="list" aria-label="Instagram reels">
                  {reelItems.map((item) => (
                    <article key={item.id} className="tp-proof-card aura-proof-reel" role="listitem">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tp-proof-media"
                        aria-label={item.title}
                      >
                        {item.isVideo ? (
                          <video
                            data-ig-video="1"
                            muted
                            loop
                            playsInline
                            preload="none"
                            poster={item.thumbnail_url || undefined}
                            src={item.media_url}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <img
                            src={item.media_url}
                            alt={item.title}
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                        <span className={`tp-proof-media-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                        {(item.type === 'Reel' || item.type === 'Video') && (
                          <span className="tp-proof-play" aria-hidden="true">
                            <Play />
                          </span>
                        )}
                        <span className="aura-proof-ig" aria-hidden="true">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.4.5.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.4-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.4-.5-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.4-1.2-.5-2.4-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-2 .5-2.4.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.2-.4 2.4-.5 1.3-.1 1.7-.1 4.9-.1Zm0-2.2c-3.3 0-3.7 0-5 .1-1.3.1-2.2.3-3 .6-.8.3-1.6.8-2.3 1.5-.7.7-1.2 1.4-1.5 2.3-.3.8-.5 1.7-.6 3C0 8.3 0 8.7 0 12s0 3.7.1 5c.1 1.3.3 2.2.6 3 .3.8.8 1.6 1.5 2.3.7.7 1.4 1.2 2.3 1.5.8.3 1.7.5 3 .6 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.6-.8 2.3-1.5.7-.7 1.2-1.4 1.5-2.3.3-.8.5-1.7.6-3 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.3-2.2-.6-3-.3-.8-.8-1.6-1.5-2.3-.7-.7-1.4-1.2-2.3-1.5-.8-.3-1.7-.5-3-.6C15.7 0 15.3 0 12 0Zm0 5.8A6.2 6.2 0 1 0 12 18.2 6.2 6.2 0 0 0 12 5.8Zm0 10.2A4 4 0 1 1 12 8a4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              <div className="tp-proof-cta text-center mt-45">
                <a
                  href="https://www.instagram.com/neesmedicalinc/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-btn tp-btn-2"
                >
                  See More on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default dynamic(() => Promise.resolve(BeautyTestimonial), { ssr: false });
