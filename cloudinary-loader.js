const CLOUDINARY_HOST = "res.cloudinary.com";

const isCloudinaryUrl = (value) => {
  try {
    const url = new URL(value);
    return url.hostname === CLOUDINARY_HOST && url.pathname.includes("/image/upload/");
  } catch {
    return false;
  }
};

const normalizeSrc = (src) => String(src || "").trim();

const buildNextImageFallbackUrl = ({ src, width, quality }) => {
  const q = quality || 75;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
};

const splitCloudinaryPath = (pathname) => {
  const marker = "/image/upload/";
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }

  const prefix = pathname.slice(0, markerIndex + marker.length);
  const tail = pathname.slice(markerIndex + marker.length);
  return { prefix, tail };
};

const extractExistingTransformation = (tail) => {
  const [first = "", ...rest] = tail.split("/");

  // Version segment starts with v123456 and should not be treated as a transform segment.
  if (/^v\d+/.test(first) || first.length === 0) {
    return {
      existingTransform: "",
      remainder: tail,
    };
  }

  return {
    existingTransform: first,
    remainder: rest.join("/"),
  };
};

export default function cloudinaryLoader({ src, width, quality }) {
  const normalizedSrc = normalizeSrc(src);
  if (!normalizedSrc) {
    return "";
  }

  // Keep local, data/blob, and non-Cloudinary sources untouched.
  // With a global custom loader, forcing /_next/image URLs can break some local assets.
  if (
    normalizedSrc.startsWith("/") ||
    normalizedSrc.startsWith("data:") ||
    normalizedSrc.startsWith("blob:")
  ) {
    return normalizedSrc;
  }

  if (!isCloudinaryUrl(normalizedSrc)) {
    return buildNextImageFallbackUrl({
      src: normalizedSrc,
      width,
      quality,
    });
  }

  const url = new URL(normalizedSrc);
  const parts = splitCloudinaryPath(url.pathname);
  if (!parts) {
    return normalizedSrc;
  }

  const { existingTransform, remainder } = extractExistingTransformation(parts.tail);
  const baseTransform = [
    "f_auto",
    quality ? `q_${quality}` : "q_auto",
    `w_${width}`,
  ].join(",");

  // If the source already has a transform chain, keep it and prepend auto format/quality/width.
  const transformChain = existingTransform
    ? `${baseTransform}/${existingTransform}`
    : baseTransform;

  url.pathname = `${parts.prefix}${transformChain}/${remainder}`;
  return url.toString();
}
