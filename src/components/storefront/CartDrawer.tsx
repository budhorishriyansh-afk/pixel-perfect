import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "../../context/CartContext";
import { PremiumProductPlaceholder } from "../placeholders/PremiumProductPlaceholder";
import { formatPrice } from "../../lib/format";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#fcfbf8] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[#e4decfa0]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ece6d9]">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-2xl font-light text-[#1c1a17]">Shopping Bag</h3>
            <span className="text-xs font-mono text-[#867b6b]">
              ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-1.5 text-[#5c5344] hover:text-black transition-colors"
            aria-label="Close cart drawer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-[#f5f2ea] border-b border-[#ece6d9] text-[11px] font-sans">
          {remainingForFreeShipping > 0 ? (
            <p className="text-[#554c3f] mb-1.5">
              Add <span className="font-medium text-black">{formatPrice(remainingForFreeShipping)}</span> more to unlock complimentary worldwide shipping.
            </p>
          ) : (
            <p className="text-[#2b6832] font-medium mb-1.5 flex items-center gap-1.5">
              <span>✓ You qualify for complimentary worldwide shipping.</span>
            </p>
          )}
          <div className="w-full h-1 bg-[#ded7c8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1b1916] transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Item List or Empty State */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#ece6da]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 mb-4 rounded-full border border-[#ded7ca] flex items-center justify-center text-[#8e8473]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="font-serif text-xl font-normal text-[#24211d] mb-1">Your bag is empty</h4>
              <p className="text-xs text-[#736858] max-w-xs mb-6 font-light leading-relaxed">
                Explore our studio collections and curated essentials.
              </p>
              <button
                onClick={closeCartDrawer}
                className="px-6 py-3 bg-[#1f1d1a] text-[#f7f5f0] text-xs font-sans tracking-[0.2em] uppercase font-medium hover:bg-black transition-all"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 aspect-[3/4] flex-shrink-0 bg-[#f4f2ee] border border-[#e4decfa0] overflow-hidden relative">
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

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeCartDrawer}
                        className="font-serif text-sm font-normal text-[#1e1c19] hover:underline line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#928775] hover:text-[#a32828] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] font-sans text-[#786e5f] mt-0.5">
                      {item.color} · Size {item.size}
                    </p>

                    <div className="mt-1 font-sans text-xs font-medium text-[#1e1c19]">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#d8d1c2] bg-white rounded-[1px]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#554d41] hover:text-black"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-mono text-[#1f1d1a]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#554d41] hover:text-black"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-mono text-[#4a4235]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Totals & Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-[#f7f5ef] border-t border-[#ece6d9] space-y-4">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="PROMO CODE (e.g. WELCOME10)"
                className="flex-1 bg-white border border-[#ded8cb] px-3 py-2 text-xs font-sans tracking-wider uppercase placeholder-[#9e9483] focus:outline-none focus:border-black rounded-[1px]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#2a2620] text-[#f7f5f0] text-xs font-sans tracking-wider uppercase font-medium hover:bg-black rounded-[1px]"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-[#2b6832] bg-[#edf6ee] px-3 py-1.5 rounded-[1px]">
                <span>✓ Promo code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(appliedCoupon.discountAmount)})</span>
                <button onClick={removeCoupon} className="text-xs underline text-[#635b4f] hover:text-black">
                  Remove
                </button>
              </div>
            )}

            {couponFeedback && !appliedCoupon && (
              <span className={`block text-xs ${couponFeedback.success ? "text-[#2b6832]" : "text-[#a32828]"}`}>
                {couponFeedback.message}
              </span>
            )}

            {/* Financial Breakdown */}
            <div className="space-y-1.5 text-xs font-sans border-t border-[#eae3d5] pt-3 text-[#50483b]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-[#2b6832]">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}</span>
              </div>

              <div className="flex justify-between text-sm font-medium text-[#1c1a17] pt-2 border-t border-[#ded8cb]">
                <span>Estimated Total</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate({ to: "/checkout" });
                }}
                className="w-full py-4 bg-[#1f1d1a] hover:bg-black text-[#f7f5f0] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] transition-all shadow-sm"
              >
                PROCEED TO CHECKOUT
              </button>

              <Link
                to="/cart"
                onClick={closeCartDrawer}
                className="block text-center py-2.5 text-xs font-sans uppercase tracking-[0.2em] text-[#4d4538] hover:text-black transition-colors"
              >
                View Complete Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
