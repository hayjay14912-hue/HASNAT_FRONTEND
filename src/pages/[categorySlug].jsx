import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import MeamoSkinBoostersArchive from "@/components/storefront/meamo-skin-boosters-archive";
import {
  buildCategoryRoute,
  resolveCategoryNameBySlug,
} from "@/utils/meamo-category-routes";

const CategoryRoutePage = ({ categoryName }) => {
  return (
    <Wrapper>
      <SEO
        pageTitle={`${categoryName} | Korean Skin Boosters`}
        description={`Browse ${categoryName} products with category filters, price filters, sorting, and quick product actions.`}
        canonical={buildCategoryRoute(categoryName)}
      />
      <MeamoSkinBoostersArchive initialCategory={categoryName} />
    </Wrapper>
  );
};

export default CategoryRoutePage;

export const getServerSideProps = async ({ params }) => {
  const categorySlug = String(params?.categorySlug || "").trim().toLowerCase();

  if (!categorySlug) {
    return { notFound: true };
  }

  const categoryName =
    resolveCategoryNameBySlug(categorySlug) ||
    categorySlug
      .split("-")
      .filter(Boolean)
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(" ");

  if (!categoryName) {
    return { notFound: true };
  }

  return {
    props: {
      categoryName,
    },
  };
};
