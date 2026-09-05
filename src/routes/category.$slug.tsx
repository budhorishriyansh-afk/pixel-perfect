import { useState, useMemo } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { ProductGrid } from "../components/storefront/ProductGrid";
import { useCatalogue } from "../hooks/useCatalogue";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/category/$slug" });
  const { products } = useCatalogue();

  // Search params or local filter state
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Category title display
  const categoryTitle =
    slug === "men"
      ? "Men's Wardrobe"
      : slug === "women"
      ? "Women's Silhouettes"
      : slug === "kids"
      ? "Kids & Youth"
      : slug === "footwear"
      ? "Handcrafted Footwear"
      : slug === "accessories"
      ? "Leather & Accessories"
      : slug.toUpperCase();

  // Base products for this category
  const baseCategoryProducts = useMemo(() => {
    return products.filter((p) => p.category_slug?.toLowerCase() === slug.toLowerCase());
  }, [products, slug]);

  // Derive available filter options from current category
  const availableSubcats = useMemo(() => {
    const set = new Set<string>();
    baseCategoryProducts.forEach((p) => {
      if (p.subcategory_slug) set.add(p.subcategory_slug);
    });
    return Array.from(set);
  }, [baseCategoryProducts]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    baseCategoryProducts.forEach((p) => {
      p.variants.forEach((v) => set.add(v.size));
    });
    return Array.from(set);
  }, [baseCategoryProducts]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    baseCategoryProducts.forEach((p) => {
      if (p.colour) set.add(p.colour);
    });
    return Array.from(set);
  }, [baseCategoryProducts]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...baseCategoryProducts];

    if (selectedSubcat) {
      list = list.filter((p) => p.subcategory_slug === selectedSubcat);
    }
    if (selectedSize) {
      list = list.filter((p) => p.variants.some((v) => v.size === selectedSize && v.stock > 0));
    }
    if (selectedColor) {
      list = list.filter((p) => p.colour?.toLowerCase() === selectedColor.toLowerCase());
    }
    if (selectedPriceRange) {
      if (selectedPriceRange === "under-5000") list = list.filter((p) => p.price < 5000);
      else if (selectedPriceRange === "5000-10000")
        list = list.filter((p) => p.price >= 5000 && p.price <= 10000);
      else if (selectedPriceRange === "above-10000") list = list.filter((p) => p.price > 10000);
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "discount") {
      list.sort((a, b) => {
        const discA = a.compare_at_price ? (a.compare_at_price - a.price) / a.compare_at_price : 0;
        const discB = b.compare_at_price ? (b.compare_at_price - b.price) / b.compare_at_price : 0;
        return discB - discA;
      });
    }

    return list;
  }, [baseCategoryProducts, selectedSubcat, selectedSize, selectedColor, selectedPriceRange, sortBy]);

  const activeFiltersCount =
    (selectedSubcat ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedPriceRange ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedSubcat(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedPriceRange(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-sans text-[#827867] uppercase tracking-wider mb-6">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#201e1a] font-medium">{slug}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="pb-8 border-b border-[#eae4d8] mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-2">
            COLLECTION DIRECTORY
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#1c1a17]">
              {categoryTitle}
            </h1>
            <span className="text-xs font-mono text-[#8a7f70]">
              Showing {filteredProducts.length} pieces
            </span>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#ece6d9]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f4f1ea] border border-[#d8d2c4] text-xs font-sans tracking-wider uppercase font-medium hover:bg-[#ede8dc] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-sans text-[#a32828] underline underline-offset-4 hover:no-underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-sans uppercase tracking-wider text-[#7a7161]">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#fcfbf9] border border-[#d8d2c4] px-3 py-2 text-xs font-sans text-[#2a2620] focus:outline-none focus:border-black rounded-[1px]"
            >
              <option value="featured">Studio Featured</option>
              <option value="newest">Newest Additions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Filter Drawer / Bar */}
        {isMobileFilterOpen && (
          <div className="p-6 bg-[#f7f5ee] border border-[#e2dcd0] mb-8 rounded-[1px] animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs font-sans">
              {/* Subcategories */}
              {availableSubcats.length > 0 && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#353029] mb-3 text-[11px]">
                    Garment Type
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {availableSubcats.map((sub) => {
                      const cleanLabel = sub.replace(`${slug}-`, "").replace(/-/g, " ");
                      return (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubcat(selectedSubcat === sub ? null : sub)}
                          className={`block w-full text-left py-1 capitalize transition-colors ${
                            selectedSubcat === sub ? "font-semibold text-black underline" : "text-[#635b4e] hover:text-black"
                          }`}
                        >
                          {cleanLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#353029] mb-3 text-[11px]">
                    Size
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                        className={`px-2.5 py-1 border text-xs rounded-[1px] ${
                          selectedSize === sz
                            ? "bg-[#1f1d1a] text-[#f7f5f0] border-[#1f1d1a]"
                            : "bg-white text-[#332e27] border-[#d8d2c4] hover:border-black"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {availableColors.length > 0 && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#353029] mb-3 text-[11px]">
                    Colour Palette
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {availableColors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(selectedColor === col ? null : col)}
                        className={`block w-full text-left py-1 transition-colors ${
                          selectedColor === col ? "font-semibold text-black underline" : "text-[#635b4e] hover:text-black"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Bracket */}
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-[#353029] mb-3 text-[11px]">
                  Price
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === "under-5000" ? null : "under-5000"
                      )
                    }
                    className={`block w-full text-left py-1 ${
                      selectedPriceRange === "under-5000"
                        ? "font-semibold text-black underline"
                        : "text-[#635b4e]"
                    }`}
                  >
                    Under ₹5,000
                  </button>
                  <button
                    onClick={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === "5000-10000" ? null : "5000-10000"
                      )
                    }
                    className={`block w-full text-left py-1 ${
                      selectedPriceRange === "5000-10000"
                        ? "font-semibold text-black underline"
                        : "text-[#635b4e]"
                    }`}
                  >
                    ₹5,000 - ₹10,000
                  </button>
                  <button
                    onClick={() =>
                      setSelectedPriceRange(
                        selectedPriceRange === "above-10000" ? null : "above-10000"
                      )
                    }
                    className={`block w-full text-left py-1 ${
                      selectedPriceRange === "above-10000"
                        ? "font-semibold text-black underline"
                        : "text-[#635b4e]"
                    }`}
                  >
                    Above ₹10,000
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          emptyMessage={`No garments found in ${categoryTitle} matching the active filters.`}
        />
      </main>

      <Footer />
    </div>
  );
}
