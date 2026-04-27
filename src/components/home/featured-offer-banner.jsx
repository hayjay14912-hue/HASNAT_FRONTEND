import Link from "next/link";
import { buildProductPath } from "@/utils/seo-utils";
import { getActiveBogoOffer } from "@/utils/bogo";

const FeaturedOfferBanner = ({ product }) => {
  const offer = getActiveBogoOffer(product);
  if (!product?._id || !offer) {
    return null;
  }

  const ctaPath = buildProductPath(product);
  const bundleSize = Math.max(1, Number(offer.bundleSize || 1));
  const bundlePrice = Number(offer.bundlePrice || 0);

  return (
    <section className="aura-featured-offer pt-30 pb-20">
      <div className="container">
        <Link href={ctaPath} className="aura-featured-offer-card">
          <div className="aura-featured-offer-copy">
            <span className="aura-featured-offer-kicker">NEESMEDICAL.COM</span>
            <div className="aura-featured-offer-bogo">
              <span>{offer.label || "Buy 1 Get 1"}</span>
              <strong>LIVE DEAL</strong>
            </div>
            <h2>{product.title}</h2>
            <p>
              Get <strong>{bundleSize} units for PKR {bundlePrice.toLocaleString("en-PK")}</strong>.{" "}
              Tap to shop this offer with bundle quantity checkout.
            </p>
          </div>
          <div className="aura-featured-offer-cta">
            <span>Shop Product</span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedOfferBanner;
