import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import { useGetActiveBrandsQuery } from "@/redux/features/brandApi";
import { useGetAllProductsQuery } from "@/redux/features/productApi";

const getProductsFromPayload = (payload) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  return [];
};

const getBrandsFromPayload = (payload) =>
  payload?.result || payload?.brands || payload?.data || [];

const SkincareGateway = ({ initialBrands = null, initialProducts = null }) => {
  const { data: brandData } = useGetActiveBrandsQuery(undefined, {
    skip: Boolean(initialBrands),
  });
  const effectiveBrandData = brandData ?? initialBrands;
  const apiBrandPayload = getBrandsFromPayload(effectiveBrandData);

  const apiBrands = useMemo(
    () =>
      (Array.isArray(apiBrandPayload) ? apiBrandPayload : [])
        .map((brand) => ({
          _id: brand?._id || brand?.id || brand?.name || brand?.title,
          name: brand?.name || brand?.title || brand?.brandName,
          logo: brand?.logo || brand?.img || brand?.image || brand?.brandLogo || "",
        }))
        .filter((brand) => brand?.name),
    [apiBrandPayload]
  );

  const shouldUseProductFallback = apiBrands.length === 0;
  const { data: productDataRes } = useGetAllProductsQuery(undefined, {
    skip: !shouldUseProductFallback || Boolean(initialProducts),
  });
  const productData = productDataRes ?? initialProducts;

  const productBrands = useMemo(() => {
    if (!shouldUseProductFallback) return [];
    const entries = new Map();
    getProductsFromPayload(productData).forEach((product) => {
      const brandName = product?.brand?.name || product?.brandName;
      if (!brandName) return;
      const key = brandName.toLowerCase();
      if (!entries.has(key)) {
        entries.set(key, {
          _id: key,
          name: brandName,
          logo: product?.brand?.logo || "",
        });
      }
    });
    return Array.from(entries.values());
  }, [productData, shouldUseProductFallback]);

  const defaultBrands = useMemo(
    () => [
      { _id: "nexus-pharma", name: "NEXUS PHARMA", logo: "" },
      { _id: "glutanex", name: "GLUTANEX", logo: "" },
      { _id: "nees-medical", name: "NEES MEDICAL", logo: "" },
    ],
    []
  );

  const brands =
    apiBrands.length > 0
      ? apiBrands
      : productBrands.length > 0
        ? productBrands
        : defaultBrands;
  const marqueeBrands = brands.length > 0 ? [...brands, ...brands] : [];

  return (
    <section className="aura-gateway-area pt-95 pb-95">
      <div className="container">
        <div className="aura-gateway-head text-center mb-50">
          <span>Hybrid Platform</span>
          <h2>Choose Your Journey with Clarity</h2>
          <p>
            NEES Medical supports both direct skincare purchases and professional clinical
            procurement through dedicated, purpose-built journeys.
          </p>
        </div>
        <div className="row g-4">
          <div className="col-lg-6">
            <article className="aura-gateway-card is-retail">
              <div className="aura-gateway-chip">B2C</div>
              <h3>Shop Skincare and Medical Consumables</h3>
              <p>
                Browse retail-ready products with secure checkout, direct delivery,
                and promotion-friendly shopping built for end customers.
              </p>
              <ul>
                <li>Concern-led discovery and category browsing</li>
                <li>Normal cart, wishlist, and checkout flow</li>
                <li>Real-time pricing and promo visibility</li>
              </ul>
              <div className="aura-gateway-actions">
                <Link href="/shop" className="tp-btn">Shop Products</Link>
                <Link href="/shop?status=on-sale" className="tp-btn tp-btn-border">View Promotions</Link>
                <Link href="/glutanex-retinol-eye-cream" className="tp-btn tp-btn-border">Glutanex Eye Cream</Link>
              </div>
            </article>
          </div>
          <div className="col-lg-6">
            <article className="aura-gateway-card is-clinic">
              <div className="aura-gateway-chip">B2B</div>
              <h3>Professional Products and Device Evaluation</h3>
              <p>
                Access professional products publicly, contact sales directly, and evaluate
                medical devices through specialist-led consultation workflows.
              </p>
              <ul>
                <li>Professional Use Only catalog labeling</li>
                <li>Inquiry-first CTA flow with no online checkout</li>
                <li>Request proposal, demo, and sales contact options</li>
              </ul>
              <div className="aura-gateway-actions">
                <Link href="/professional" className="tp-btn">Explore Professional</Link>
                <Link href="/medical-devices" className="tp-btn tp-btn-border">View Medical Devices</Link>
              </div>
            </article>
          </div>
        </div>
        <div className="aura-brand-marquee-wrap mt-40" aria-label="Brand partners">
          <div className="aura-brand-heading text-center">
            <span className="aura-brand-kicker">Distributed Brands</span>
            <h3>We Are The Distributor Of These Brands</h3>
            <p>
              Discover globally trusted skincare and clinical aesthetics partners distributed by
              NEES Medical.
            </p>
          </div>
          <div className="aura-brand-marquee">
            <div className="aura-brand-track">
              {marqueeBrands.map((brand, index) => (
                <article
                  key={`${brand._id || brand.name}-${index}`}
                  className="aura-brand-pill"
                  aria-label={brand.name}
                >
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      width={180}
                      height={72}
                      loading="lazy"
                      sizes="(max-width: 768px) 140px, 180px"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span className="aura-brand-fallback">{brand.name}</span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkincareGateway;
