import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useLazyGetAllProductsQuery } from "@/redux/features/productApi";
import { isActiveProduct, isRetailProduct } from "@/utils/product-access";
import { buildProductPath } from "@/utils/seo-utils";
import { getProductSearchSuggestions } from "@/utils/search";

const useSearchFormSubmit = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [loadProducts, { data: productsPayload }] = useLazyGetAllProductsQuery();
  const searchTerm = String(searchText || "").trim();
  const allProducts = Array.isArray(productsPayload?.data) ? productsPayload.data : [];
  const retailProducts = useMemo(
    () => allProducts.filter((product) => isActiveProduct(product) && isRetailProduct(product)),
    [allProducts]
  );
  const suggestions = useMemo(
    () => getProductSearchSuggestions(retailProducts, searchTerm, 6),
    [retailProducts, searchTerm]
  );
  const showSuggestions = searchTerm.length >= 2 && suggestions.length > 0;

  useEffect(() => {
    if (searchTerm.length < 2) return;
    if (allProducts.length > 0) return;
    loadProducts(undefined, true);
  }, [searchTerm, allProducts.length, loadProducts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedText = String(searchText || "").trim();
    const normalizedCategory =
      category && category !== "Select Category" ? String(category).trim() : "";

    if (normalizedText) {
      const searchQuery = normalizedCategory
        ? `${normalizedText} ${normalizedCategory}`.trim()
        : normalizedText;
      const route = `/search?searchText=${encodeURIComponent(searchQuery)}`;

      router.push(route, null, { scroll: false });
      setSearchText("");
      setCategory("");
    } else {
      router.push(`/`, null, { scroll: false });
      setSearchText("");
      setCategory("");
    }
  };

  const handleSuggestionSelect = (product) => {
    if (!product) return;
    router.push(buildProductPath(product), null, { scroll: false });
    setSearchText("");
  };

  return {
    searchText,
    category,
    suggestions,
    showSuggestions,
    setSearchText,
    setCategory,
    handleSuggestionSelect,
    handleSubmit,
  };
};

export default useSearchFormSubmit;
