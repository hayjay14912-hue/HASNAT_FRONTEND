import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import MeamoSkinBoostersArchive from "@/components/storefront/meamo-skin-boosters-archive";

const HomePage = () => {
  return (
    <Wrapper>
      <SEO
        pageTitle="Korean Skin Boosters"
        description="Browse Korean skin boosters with category filters, price filters, sorting, product cards, and quick product actions."
        canonical="/"
      />
      <MeamoSkinBoostersArchive
        showFrontHero
        layoutMode="home"
        initialCategory="Korean Skin Boosters"
      />
    </Wrapper>
  );
};

export default HomePage;
