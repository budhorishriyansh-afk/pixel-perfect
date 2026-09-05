import { useState } from "react";
import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { ProductCard } from "../components/storefront/ProductCard";
import { PremiumProductPlaceholder } from "../components/placeholders/PremiumProductPlaceholder";
import { SizeGuideModal } from "../components/storefront/SizeGuideModal";
import { useCatalogue } from "../hooks/useCatalogue";
import { formatPrice, discountPercent } from "../lib/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = useParams({ from: "/product/$slug" });
  const { products } = useCatalogue();
  const navigate = useNavigate();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const inStock = product?.variants.find((v) => v.stock > 0);
    return inStock ? inStock.size : product?.variants[0]?.size || "M";
  });
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");

  const { addItem, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcfbf8]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <h2 className="font-serif text-3xl font-light mb-2">Product Not Found</h2>
          <p className="text-xs text-[#756c5e] mb-6">This garment is no longer in the active catalogue.</p>
          <Link to="/" className="px-6 py-3 bg-[#1e1c19] text-white text-xs uppercase tracking-wider">
            Return to Studio
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = discountPercent(product.price, product.compare_at_price);
  const isWishlisted = isInWishlist(product.id);
  const currentVariant = product.variants.find((v) => v.size === selectedSize);
  const isOutOfStock = currentVariant ? currentVariant.stock <= 0 : false;
  const isLowStock = currentVariant ? currentVariant.stock > 0 && currentVariant.stock <= 4 : false;

  // Recommendations: products from same category or complementary
  const recommendations = products
    .filter((p) => p.id !== product.id && p.category_slug === product.category_slug)
    .slice(0, 4);

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
    toast.success(`Added ${product.title} (Size ${selectedSize}) to your bag.`);
  };

  const handleBuyNow = () => {
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
    navigate({ to: "/checkout" });
  };

  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? null : sec);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-sans text-[#827867] uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link to={`/category/${product.category_slug || "men"}`} className="hover:text-black">
            {product.category_slug || "Men"}
          </Link>
          <span>/</span>
          <span className="text-[#201e1a] font-medium line-clamp-1">{product.title}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16">
          {/* Left: Product Image Gallery (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails list (vertical on desktop) */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 sm:w-20 aspect-[3/4] border ${
                      activeImageIndex === idx ? "border-[#1b1916] shadow-sm" : "border-[#ded7c9]"
                    } overflow-hidden rounded-[1px] flex-shrink-0 transition-all`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Image or Elegant Placeholder */}
            <div className="flex-1 aspect-[3/4] max-h-[720px] bg-[#f4f2ec] border border-[#e4dfd3] overflow-hidden relative rounded-[1px] shadow-sm">
              {product.images.length > 0 ? (
                <img
                  src={product.images[activeImageIndex]?.url || product.images[0]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover object-center cursor-zoom-in"
                />
              ) : (
                <PremiumProductPlaceholder
                  title={product.title}
                  subtitle={product.colour || undefined}
                  aspectRatio="portrait"
                />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {discount && (
                  <span className="inline-block text-[11px] font-sans font-medium tracking-wider text-[#a32828] bg-[#fdf2f2]/95 border border-[#e8c8c8] px-2.5 py-0.5 rounded-[1px]">
                    {discount}% OFF
                  </span>
                )}
                {product.is_new && (
                  <span className="inline-block text-[11px] font-sans font-medium tracking-wider text-[#26231f] bg-[#fbf9f5]/95 border border-[#ded7ca] px-2.5 py-0.5 rounded-[1px]">
                    NEW ARRIVAL
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Controls (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Category / Fabric Eyebrow */}
            <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.25em] text-[#867b6b] mb-2">
              <span>{product.category_slug} · {product.fabric}</span>
              <span className="font-mono text-[10px]">SKU: {product.slug.toUpperCase()}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1a1815] leading-[1.15] mb-2">
              {product.title}
            </h1>

            {/* Subtitle */}
            {product.subtitle && (
              <p className="text-xs font-sans text-[#786e5f] uppercase tracking-wider mb-4">
                {product.subtitle}
              </p>
            )}

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#e9e3d6] mb-6">
              <span className="font-sans text-2xl font-medium text-[#1b1916]">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="font-sans text-base text-[#8c8273] line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
              <span className="text-[11px] text-[#736a5c] ml-auto">
                Incl. of all taxes & duties
              </span>
            </div>

            {/* Color Swatch / Details */}
            {product.colour && (
              <div className="mb-6">
                <span className="block text-[11px] font-sans uppercase tracking-[0.18em] text-[#6d6353] mb-2">
                  Colour: <strong className="text-black font-medium">{product.colour}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-[#2b2721] p-0.5 inline-block">
                    <span className="w-full h-full rounded-full bg-[#3e382f] block" />
                  </span>
                  <span className="text-xs text-[#50483c]">{product.colour}</span>
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#6d6353]">
                    Select Size
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-sans text-[#1b1916] underline underline-offset-4 hover:opacity-75 flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Size Guide</span>
                  </button>
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
                        className={`min-w-[48px] h-11 px-3 text-xs font-sans tracking-wider border rounded-[1px] transition-all ${
                          disabled
                            ? "opacity-35 bg-[#ece7dc] cursor-not-allowed line-through text-[#8b8273] border-[#ded7cb]"
                            : isSelected
                            ? "bg-[#1f1d1a] text-[#f7f5f0] border-[#1f1d1a] shadow-sm font-medium"
                            : "bg-white text-[#2a2621] border-[#d8d2c4] hover:border-black"
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Status Notice */}
                <div className="mt-2.5 text-xs font-sans">
                  {isOutOfStock ? (
                    <span className="text-[#a32828] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#a32828]" />
                      Sold out in size {selectedSize}. Please select another size.
                    </span>
                  ) : isLowStock ? (
                    <span className="text-[#966b26] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#966b26]" />
                      Low inventory: Only {currentVariant?.stock} units remaining in this size.
                    </span>
                  ) : (
                    <span className="text-[#2e6d36] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#2e6d36]" />
                      In stock · Ready for studio dispatch
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#6d6353]">
                Quantity
              </span>
              <div className="flex items-center border border-[#d8d1c2] rounded-[1px] bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center text-[#554d41] hover:text-black disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-9 text-center text-xs font-mono font-medium text-[#1f1d1a]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-[#554d41] hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="space-y-3 mb-10">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-4 bg-[#1f1d1a] hover:bg-black text-[#f7f5f0] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] transition-all disabled:opacity-40 shadow-sm"
                >
                  {isOutOfStock ? "SOLD OUT" : "ADD TO BAG"}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-14 h-14 flex items-center justify-center border rounded-[1px] transition-colors ${
                    isWishlisted
                      ? "border-[#a32828] text-[#a32828] bg-[#fcf2f2]"
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

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 bg-[#f5f1e8] hover:bg-[#ede6d9] text-[#1c1a17] border border-[#23201b] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] transition-colors disabled:opacity-40"
              >
                BUY NOW WITH 1-CLICK
              </button>
            </div>

            {/* Expandable Technical Specification Accordions */}
            <div className="border-t border-[#eae3d5] divide-y divide-[#eae3d5] text-xs font-sans">
              {/* Description */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex justify-between items-center text-left text-xs font-medium uppercase tracking-[0.18em] text-[#2c2822]"
                >
                  <span>Design & Craftsmanship</span>
                  <span>{expandedSection === "description" ? "−" : "+"}</span>
                </button>
                {expandedSection === "description" && (
                  <p className="mt-3 text-xs text-[#5f5647] font-light leading-relaxed">
                    {product.description ||
                      "A considered garment cut from select fibers with understated construction and finishing."}
                  </p>
                )}
              </div>

              {/* Fabric & Material */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection("fabric")}
                  className="w-full flex justify-between items-center text-left text-xs font-medium uppercase tracking-[0.18em] text-[#2c2822]"
                >
                  <span>Fabric & Composition</span>
                  <span>{expandedSection === "fabric" ? "−" : "+"}</span>
                </button>
                {expandedSection === "fabric" && (
                  <div className="mt-3 space-y-1 text-xs text-[#5f5647] font-light">
                    <p><strong>Primary Material:</strong> {product.fabric || "Natural Cotton / Linen"}</p>
                    <p><strong>Weave / Weight:</strong> Medium-weight tailored drape with breathable hand-feel.</p>
                    <p><strong>Hardware:</strong> Genuine horn / mother-of-pearl buttons, understated metallic zip.</p>
                  </div>
                )}
              </div>

              {/* Fit & Silhouette */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection("fit")}
                  className="w-full flex justify-between items-center text-left text-xs font-medium uppercase tracking-[0.18em] text-[#2c2822]"
                >
                  <span>Fit & Silhouette</span>
                  <span>{expandedSection === "fit" ? "−" : "+"}</span>
                </button>
                {expandedSection === "fit" && (
                  <div className="mt-3 space-y-1 text-xs text-[#5f5647] font-light">
                    <p><strong>Silhouette:</strong> {product.fit || "Relaxed Contemporary"}</p>
                    <p>Designed to fit true to size. For an oversized editorial aesthetic, take one size larger.</p>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection("care")}
                  className="w-full flex justify-between items-center text-left text-xs font-medium uppercase tracking-[0.18em] text-[#2c2822]"
                >
                  <span>Garment Care</span>
                  <span>{expandedSection === "care" ? "−" : "+"}</span>
                </button>
                {expandedSection === "care" && (
                  <p className="mt-3 text-xs text-[#5f5647] font-light leading-relaxed">
                    {product.care || "Dry clean or gentle cold wash. Reshape and line dry in shade."}
                  </p>
                )}
              </div>

              {/* Delivery & Complimentary Returns */}
              <div className="py-4">
                <button
                  onClick={() => toggleSection("shipping")}
                  className="w-full flex justify-between items-center text-left text-xs font-medium uppercase tracking-[0.18em] text-[#2c2822]"
                >
                  <span>Complimentary Shipping & Returns</span>
                  <span>{expandedSection === "shipping" ? "−" : "+"}</span>
                </button>
                {expandedSection === "shipping" && (
                  <div className="mt-3 space-y-1.5 text-xs text-[#5f5647] font-light leading-relaxed">
                    <p>• Complimentary worldwide shipping on all orders above ₹5,000.</p>
                    <p>• Dispatched within 24–48 hours in signature TESTER archival gift packaging.</p>
                    <p>• 15-day complimentary returns and size exchanges supported seamlessly.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like / Recommendations */}
        {recommendations.length > 0 && (
          <section className="pt-16 border-t border-[#eae3d5]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-[#867b6b] uppercase font-sans">
                  COMPLETE THE LOOK
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1b1916]">
                  You May Also Like
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category_slug || "men"}
      />
    </div>
  );
}
