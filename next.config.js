/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "production",
  images: {
    loader: "custom",
    loaderFile: "./cloudinary-loader.js",
    domains: [
      "i.ibb.co",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "encrypted-tbn0.gstatic.com",
      "example.com",
      "cdn.shopify.com",
    ],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  async redirects() {
    return [
      {
        source: "/Glutanex.html",
        destination: "/glutanex-retinol-eye-cream",
        permanent: true,
      },
      {
        source: "/glutanex.html",
        destination: "/glutanex-retinol-eye-cream",
        permanent: true,
      },
      {
        source: "/products/glutanex-retinol-eye-cream",
        destination: "/glutanex-retinol-eye-cream",
        permanent: true,
      },
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/product/dermaheal-spf-50-pa-sunscreen",
        destination: "/product/dermheal-sunscreen-stick-spf-50",
        permanent: true,
      },
      {
        source: "/product/dermaheal-sunscreen-stick-spf-50",
        destination: "/product/dermheal-sunscreen-stick-spf-50",
        permanent: true,
      },
      {
        source: "/Pharmaceutical.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/wontech.html",
        destination: "/medical-devices",
        permanent: true,
      },
      {
        source: "/Glutanex-02.html",
        destination: "/glutanex-retinol-eye-cream",
        permanent: true,
      },
      {
        source: "/skinboosters-serum.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/Revivogen.html",
        destination: "/products/keyword/revivogen",
        permanent: true,
      },
      {
        source: "/about-us.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/medical-devices/[slug]",
        destination: "/medical-devices",
        permanent: true,
      },
      {
        source: "/medical-devices/%5Bslug%5D",
        destination: "/medical-devices",
        permanent: true,
      },
      {
        source: "/IDS.html",
        destination: "/medical-devices",
        permanent: true,
      },
      {
        source: "/clearogen.html",
        destination: "/products/keyword/clearogen",
        permanent: true,
      },
      {
        source: "/Lutronic.html",
        destination: "/medical-devices",
        permanent: true,
      },
      {
        source: "/caf",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/caf/",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/search/cc.php",
        destination: "/search",
        permanent: true,
      },
      {
        source: "/search/portal.php",
        destination: "/search",
        permanent: true,
      },
      {
        source: "/day-night-kit.pdf",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/glow.pdf",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/Bewhite-3.pdf",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/contact-html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/contact.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/shop-html",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/shop.html",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/blog-html",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog.html",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/Mesotherapy.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/Dermaheal.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/dermal-fillers.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/hugel.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/whitening-injections.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/Be-White.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/Ultra-V.html",
        destination: "/professional",
        permanent: true,
      },
      {
        source: "/contact-us.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/visvisal.html",
        destination: "/visvisal",
        permanent: true,
      },
      {
        source: "/viviscal.html",
        destination: "/visvisal",
        permanent: true,
      },
      {
        source: "/visvisal-product.html",
        destination: "/visvisal",
        permanent: true,
      },
      {
        source: "/viviscal-product.html",
        destination: "/visvisal",
        permanent: true,
      },
      {
        source: "/product-details",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product-details-video",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product-details-swatches",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product-details-countdown",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product-details/:id",
        destination: "/product/:id",
        permanent: true,
      },
    ];
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, max-age=0",
            },
          ],
        },
      ];
    }

    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
      {
        source: "/assets/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=0, must-revalidate",
          },
        ],
      },
      {
        source: "/assets/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=0, must-revalidate",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600, must-revalidate",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=300",
          },
        ],
      },
      {
        source: "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
