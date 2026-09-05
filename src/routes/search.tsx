import { useState, useMemo } from "react";
import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { ProductGrid } from "../components/storefront/ProductGrid";
import { useCatalogue } from "../hooks/useCatalogue";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = useSearch({ from: "/search" });
  const [searchInput, setSearchInput] = useState(q || "");
  const { products } = useCatalogue();

  const query = (q || searchInput).trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!query) return [];
    return products.filter((p) => {
      return (
        p.title.toLowerCase().includes(query) ||
        p.subtitle?.toLowerCase().includes(query) ||
        p.category_slug?.toLowerCase().includes(query) ||
        p.subcategory_slug?.toLowerCase().includes(query) ||
        p.colour?.toLowerCase().includes(query) ||
        p.fabric?.toLowerCase().includes(query)
      );
    });
  }, [products, query]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-2">
            CATALOGUE INQUIRY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1c1a17] mb-6">
            Search The Wardrobe
          </h1>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by garment, fabric, fit, or colour..."
              className="flex-1 bg-white border border-[#ded7ca] px-4 py-3 text-xs font-sans text-[#1f1d1a] placeholder-[#9e9483] focus:outline-none focus:border-black rounded-[1px]"
            />
          </div>
        </div>

        {query ? (
          <div>
            <div className="pb-4 border-b border-[#ece6da] mb-8 flex justify-between items-baseline">
              <h2 className="font-serif text-xl font-light text-[#1c1a17]">
                Results for "{query}"
              </h2>
              <span className="text-xs font-mono text-[#8a7f70]">
                {matchingProducts.length} items found
              </span>
            </div>

            <ProductGrid
              products={matchingProducts}
              emptyMessage={`No garments found matching "${query}". Try searching for broader terms like "linen", "shirt", or "blazer".`}
            />
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-sans text-[#786e5f]">
            Enter a search term above to explore products across all studio collections.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
