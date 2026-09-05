import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { PremiumProductPlaceholder } from "../components/placeholders/PremiumProductPlaceholder";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1b1916] pb-4 border-b border-[#e9e3d6] mb-8">
          Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
        </h1>

        {items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-[#ded7c9] flex items-center justify-center text-[#8e8372]">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-light text-[#221f1a] mb-2">Your Bag is Empty</h2>
            <p className="text-xs text-[#736858] font-light leading-relaxed mb-6">
              You currently have no items in your shopping bag. Explore our collections of considered garments.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3.5 bg-[#1f1d1a] text-[#f7f5f0] text-xs font-sans tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors"
            >
              Explore Studio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items Table (8 cols) */}
            <div className="lg:col-span-8">
              <div className="divide-y divide-[#ece6d9] border-t border-b border-[#ece6d9]">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex gap-6 items-center">
                    {/* Image */}
                    <div className="w-24 sm:w-28 aspect-[3/4] bg-[#f4f2ec] border border-[#ded7ca] overflow-hidden flex-shrink-0 relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <PremiumProductPlaceholder
                          title={item.title}
                          aspectRatio="portrait"
                          showComingSoon={false}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-serif text-base sm:text-lg font-normal text-[#1e1c19] hover:underline"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs font-sans text-[#786e5f] mt-1">
                          Colour: {item.color} · Size: {item.size}
                        </p>
                        <span className="text-xs font-sans font-medium text-[#1e1c19] mt-2 block">
                          {formatPrice(item.price)} each
                        </span>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-[#d8d1c2] bg-white rounded-[1px]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#554d41] hover:text-black"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-medium text-[#1f1d1a]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#554d41] hover:text-black"
                          >
                            +
                          </button>
                        </div>

                        <span className="w-24 text-right text-sm font-mono font-medium text-[#1e1c19]">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-[#8f8473] hover:text-[#a32828] transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6">
                <Link
                  to="/"
                  className="text-xs font-sans uppercase tracking-[0.2em] text-[#4d4538] hover:text-black underline underline-offset-4"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs font-sans text-[#a32828] hover:underline"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-8 bg-[#f7f5ee] border border-[#e4ded0] rounded-[2px] space-y-6">
                <h3 className="font-serif text-xl font-normal text-[#1e1c19] pb-3 border-b border-[#eae3d5]">
                  Order Summary
                </h3>

                {/* Promo Code */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="VOUCHER / PROMO CODE"
                    className="flex-1 bg-white border border-[#ded8cb] px-3 py-2 text-xs font-sans tracking-wider uppercase focus:outline-none focus:border-black rounded-[1px]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1f1d1a] text-[#f7f5f0] text-xs font-sans tracking-wider uppercase font-medium hover:bg-black rounded-[1px]"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-[#2b6832] bg-[#edf6ee] px-3 py-2 rounded-[1px]">
                    <span>Code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(appliedCoupon.discountAmount)})</span>
                    <button onClick={removeCoupon} className="underline text-xs text-[#524a3e]">
                      Remove
                    </button>
                  </div>
                )}

                {couponFeedback && !appliedCoupon && (
                  <span className={`block text-xs ${couponFeedback.success ? "text-[#2b6832]" : "text-[#a32828]"}`}>
                    {couponFeedback.message}
                  </span>
                )}

                {/* Subtotal, Shipping, Total */}
                <div className="space-y-2 text-xs font-sans text-[#5c5344] border-t border-[#eae3d5] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-[#2b6832]">
                      <span>Promotional Discount</span>
                      <span className="font-mono">-{formatPrice(appliedCoupon.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Worldwide Shipping</span>
                    <span>{shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}</span>
                  </div>

                  <div className="flex justify-between text-base font-medium text-[#1c1a17] pt-4 border-t border-[#ded8cb]">
                    <span>Total Amount</span>
                    <span className="font-mono">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate({ to: "/checkout" })}
                  className="w-full py-4 bg-[#1f1d1a] hover:bg-black text-[#f7f5f0] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] transition-all shadow-sm"
                >
                  PROCEED TO CHECKOUT
                </button>

                <div className="text-[11px] text-[#786e5e] text-center font-light leading-relaxed">
                  Complimentary carbon-neutral express delivery & 15-day studio returns.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
