import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import SkinaeInspiredStorefront from "@/components/storefront/skinae-inspired-storefront";

const HomePage = ({ initialProducts = [] }) => {
  return (
    <Wrapper>
      <SEO
        pageTitle="Professional Skin Aesthetics and Beauty Products"
        description="Shop full skincare and beauty catalog in one storefront experience with direct cart and checkout."
        canonical="/"
      />
      <SkinaeInspiredStorefront mode="home" initialProducts={initialProducts} />
    </Wrapper>
  );
};

export default HomePage;

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hasnat-backend-iota.vercel.app";
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
