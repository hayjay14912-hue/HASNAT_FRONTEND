import Link from "next/link";
import { useSelector } from "react-redux";

const MobileStickyCta = () => {
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  return (
    <div className="aura-mobile-sticky-cta" role="region" aria-label="Quick actions">
      <Link href="/shop" className="aura-mobile-sticky-btn is-retail">
        Shop All
      </Link>
      <Link href="/wishlist" className="aura-mobile-sticky-btn is-machines">
        Wishlist ({wishlist?.length || 0})
      </Link>
      <Link href="/cart" className="aura-mobile-sticky-btn is-b2b">
        Cart ({cart_products?.length || 0})
      </Link>
    </div>
  );
};

export default MobileStickyCta;
