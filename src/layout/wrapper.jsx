import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
// internal
import {
  get_cart_products,
  initialOrderQuantity,
} from "@/redux/features/cartSlice";
import { get_wishlist_products } from "@/redux/features/wishlist-slice";
import { get_compare_products } from "@/redux/features/compareSlice";
import useAuthCheck from "@/hooks/use-auth-check";

const BackToTopCom = dynamic(() => import("@/components/common/back-to-top"), {
  ssr: false,
});
const WhatsAppFloat = dynamic(() => import("@/components/common/whatsapp-float"), {
  ssr: false,
});
const ProductModal = dynamic(() => import("@/components/common/product-modal"), {
  ssr: false,
});
const MobileStickyCta = dynamic(
  () => import("@/components/common/mobile-sticky-cta"),
  { ssr: false }
);

const Wrapper = ({ children }) => {
  const { productItem } = useSelector((state) => state.productModal);
  const dispatch = useDispatch();
  const authChecked = useAuthCheck();
  const router = useRouter();

  useEffect(() => {
    dispatch(get_cart_products());
    dispatch(get_wishlist_products());
    dispatch(get_compare_products());
    dispatch(initialOrderQuantity());
  }, [dispatch]);

  const showMobileStickyCta = [
    "/",
    "/shop",
    "/professional",
    "/medical-devices",
    "/request-pricing",
    "/request-quote",
    "/product/[slug]",
    "/product-details/[id]",
  ].includes(router.pathname);
  const showWhatsAppFloat = router.pathname !== "/checkout";

  return (
    <div id="wrapper" data-auth-ready={authChecked ? "true" : "false"}>
      {children}
      {showMobileStickyCta && <MobileStickyCta />}
      {showWhatsAppFloat && <WhatsAppFloat />}
      <BackToTopCom />
      <ToastContainer />
      {/* product modal start */}
      {productItem && <ProductModal />}
      {/* product modal end */}
    </div>
  );
};

export default Wrapper;
