// internal
import { Search } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";

const HeaderSearchForm = () => {
  const {
    setSearchText,
    setCategory,
    handleSubmit,
    searchText,
    suggestions,
    showSuggestions,
    handleSuggestionSelect,
  } = useSearchFormSubmit();

  // selectHandle
  const selectCategoryHandle = (e) => {
    setCategory(e.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-header-search-wrapper d-flex align-items-center aura-header-search-autocomplete">
        <div className="tp-header-search-box">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
            placeholder="Search by product, concern, or ingredient"
          />
        </div>
        <div className="tp-header-search-category">
          <NiceSelect
            options={[
              { value: "Select Category", text: "Select Category" },
              { value: "skincare", text: "Skincare" },
              { value: "haircare", text: "Haircare" },
              { value: "sunscreen", text: "Sunscreen" },
              { value: "retinol", text: "Retinol" },
            ]}
            defaultCurrent={0}
            onChange={selectCategoryHandle}
            name="Select Category"
          />
        </div>
        <div className="tp-header-search-btn">
          <button type="submit">
            <Search />
          </button>
        </div>
        {showSuggestions && (
          <div className="aura-search-suggestions" role="listbox" aria-label="Product suggestions">
            {suggestions.map((product) => (
              <button
                key={product?._id || product?.id || product?.slug || product?.title}
                type="button"
                className="aura-search-suggestion-item"
                onClick={() => handleSuggestionSelect(product)}
              >
                <span className="aura-search-suggestion-title">
                  {product?.title || product?.name}
                </span>
                <span className="aura-search-suggestion-meta">
                  {product?.category?.name || product?.parent || "Product"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default HeaderSearchForm;
