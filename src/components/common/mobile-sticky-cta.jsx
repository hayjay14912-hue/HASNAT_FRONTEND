import Link from "next/link";

const MobileStickyCta = () => {
  return (
    <div className="aura-mobile-sticky-cta" role="region" aria-label="Quick actions">
      <Link href="/shop" className="aura-mobile-sticky-btn is-retail">
        Shop Retail
      </Link>
      <Link href="/medical-devices" className="aura-mobile-sticky-btn is-machines">
        Machines
      </Link>
      <Link href="/professional" className="aura-mobile-sticky-btn is-b2b">
        Clinics
      </Link>
    </div>
  );
};

export default MobileStickyCta;
