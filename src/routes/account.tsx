import { useState, useMemo } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCatalogue } from "../hooks/useCatalogue";
import { ProductCard } from "../components/storefront/ProductCard";
import { formatPrice } from "../lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || "profile",
    };
  },
  component: AccountPage,
});

function AccountPage() {
  const { tab: initialTab } = useSearch({ from: "/account" });
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist" | "addresses">(
    (initialTab as any) || "profile"
  );

  const { user, signOut, isAdmin, toggleAdminDemo } = useAuth();
  const { wishlistIds } = useWishlist();
  const { products } = useCatalogue();

  // Load orders from local storage or demo orders
  const orders = useMemo(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tester_customer_orders");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return [
      {
        orderNumber: "TST-882194",
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        items: [
          {
            title: "Merino Wool Polo",
            color: "Charcoal",
            size: "M",
            quantity: 1,
            price: 5499,
          },
          {
            title: "Minimal Leather Sneaker",
            color: "White",
            size: "UK 9",
            quantity: 1,
            price: 8999,
          },
        ],
        total: 14498,
        status: "Shipped",
        paymentMethod: "CARD",
      },
    ];
  }, []);

  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#eae3d6] mb-10 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-1">
              CLIENT CONCIERGE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1c1a17]">
              Welcome, {user?.fullName || "Alexander Wright"}
            </h1>
            <p className="text-xs text-[#736857] font-light mt-1">
              {user?.email || "alexander.wright@tester.com"} · {isAdmin ? "Studio Administrator" : "Private Client"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Demo role switch helper */}
            <button
              onClick={() => {
                toggleAdminDemo();
                toast.info(`Switched role to: ${isAdmin ? "Customer" : "Admin"}`);
              }}
              className="px-3.5 py-1.5 border border-[#d8d1c2] bg-[#f8f5ee] hover:bg-[#ede7dc] text-[11px] font-sans tracking-wider uppercase text-[#353028] rounded-[1px] transition-colors"
            >
              Role: {isAdmin ? "Admin (Click to make Customer)" : "Customer (Click to make Admin)"}
            </button>

            <button
              onClick={() => signOut()}
              className="text-xs font-sans uppercase tracking-wider text-[#a32828] underline hover:no-underline"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Layout with Sidebar Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-1 text-xs font-sans">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 border-l-2 transition-colors ${
                activeTab === "profile"
                  ? "border-[#1b1916] bg-[#f4f0e7] font-semibold text-[#1b1916]"
                  : "border-transparent text-[#6e6353] hover:text-black hover:bg-[#fbf9f4]"
              }`}
            >
              Account Overview
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 border-l-2 transition-colors ${
                activeTab === "orders"
                  ? "border-[#1b1916] bg-[#f4f0e7] font-semibold text-[#1b1916]"
                  : "border-transparent text-[#6e6353] hover:text-black hover:bg-[#fbf9f4]"
              }`}
            >
              Order History ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full text-left px-4 py-3 border-l-2 transition-colors ${
                activeTab === "wishlist"
                  ? "border-[#1b1916] bg-[#f4f0e7] font-semibold text-[#1b1916]"
                  : "border-transparent text-[#6e6353] hover:text-black hover:bg-[#fbf9f4]"
              }`}
            >
              Saved Items ({wishlistIds.length})
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left px-4 py-3 border-l-2 transition-colors ${
                activeTab === "addresses"
                  ? "border-[#1b1916] bg-[#f4f0e7] font-semibold text-[#1b1916]"
                  : "border-transparent text-[#6e6353] hover:text-black hover:bg-[#fbf9f4]"
              }`}
            >
              Shipping Addresses
            </button>

            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-[#eae3d6]">
                <Link
                  to="/admin"
                  className="block px-4 py-3 bg-[#1e1c19] text-[#f7f5f0] text-center uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors rounded-[1px]"
                >
                  Admin Studio →
                </Link>
              </div>
            )}
          </div>

          {/* Main Content Area (9 cols) */}
          <div className="md:col-span-9 bg-white p-6 sm:p-8 border border-[#e8e2d5] rounded-[2px]">
            {/* Tab 1: Profile Overview */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                <h3 className="font-serif text-2xl font-light text-[#1b1916] pb-3 border-b border-[#eae3d6]">
                  Personal Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
                  <div>
                    <span className="block text-[#857b6d] uppercase tracking-wider text-[10px] mb-1">
                      Full Name
                    </span>
                    <p className="text-sm font-medium text-[#1e1c19]">{user?.fullName || "Alexander Wright"}</p>
                  </div>
                  <div>
                    <span className="block text-[#857b6d] uppercase tracking-wider text-[10px] mb-1">
                      Registered Email
                    </span>
                    <p className="text-sm font-medium text-[#1e1c19]">{user?.email || "alexander.wright@tester.com"}</p>
                  </div>
                  <div>
                    <span className="block text-[#857b6d] uppercase tracking-wider text-[10px] mb-1">
                      Primary Contact Number
                    </span>
                    <p className="text-sm font-medium text-[#1e1c19]">{user?.phone || "+91 98765 43210"}</p>
                  </div>
                  <div>
                    <span className="block text-[#857b6d] uppercase tracking-wider text-[10px] mb-1">
                      Membership Status
                    </span>
                    <span className="inline-block px-2.5 py-1 bg-[#f4f0e7] border border-[#dcd5c7] text-[#2c2822] uppercase tracking-wider font-medium text-[10px]">
                      Verified Atelier Patron
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#eae3d6]">
                  <h4 className="font-serif text-lg font-normal text-[#1e1c19] mb-2">
                    Client Studio Privileges
                  </h4>
                  <ul className="text-xs text-[#635a4c] space-y-1.5 font-light leading-relaxed">
                    <li>• Priority allocations on limited edition capsule releases.</li>
                    <li>• Complimentary worldwide express courier delivery on all orders.</li>
                    <li>• Dedicated bespoke sizing & wardrobe consultation via studio concierge.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Orders */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-light text-[#1b1916] pb-3 border-b border-[#eae3d6]">
                  Order History
                </h3>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#736858] font-light py-8">
                    No orders have been recorded yet.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {orders.map((ord: any) => (
                      <div
                        key={ord.orderNumber}
                        className="p-5 border border-[#e4ded0] bg-[#fbf9f4] rounded-[1px] space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#ede7db] gap-2 text-xs font-sans">
                          <div>
                            <span className="font-mono font-medium text-[#1b1916] text-sm block">
                              Order #{ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-[#786e5e]">
                              Placed on {new Date(ord.date).toLocaleDateString("en-IN", { dateStyle: "long" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 bg-[#ede8dc] border border-[#ded8cb] text-[#2b2721] text-[10px] uppercase tracking-wider font-medium">
                              {ord.status}
                            </span>
                            <span className="font-mono text-sm font-semibold text-[#1b1916]">
                              {formatPrice(ord.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items preview */}
                        <div className="divide-y divide-[#eee8dc]">
                          {(ord.items || []).map((it: any, i: number) => (
                            <div key={i} className="py-2.5 flex justify-between items-center text-xs font-sans">
                              <div>
                                <span className="font-serif font-normal text-sm text-[#1e1c19] block">
                                  {it.title}
                                </span>
                                <span className="text-[11px] text-[#736a5a]">
                                  {it.color} · Size: {it.size} · Quantity: {it.quantity}
                                </span>
                              </div>
                              <span className="font-mono text-xs text-[#4d4436]">
                                {formatPrice(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            to={`/order-confirmation/${ord.orderNumber}`}
                            className="text-xs font-sans text-[#1b1916] underline underline-offset-4 hover:opacity-80"
                          >
                            View Tracking Details & Invoice Receipt →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Wishlist */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex justify-between items-baseline pb-3 border-b border-[#eae3d6]">
                  <h3 className="font-serif text-2xl font-light text-[#1b1916]">
                    Saved Garments
                  </h3>
                  <span className="text-xs font-mono text-[#786e5e]">
                    {wishlistedProducts.length} pieces
                  </span>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="py-12 text-center text-xs font-sans text-[#786e5e]">
                    No garments saved yet. Browse the collection and tap the heart icon to save your favorites.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {wishlistedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Shipping Addresses */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex justify-between items-baseline pb-3 border-b border-[#eae3d6]">
                  <h3 className="font-serif text-2xl font-light text-[#1b1916]">
                    Saved Shipping Addresses
                  </h3>
                  <button
                    onClick={() => toast.info("Address edit modal available in next release.")}
                    className="text-xs font-sans uppercase tracking-wider text-[#1e1c19] underline"
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="p-5 border border-[#e4ded0] bg-[#fbf9f4] rounded-[1px] space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-serif font-normal text-[#1e1c19]">
                      Primary Residence (Default)
                    </strong>
                    <span className="text-[10px] tracking-wider uppercase text-[#2b6832] font-semibold bg-[#e8f5e9] px-2 py-0.5 rounded-[1px]">
                      Default
                    </span>
                  </div>
                  <p className="text-[#3c362d] font-medium">{user?.fullName || "Alexander Wright"}</p>
                  <p className="text-[#685e4f] leading-relaxed">
                    Flat 4B, The Oberoi Enclave, Golf Links, New Delhi, Delhi 110003, India
                  </p>
                  <p className="text-[#685e4f]">Phone: {user?.phone || "+91 98765 43210"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
