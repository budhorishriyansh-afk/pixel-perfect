import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import { supabase } from "../integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, shippingFee, appliedCoupon, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState(user?.email || "alexander.wright@tester.com");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [fullName, setFullName] = useState(user?.fullName || "Alexander Wright");
  const [address1, setAddress1] = useState("Flat 4B, The Oberoi Enclave, Golf Links");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [state, setState] = useState("Delhi");
  const [postalCode, setPostalCode] = useState("110003");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcfbf8]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="font-serif text-3xl font-light mb-2">No Items in Bag</h2>
          <p className="text-xs text-[#756c5e] mb-6">
            Please select at least one garment before proceeding to checkout.
          </p>
          <Link
            to="/"
            className="px-8 py-3.5 bg-[#1e1c19] text-[#f7f5f0] text-xs font-sans tracking-[0.2em] uppercase font-medium"
          >
            Explore Catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const orderNumber = "TST-" + Math.floor(100000 + Math.random() * 900000);

    try {
      // Save order to Supabase orders table
      const orderPayload = {
        order_number: orderNumber,
        user_id: user?.id && !user.id.startsWith("demo-") ? user.id : null,
        email,
        status: "confirmed",
        payment_status: paymentMethod === "cod" ? "pending" : "paid",
        payment_method: paymentMethod.toUpperCase(),
        subtotal,
        discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
        shipping: shippingFee,
        total,
        coupon_code: appliedCoupon?.code || null,
        delivery_method: deliveryMethod,
        shipping_address: {
          full_name: fullName,
          line1: address1,
          line2: address2,
          city,
          state,
          postal_code: postalCode,
          country: "India",
          phone,
        },
      };

      try {
        const { data: orderRes } = await supabase
          .from("orders")
          .insert(orderPayload as any)
          .select()
          .single();

        if (orderRes) {
          const orderItems = items.map((it) => ({
            order_id: orderRes.id,
            product_id: it.productId.startsWith("prod-") ? null : it.productId,
            title: it.title,
            size: it.size,
            colour: it.color,
            image_url: it.imageUrl,
            unit_price: it.price,
            quantity: it.quantity,
          }));

          await supabase.from("order_items").insert(orderItems as any);
        }
      } catch (dbErr) {
        console.warn("Notice: Saved order to local session state (Supabase fallback):", dbErr);
      }

      // Store in local storage for order confirmation receipt & account view
      const localOrders = JSON.parse(localStorage.getItem("tester_customer_orders") || "[]");
      localOrders.unshift({
        orderNumber,
        date: new Date().toISOString(),
        items,
        subtotal,
        discount: appliedCoupon?.discountAmount || 0,
        shipping: shippingFee,
        total,
        shippingAddress: {
          fullName,
          line1: address1,
          city,
          state,
          postalCode,
          phone,
        },
        paymentMethod: paymentMethod.toUpperCase(),
        status: "Confirmed",
      });
      localStorage.setItem("tester_customer_orders", JSON.stringify(localOrders));

      clearCart();
      navigate({ to: `/order-confirmation/${orderNumber}` });
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      {/* Minimal Checkout Header */}
      <header className="border-b border-[#eae3d6] bg-[#fbf9f5] py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl tracking-[0.22em] font-light text-[#1b1916]">
            TESTER
          </Link>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#7d7363]">
            Secure Checkout
          </span>
          <Link to="/cart" className="text-xs font-sans text-[#4a4235] underline hover:text-black">
            Return to Bag
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Steps Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              {/* Step 1: Contact Information */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#eae3d6] mb-4">
                  <h3 className="font-serif text-xl font-normal text-[#1e1c19]">
                    1. Contact Information
                  </h3>
                  {!user && (
                    <Link to="/auth" className="text-xs font-sans text-[#5c5344] underline">
                      Already have an account? Sign in
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                      Phone Number (for courier updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div>
                <h3 className="font-serif text-xl font-normal text-[#1e1c19] pb-3 border-b border-[#eae3d6] mb-4">
                  2. Shipping Address
                </h3>

                <div className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                      Street Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                      Apartment / Suite / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6d6352] mb-1.5 uppercase tracking-wider text-[10px]">
                        PIN / Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-white border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Delivery Method */}
              <div>
                <h3 className="font-serif text-xl font-normal text-[#1e1c19] pb-3 border-b border-[#eae3d6] mb-4">
                  3. Delivery Method
                </h3>

                <div className="space-y-3 text-xs font-sans">
                  <label
                    onClick={() => setDeliveryMethod("standard")}
                    className={`flex items-center justify-between p-4 border rounded-[1px] cursor-pointer transition-colors ${
                      deliveryMethod === "standard"
                        ? "border-[#1b1916] bg-[#f7f4ec]"
                        : "border-[#ded7ca] bg-white hover:bg-[#fbf9f4]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "standard"}
                        onChange={() => setDeliveryMethod("standard")}
                        className="accent-[#1b1916]"
                      />
                      <div>
                        <strong className="block text-[#1e1c19] font-medium">
                          Complimentary Studio Express (2–4 Business Days)
                        </strong>
                        <span className="text-[#736858]">Carbon-neutral delivery in archival garment box.</span>
                      </div>
                    </div>
                    <span className="font-medium text-[#1e1c19]">Free</span>
                  </label>
                </div>
              </div>

              {/* Step 4: Payment Selection (Demo Mode clearly specified) */}
              <div>
                <div className="pb-3 border-b border-[#eae3d6] mb-4 flex items-baseline justify-between">
                  <h3 className="font-serif text-xl font-normal text-[#1e1c19]">
                    4. Payment Selection
                  </h3>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 bg-[#f0ebd9] text-[#756649] border border-[#ded4bc] rounded-[1px]">
                    Development Sandbox Mode
                  </span>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-start gap-3 p-4 border rounded-[1px] cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-[#1b1916] bg-[#f7f4ec]"
                        : "border-[#ded7ca] bg-white hover:bg-[#fbf9f4]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mt-1 accent-[#1b1916]"
                    />
                    <div className="flex-1">
                      <strong className="block text-[#1e1c19] font-medium mb-1">
                        Credit / Debit Card (Sandbox Demo)
                      </strong>
                      <p className="text-[#6d6353] leading-relaxed">
                        Production payment gateway (Razorpay / Stripe) can be integrated seamlessly.
                        In sandbox mode, simulated verification is used without storing raw credentials.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex items-start gap-3 p-4 border rounded-[1px] cursor-pointer ${
                      paymentMethod === "upi"
                        ? "border-[#1b1916] bg-[#f7f4ec]"
                        : "border-[#ded7ca] bg-white hover:bg-[#fbf9f4]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="mt-1 accent-[#1b1916]"
                    />
                    <div>
                      <strong className="block text-[#1e1c19] font-medium mb-0.5">
                        UPI / Instant NetBanking
                      </strong>
                      <span className="text-[#6d6353]">Google Pay, PhonePe, BHIM UPI.</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start gap-3 p-4 border rounded-[1px] cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-[#1b1916] bg-[#f7f4ec]"
                        : "border-[#ded7ca] bg-white hover:bg-[#fbf9f4]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 accent-[#1b1916]"
                    />
                    <div>
                      <strong className="block text-[#1e1c19] font-medium mb-0.5">
                        Cash on Delivery (Pay upon arrival)
                      </strong>
                      <span className="text-[#6d6353]">Available across all metro PIN codes.</span>
                    </div>
                  </label>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#fcf0f0] border border-[#e8c8c8] text-xs text-[#a32828] rounded-[1px]">
                  {errorMsg}
                </div>
              )}

              {/* Submit Order Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#1f1d1a] hover:bg-black text-[#f7f5f0] text-xs font-sans tracking-[0.25em] uppercase font-medium rounded-[1px] transition-all shadow-md disabled:opacity-40"
                >
                  {isSubmitting ? "TRANSMITTING ORDER TO STUDIO..." : `COMPLETE ORDER (${formatPrice(total)})`}
                </button>
                <span className="block text-[11px] text-[#7a7161] text-center mt-3 font-light">
                  By clicking complete order, you agree to the TESTER Terms & Conditions.
                </span>
              </div>
            </form>
          </div>

          {/* Collapsible Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 bg-[#f7f5ee] border border-[#e4ded0] rounded-[2px] sticky top-28 space-y-6">
              <h3 className="font-serif text-xl font-normal text-[#1e1c19] pb-3 border-b border-[#eae3d5]">
                Order Items ({items.length})
              </h3>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center text-xs font-sans">
                    <div className="w-14 aspect-[3/4] bg-[#eeeae2] border border-[#ded8cb] overflow-hidden flex-shrink-0 relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-[#8e8576]">
                          TST
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif font-normal text-sm text-[#1e1c19] line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#756a5a]">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#292520]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="space-y-2 text-xs font-sans text-[#5c5344] border-t border-[#eae3d5] pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[#2b6832]">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="font-mono">-{formatPrice(appliedCoupon.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}</span>
                </div>

                <div className="flex justify-between text-base font-medium text-[#1c1a17] pt-4 border-t border-[#ded8cb]">
                  <span>Total Payable</span>
                  <span className="font-mono">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
