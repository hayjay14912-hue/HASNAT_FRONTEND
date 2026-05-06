import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import SkinaeInspiredStorefront from "@/components/storefront/skinae-inspired-storefront";

const ShopPage = ({ initialProducts = [] }) => {
  return (
    <Wrapper>
      <SEO
        pageTitle="Shop All Products"
        description="Browse the complete HASNAT product listing with category filters, search, and quick cart actions."
        canonical="/shop"
      />
      <SkinaeInspiredStorefront mode="shop" initialProducts={initialProducts} />
    </Wrapper>
  );
};

export default ShopPage;

export async function getServerSideProps() {
  const defaultApiBaseUrl = "https://hasnat-backend.vercel.app";
  const envApiBaseUrl = String(process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();
  const isLoopbackApi = /localhost|127\.0\.0\.1/i.test(envApiBaseUrl);
  const isLocalRuntime = process.env.NODE_ENV !== "production";

  const baseUrl =
    envApiBaseUrl && (isLocalRuntime || !isLoopbackApi)
      ? envApiBaseUrl
      : defaultApiBaseUrl;
  let initialProducts = [];

  try {
    const res = await fetch(`${baseUrl}/api/product/all`);
    if (res.ok) {
      const payload = await res.json();
      initialProducts = Array.isArray(payload?.data) ? payload.data : [];
    }
  } catch (error) {
    initialProducts = [];
  }

  return {
    props: {
      initialProducts,
    },
  };
}
