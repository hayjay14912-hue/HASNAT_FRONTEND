import React from "react";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";

const SearchBar = ({ isSearchOpen, setIsSearchOpen }) => {
  const {
    setSearchText,
    handleSubmit,
    searchText,
    suggestions,
    showSuggestions,
    handleSuggestionSelect,
  } = useSearchFormSubmit();

  const categories = ["sunscreen", "retinol", "hair fall", "brightening"];
  const onSubmitSearch = (e) => {
    handleSubmit(e);
    setIsSearchOpen(false);
  };

  const onSuggestionSelect = (product) => {
    handleSuggestionSelect(product);
    setIsSearchOpen(false);
  };
  return (
    <>
      <section
        className={`tp-search-area tp-search-style-brown ${
          isSearchOpen ? "opened" : ""
        }`}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-search-form">
                <div
                  onClick={() => setIsSearchOpen(false)}
                  className="tp-search-close text-center mb-20"
                >
                  <button className="tp-search-close-btn tp-search-close-btn"></button>
                </div>
                <form onSubmit={onSubmitSearch}>
                  <div className="tp-search-input mb-10 aura-overlay-search-autocomplete">
                    <input
                      onChange={(e) => setSearchText(e.target.value)}
                      value={searchText}
                      type="text"
                      placeholder="Search for product..."
                    />
                    <button type="submit">
                      <i className="flaticon-search-1"></i>
                    </button>
                    {showSuggestions && (
                      <div className="aura-search-suggestions" role="listbox" aria-label="Product suggestions">
                        {suggestions.map((product) => (
                          <button
                            key={product?._id || product?.id || product?.slug || product?.title}
                            type="button"
                            className="aura-search-suggestion-item"
                            onClick={() => onSuggestionSelect(product)}
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
                  <div className="tp-search-category">
                    <span>Popular searches : </span>
                    {categories.map((c, i) => (
                      <a
                        key={i}
                        onClick={() => setSearchText(c)}
                        className="cursor-pointer"
                      >
                        {c}
                        {i < categories.length - 1 && ", "}
                      </a>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* body overlay */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className={`body-overlay ${isSearchOpen ? "opened" : ""}`}
      ></div>
    </>
  );
};

export default SearchBar;
