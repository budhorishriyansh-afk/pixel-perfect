import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCatalogue, Product } from "../../hooks/useCatalogue";
import { PremiumProductPlaceholder } from "../placeholders/PremiumProductPlaceholder";
import { formatPrice } from "../../lib/format";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Linen Shirt",
  "Merino Wool",
  "Tailored Blazer",
  "Leather Loafer",
  "Silk Dress",
  "Pima Cotton",
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const { products } = useCatalogue();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredProducts = trimmed
    ? products.filter((p) => {
        return (
          p.title.toLowerCase().includes(trimmed) ||
          p.subtitle?.toLowerCase().includes(trimmed) ||
          p.category_slug?.toLowerCase().includes(trimmed) ||
          p.subcategory_slug?.toLowerCase().includes(trimmed) ||
          p.colour?.toLowerCase().includes(trimmed) ||
          p.fabric?.toLowerCase().includes(trimmed) ||
          p.slug.toLowerCase().includes(trimmed)
        );
      })
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed) {
      onClose();
      navigate({ to: `/search?q=${encodeURIComponent(trimmed)}` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fcfbf8] animate-in fade-in duration-200">
      {/* Top Search Bar */}
      <div className="border-b border-[#e5dfd2] bg-[#fbf9f5] px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <svg
            className="w-5 h-5 text-[#776c5b] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by garment, fabric (linen, silk), fit, or colour..."
              className="w-full bg-transparent font-serif text-xl sm:text-2xl md:text-3xl text-[#1f1d1a] placeholder-[#9e9483] focus:outline-none tracking-wide"
            />
          </form>

          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs uppercase tracking-wider text-[#8b806f] hover:text-[#111] px-2 py-1"
            >
              Clear
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 text-[#5a5142] hover:text-[#111] transition-colors rounded-sm focus:outline-none"
            aria-label="Close search"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results or Popular searches body */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {query.trim() === "" ? (
            /* Pre-search hints & Popular categories */
            <div className="space-y-8">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#887e6e] font-sans font-medium block mb-4">
                  POPULAR SEARCHES
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 border border-[#ded8cb] bg-[#f8f5ee] hover:bg-[#efebe1] text-xs font-sans tracking-wider text-[#3c362d] transition-colors rounded-[1px]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#ede8dd]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#887e6e] font-sans font-medium block mb-4">
                  BROWSE MAIN COLLECTIONS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Men's New Arrivals", to: "/category/men" },
                    { label: "Women's Silhouettes", to: "/category/women" },
                    { label: "Leather Footwear", to: "/category/footwear" },
                    { label: "Seasonal Sale", to: "/collections/sale" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={onClose}
                      className="p-4 border border-[#e8e2d5] bg-white/70 hover:border-[#1e1c19] text-xs font-sans tracking-wide text-[#2e2a24] transition-all"
                    >
                      {item.label} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            /* Matching products grid */
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#ece6d9]">
                <span className="text-xs tracking-wider text-[#6e6353] font-sans">
                  Found {filteredProducts.length} results for "{query}"
                </span>
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-medium tracking-wider text-[#1e1c19] underline hover:no-underline"
                >
                  View full results page →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="w-full aspect-[3/4] overflow-hidden bg-[#f4f2ee] border border-[#e6e1d5] mb-2.5 relative">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <PremiumProductPlaceholder
                          title={product.title}
                          subtitle={product.colour || undefined}
                          aspectRatio="portrait"
                          showComingSoon={false}
                        />
                      )}
                    </div>
                    <h4 className="font-serif text-sm font-normal text-[#22201d] group-hover:underline line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-[11px] font-sans text-[#736959] uppercase tracking-wider mb-1">
                      {product.fabric}
                    </p>
                    <span className="text-xs font-sans font-medium text-[#1e1c19]">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* No Results Empty State */
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#d8d1c2] flex items-center justify-center text-[#8e8473]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-light text-[#22201d] mb-2">
                No products found
              </h3>
              <p className="text-xs text-[#736857] leading-relaxed mb-6 font-light">
                We couldn't find any items matching "{query}". Try searching for broader terms such
                as "shirt", "linen", "blazer", or "loafer".
              </p>
              <button
                onClick={() => setQuery("")}
                className="px-6 py-2.5 border border-[#24211d] bg-[#24211d] text-[#f7f5f0] text-xs font-sans tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
