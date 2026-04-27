import { NextResponse } from "next/server";

const PRIMARY_HOST = "www.neesmedical.com";
const APEX_HOST = "neesmedical.com";
const ALLOWED_HOSTS = new Set([PRIMARY_HOST, APEX_HOST]);
const LEGACY_PATH_REDIRECTS = new Map([
  ["/mesotherapy.html", "/professional"],
  ["/dermaheal.html", "/professional"],
  ["/dermal-fillers.html", "/professional"],
  ["/hugel.html", "/professional"],
  ["/whitening-injections.html", "/professional"],
  ["/be-white.html", "/professional"],
  ["/ultra-v.html", "/professional"],
  ["/visvisal.html", "/visvisal"],
  ["/viviscal.html", "/visvisal"],
  ["/visvisal-product.html", "/visvisal"],
  ["/viviscal-product.html", "/visvisal"],
  ["/contact-us.html", "/contact"],
  ["/contactus.html", "/contact"],
  ["/contact-html", "/contact"],
  ["/contact.html", "/contact"],
  ["/shop-html", "/shop"],
  ["/shop.html", "/shop"],
  ["/blog-html", "/blog"],
  ["/blog.html", "/blog"],
  ["/products-html", "/shop"],
  ["/products.html", "/shop"],
  ["/products", "/shop"],
  ["/index-html", "/"],
  ["/index.html", "/"],
  ["/glutanex.html", "/glutanex-retinol-eye-cream"],
]);

const normalizeLegacyPath = (pathname = "") => {
  const normalized =
    String(pathname || "")
      .toLowerCase()
      .replace(/\/+$/, "") || "/";
  if (!normalized) {
    return "";
  }

  if (LEGACY_PATH_REDIRECTS.has(normalized)) {
    return LEGACY_PATH_REDIRECTS.get(normalized);
  }

  if (normalized.endsWith(".html")) {
    const nextPath = normalized.slice(0, -5) || "/";
    return nextPath === "/index" ? "/" : nextPath;
  }

  if (normalized.endsWith("-html")) {
    const nextPath = normalized.slice(0, -5) || "/";
    return nextPath === "/index" ? "/" : nextPath;
  }

  return "";
};

export function middleware(request) {
  const host = request.headers.get("host") || "";
  const currentPath = request.nextUrl.pathname || "/";
  const legacyPath = normalizeLegacyPath(currentPath);

  if (legacyPath && legacyPath !== currentPath) {
    const legacyUrl = request.nextUrl.clone();
    legacyUrl.pathname = legacyPath;
    return NextResponse.redirect(legacyUrl, 308);
  }

  // Do not rewrite preview deployments or localhost traffic.
  if (!ALLOWED_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const forwardedProto = request.headers.get("x-forwarded-proto") || "";
  const isHttps = forwardedProto ? forwardedProto === "https" : request.nextUrl.protocol === "https:";
  const isApex = host === APEX_HOST;

  if (!isApex && isHttps) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = PRIMARY_HOST;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|api).*)"],
};
