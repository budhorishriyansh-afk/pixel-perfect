import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Product } from "../../hooks/useCatalogue";
import { PremiumProductPlaceholder } from "../placeholders/PremiumProductPlaceholder";
import { formatPrice, discountPercent } from "../../lib/format";
import { useWishlist } from "../../context/WishlistContext";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount = discountPercent(product.price, product.compare_at_price);
  const isWishlisted = isInWishlist(product.id);

  // Determine which image to show
  const primaryImage = product.images[0]?.url;
  const secondaryImage = product.images[1]?.url || primaryImage;
  const displayImage = isHovered && secondaryImage ? secondaryImage : primaryImage;

  return (
    <>
      <div
        className={`group relative flex flex-col ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Visual Image / Placeholder Box */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#f4f1ea] border border-[#e4decfa0] transition-shadow duration-300 group-hover:shadow-md">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <PremiumProductPlaceholder
                title={product.title}
                subtitle={product.colour || undefined}
                aspectRatio="portrait"
              />
            )}
          </Link>

          {/* Badges (Sale % / New) */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
            {discount && (
              <span className="inline-block text-[10px] font-sans font-medium tracking-wider text-[#a32828] bg-[#fbf0f0]/95 border border-[#e8c8c8] px-2 py-0.5 rounded-[1px] shadow-sm">
                {discount}% OFF
              </span>
            )}
            {product.is_new && !discount && (
              <span className="inline-block text-[10px] font-sans font-medium tracking-wider text-[#2d2924] bg-[#fbf9f5]/95 border border-[#ded7ca] px-2 py-0.5 rounded-[1px] shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist Floating Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-[#fdfcf9]/90 backdrop-blur-sm border border-[#dfd9cc] flex items-center justify-center text-[#4a4235] hover:text-[#a32828] transition-all hover:scale-110 shadow-sm"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className="w-4 h-4 transition-colors"
              fill={isWishlisted ? "#a32828" : "none"}
              viewBox="0 0 24 24"
              stroke={isWishlisted ? "#a32828" : "currentColor"}
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Quick View Hover Bar */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="w-full py-2.5 bg-[#1f1d1a]/95 text-[#f7f5f0] hover:bg-black text-[10px] font-sans uppercase tracking-[0.22em] font-medium rounded-[1px] shadow-md transition-all"
            >
              QUICK VIEW
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="pt-3 pb-1 flex flex-col flex-1">
          {/* Subtitle / Fabric / Category */}
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#827766] mb-1 line-clamp-1">
            {product.fabric || product.colour || product.category_slug}
          </span>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-serif text-sm sm:text-base font-normal text-[#1e1c19] hover:underline leading-snug line-clamp-1 mb-1.5"
          >
            {product.title}
          </Link>

          {/* Price & Discount */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="font-sans text-xs sm:text-sm font-medium text-[#1e1c19]">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="font-sans text-xs text-[#8c8273] line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Variants / Sizes indicator */}
          {product.variants.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-[#857b6d] font-sans">
              <span>{product.variants.length} sizes</span>
              <span>·</span>
              <span>{product.colour || "Standard"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
