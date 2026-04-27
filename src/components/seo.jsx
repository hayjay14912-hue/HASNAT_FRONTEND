import Head from "next/head";
import { useRouter } from "next/router";
import { ensureAbsoluteUrl, getSiteUrl } from "@/utils/seo-utils";

const SITE_NAME = "NEES Medical";
const SITE_URL = getSiteUrl();
const DEFAULT_DESCRIPTION =
  "Clinical skincare and aesthetic solutions in Lahore, Pakistan with transparent product details and same-day delivery on selected items.";
const DEFAULT_IMAGE = `${SITE_URL}/assets/img/logo/brand-logo-favicon.png`;

const normalizeCanonicalPath = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "/";
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  const [pathWithoutHash] = raw.split("#");
  const [pathname, search = ""] = pathWithoutHash.split("?");
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalizedPath = withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/+$/, "") || "/";
  return search ? `${normalizedPath}?${search}` : normalizedPath;
};

const SEO = ({
  pageTitle,
  description = DEFAULT_DESCRIPTION,
  canonical = "",
  image = DEFAULT_IMAGE,
  type = "website",
  keywords = "",
  noIndex = false,
  structuredData,
}) => {
  const router = useRouter();
  const safeTitle = String(pageTitle || SITE_NAME).trim();
  const title = safeTitle.includes(SITE_NAME) ? safeTitle : `${safeTitle} | ${SITE_NAME}`;
  const safeDescription = String(description || DEFAULT_DESCRIPTION).trim();
  const fallbackCanonicalPath = normalizeCanonicalPath(router?.asPath || router?.pathname || "/");
  const canonicalInput = String(canonical || "").trim() || fallbackCanonicalPath;
  const canonicalUrl = ensureAbsoluteUrl(canonicalInput);
  const imageUrl = ensureAbsoluteUrl(image || DEFAULT_IMAGE) || DEFAULT_IMAGE;
  const robots = noIndex ? "noindex, nofollow" : "index, follow";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="description" content={safeDescription} />
        <meta name="robots" content={robots} />
        {keywords ? <meta name="keywords" content={keywords} /> : null}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={safeDescription} />
        <meta property="og:image" content={imageUrl} />
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={safeDescription} />
        <meta name="twitter:image" content={imageUrl} />

        <link rel="icon" href="/assets/img/logo/brand-logo-favicon.png" />
        <link rel="shortcut icon" href="/assets/img/logo/brand-logo-favicon.png" />
        <link rel="apple-touch-icon" href="/assets/img/logo/brand-logo-favicon.png" />

        {structuredData ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        ) : null}
      </Head>
    </>
  );
};

export default SEO;
