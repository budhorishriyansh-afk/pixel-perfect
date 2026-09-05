import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Product } from "../../hooks/useCatalogue";
import { PremiumProductPlaceholder } from "../placeholders/PremiumProductPlaceholder";
import { formatPrice, discountPercent } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const inStockVariant = product.variants.find((v) => v.stock > 0);
    return inStockVariant ? inStockVariant.size : product.variants[0]?.size || "M";
  });
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addItem, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount = discountPercent(product.price, product.compare_at_price);
  const isWishlisted = isInWishlist(product.id);

  const currentVariant = product.variants.find((v) => v.size === selectedSize);
  const isOutOfStock = currentVariant ? currentVariant.stock <= 0 : false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      color: product.colour || "Standard",
      size: selectedSize,
      quantity,
      imageUrl: product.images[0]?.url || null,
    });
    onClose();
    openCartDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#fdfcf9] border border-[#e2dcd0] shadow-2xl rounded-[2px] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#5a5142] hover:text-black bg-[#fbf9f5]/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Left: Gallery */}
          <div className="p-6 md:p-8 bg-[#f7f5ef] border-b md:border-b-0 md:border-r border-[#e8e2d5] flex flex-col justify-center items-center">
            <div className="w-full aspect-[3/4] max-w-sm mx-auto overflow-hidden bg-[#eeeae2] border border-[#dfd9cb] relative">
              {product.images.length > 0 ? (
                <img
                  src={product.images[activeImageIndex]?.url || product.images[0]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PremiumProductPlaceholder
                  title={product.title}
                  subtitle={product.colour || undefined}
                  aspectRatio="portrait"
                />
              )}
            </div>

            {/* Thumbnail dots if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-12 h-14 border ${
                      activeImageIndex === i ? "border-[#1b1916]" : "border-[#dfd9cb]"
                    } overflow-hidden`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Badges */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] tracking-[0.25em] text-[#857b6d] uppercase font-sans">
                  {product.category_slug} · {product.fabric}
                </span>
                {discount && (
                  <span className="text-[10px] font-sans font-semibold tracking-wider text-[#a32828] bg-[#f8e8e8] px-1.5 py-0.5 rounded-[1px]">
                    {discount}% OFF
                  </span>
                )}
                {product.is_new && (
                  <span className="text-[10px] font-sans tracking-wider text-[#34312c] bg-[#ece7dc] px-1.5 py-0.5 rounded-[1px]">
                    NEW
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#1e1c19] tracking-tight mb-2">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-sans text-xl font-medium text-[#1e1c19]">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="font-sans text-sm text-[#8c8273] line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-xs text-[#5c5344] font-light leading-relaxed mb-6 line-clamp-3">
                {product.description}
              </p>

              {/* Colour */}
              {product.colour && (
                <div className="mb-5">
                  <span className="block text-[11px] font-sans uppercase tracking-[0.18em] text-[#6d6353] mb-1.5">
                    Colour: <span className="font-medium text-[#1f1d1a]">{product.colour}</span>
                  </span>
                </div>
              )}

              {/* Size Selector */}
              {product.variants.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#6d6353]">
                      Select Size
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const disabled = v.stock <= 0;
                      const isSelected = selectedSize === v.size;
                      return (
                        <button
                          key={v.id}
                          disabled={disabled}
                          onClick={() => setSelectedSize(v.size)}
                          className={`min-w-[44px] h-10 px-3 text-xs font-sans tracking-wider border rounded-[1px] transition-all ${
                            disabled
                              ? "opacity-35 bg-[#ede8dc] cursor-not-allowed line-through text-[#8b8273] border-[#ded8cb]"
                              : isSelected
                              ? "bg-[#1f1d1a] text-[#f7f5f0] border-[#1f1d1a]"
                              : "bg-white text-[#2a2621] border-[#ded8cc] hover:border-[#1f1d1a]"
                          }`}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                  </div>
                  {isOutOfStock && (
                    <span className="text-[11px] text-[#a32828] font-sans mt-2 block">
                      Currently sold out in selected size.
                    </span>
                  )}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#6d6353]">
                  Quantity
                </span>
                <div className="flex items-center border border-[#d8d1c2] rounded-[1px] bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-[#554d41] hover:text-black disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-medium text-[#1f1d1a]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#554d41] hover:text-black"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons: Add to Bag, Wishlist, Full Details Link */}
            <div className="space-y-3 pt-4 border-t border-[#ede7db]">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 bg-[#1f1d1a] hover:bg-black text-[#f7f5f0] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] transition-all disabled:opacity-40 shadow-sm"
                >
                  {isOutOfStock ? "SOLD OUT" : "ADD TO BAG"}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 flex items-center justify-center border rounded-[1px] transition-colors ${
                    isWishlisted
                      ? "border-[#a32828] text-[#a32828] bg-[#fbf0f0]"
                      : "border-[#d8d1c2] text-[#4d4538] hover:border-black"
                  }`}
                  aria-label="Wishlist"
                >
                  <svg
                    className="w-5 h-5"
                    fill={isWishlisted ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-sans uppercase tracking-[0.2em] text-[#1e1c19] underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  VIEW FULL DETAILS & SPECIFICATIONS →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
