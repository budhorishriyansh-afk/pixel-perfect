import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCatalogue, Product } from "../hooks/useCatalogue";
import { useSiteCMS } from "../hooks/useSiteCMS";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";
import { PremiumProductPlaceholder } from "../components/placeholders/PremiumProductPlaceholder";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type AdminTab =
  | "overview"
  | "products"
  | "inventory"
  | "orders"
  | "media"
  | "coupons"
  | "homepage_cms"
  | "settings";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const { user, isAdmin, toggleAdminDemo } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock,
    addImageToProduct,
    removeImageFromProduct,
  } = useCatalogue();
  const {
    announcement,
    hero,
    brandStory,
    updateAnnouncement,
    updateHero,
    updateBrandStory,
  } = useSiteCMS();

  // Search & Filter in Admin Products
  const [prodSearch, setProdSearch] = useState("");
  const [selectedProdForEdit, setSelectedProdForEdit] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // New Image URL input inside modal or media tab
  const [newImageUrl, setNewImageUrl] = useState("");

  // Orders State in Admin
  const [orders, setOrders] = useState([
    {
      id: "ord-901",
      orderNumber: "TST-882194",
      customerName: "Alexander Wright",
      customerEmail: "alexander.wright@tester.com",
      date: "2026-09-04",
      itemsCount: 2,
      amount: 14498,
      paymentStatus: "Paid",
      orderStatus: "Shipped",
      trackingNumber: "DTDC-IN-9948201",
    },
    {
      id: "ord-902",
      orderNumber: "TST-773412",
      customerName: "Eleanor Sterling",
      customerEmail: "eleanor.s@studio.com",
      date: "2026-09-05",
      itemsCount: 1,
      amount: 11999,
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
      trackingNumber: "PENDING",
    },
    {
      id: "ord-903",
      orderNumber: "TST-665189",
      customerName: "Marcus Vance",
      customerEmail: "m.vance@lifestyle.in",
      date: "2026-09-05",
      itemsCount: 3,
      amount: 22497,
      paymentStatus: "Paid",
      orderStatus: "Processing",
      trackingNumber: "BLUEDART-883192",
    },
  ]);

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: "WELCOME10", type: "percent", value: 10, minOrder: 3000, isActive: true },
    { code: "TESTER500", type: "fixed", value: 500, minOrder: 10000, isActive: true },
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponValue, setNewCouponValue] = useState("");

  // Media Library items
  const [mediaItems, setMediaItems] = useState([
    {
      id: "m-1",
      name: "Lookbook Autumn Editorial Ref",
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      date: "2026-09-01",
    },
    {
      id: "m-2",
      name: "Studio Minimal Architecture",
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      date: "2026-09-02",
    },
  ]);

  // If user is not admin, show gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#141210] text-[#eee7db] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1e1c18] border border-[#38332c] p-8 text-center rounded-[2px] shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#2c2822] flex items-center justify-center text-[#c2b6a2]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-light text-white mb-2">
            Restricted Admin Studio
          </h2>
          <p className="text-xs text-[#a39886] font-light leading-relaxed mb-6">
            Access to this administrative suite is restricted to authorized studio personnel.
          </p>
          <button
            onClick={() => {
              toggleAdminDemo();
              toast.success("Admin role granted!");
            }}
            className="w-full py-3 bg-[#e8e2d5] text-[#1a1815] text-xs font-sans tracking-[0.2em] uppercase font-semibold hover:bg-white transition-colors"
          >
            Authenticate as Studio Admin
          </button>
          <Link
            to="/"
            className="block text-center text-xs font-sans uppercase tracking-wider text-[#887e6e] hover:text-white mt-4"
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // Derived Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const outOfStockVariants = products.flatMap((p) =>
    p.variants.filter((v) => v.stock === 0)
  ).length;

  const filteredAdminProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.category_slug?.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(prodSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-[#e8e2d5] flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="h-16 bg-[#171513] border-b border-[#292520] px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-serif text-2xl tracking-[0.22em] text-white hover:opacity-80"
          >
            TESTER
          </Link>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8e8473] border-l border-[#2e2a24] pl-4 font-mono">
            ATELIER STUDIO OS v2.6
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            to="/"
            className="text-[#a89e8e] hover:text-white underline underline-offset-4 flex items-center gap-1 text-[11px] uppercase tracking-wider"
          >
            View Live Storefront ↗
          </Link>
          <div className="h-4 w-[1px] bg-[#2e2a24]" />
          <span className="text-xs text-[#a89e8e]">
            Signed in: <strong className="text-white">{user?.fullName || "Studio Administrator"}</strong>
          </span>
          <button
            onClick={() => toggleAdminDemo()}
            className="px-2.5 py-1 text-[10px] uppercase tracking-wider border border-[#3e3931] bg-[#221f1a] text-[#ded8cb] hover:bg-[#2b2721] rounded-[1px]"
          >
            Exit Admin
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-[#141210] border-r border-[#26231e] p-4 flex flex-col justify-between flex-shrink-0">
          <nav className="space-y-1 text-xs">
            {[
              { id: "overview", label: "Dashboard Overview", icon: "📊" },
              { id: "products", label: "Product Management", icon: "🧥" },
              { id: "inventory", label: "Variant Inventory", icon: "📦" },
              { id: "orders", label: "Customer Orders", icon: "🧾" },
              { id: "media", label: "Media & Photographs", icon: "🖼️" },
              { id: "coupons", label: "Discounts & Coupons", icon: "🏷️" },
              { id: "homepage_cms", label: "Homepage & CMS", icon: "✨" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[1px] tracking-wider text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-[#27231e] text-white font-medium border-l-2 border-[#d6cbba]"
                    : "text-[#9e9484] hover:text-white hover:bg-[#1c1916]"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-3 bg-[#1c1a16] border border-[#2e2922] rounded-[1px] text-[11px] text-[#968b7a]">
            <span className="font-medium text-[#ded7ca] block mb-1">Image Policy Active:</span>
            Zero AI images policy strictly enforced. Real images uploaded here are published instantly.
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0f0e0d]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-serif text-3xl font-light text-white mb-1">Studio Overview</h2>
                <p className="text-xs text-[#8e8473]">
                  Commercial performance, recent orders, and catalogue availability.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#171513] border border-[#292520] rounded-[2px]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e8473] block mb-2">
                    TOTAL SALES REVENUE
                  </span>
                  <div className="font-mono text-2xl text-white font-medium">
                    {formatPrice(totalRevenue)}
                  </div>
                  <span className="text-[11px] text-[#4ea059] mt-2 block">+14% vs last period</span>
                </div>

                <div className="p-5 bg-[#171513] border border-[#292520] rounded-[2px]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e8473] block mb-2">
                    ORDERS FULFILLED
                  </span>
                  <div className="font-mono text-2xl text-white font-medium">{totalOrders}</div>
                  <span className="text-[11px] text-[#8e8473] mt-2 block">100% on schedule</span>
                </div>

                <div className="p-5 bg-[#171513] border border-[#292520] rounded-[2px]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e8473] block mb-2">
                    ACTIVE PRODUCTS
                  </span>
                  <div className="font-mono text-2xl text-white font-medium">{totalProducts}</div>
                  <span className="text-[11px] text-[#8e8473] mt-2 block">Seeded luxury archive</span>
                </div>

                <div className="p-5 bg-[#171513] border border-[#292520] rounded-[2px]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e8473] block mb-2">
                    OUT-OF-STOCK VARIANTS
                  </span>
                  <div className="font-mono text-2xl text-[#d46a6a] font-medium">
                    {outOfStockVariants}
                  </div>
                  <span className="text-[11px] text-[#d46a6a] mt-2 block">Requires stock reorder</span>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="p-6 bg-[#171513] border border-[#292520] rounded-[2px]">
                <h3 className="font-serif text-xl font-light text-white mb-4">Recent Dispatches</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#292520] text-[#7e7464] uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Tracking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#24201a] text-[#d6cebf]">
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="py-3 px-3 font-mono text-white">{o.orderNumber}</td>
                          <td className="py-3 px-3">
                            <span className="font-medium block text-white">{o.customerName}</span>
                            <span className="text-[11px] text-[#827766]">{o.customerEmail}</span>
                          </td>
                          <td className="py-3 px-3">{o.date}</td>
                          <td className="py-3 px-3 font-mono">{formatPrice(o.amount)}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-[#25211b] border border-[#3d372e] rounded-[1px] text-[10px] text-white uppercase">
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-[#8e8473]">
                            {o.trackingNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "products" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-light text-white mb-1">
                    Product Catalogue ({products.length})
                  </h2>
                  <p className="text-xs text-[#8e8473]">
                    Create, edit, duplicate, upload real photography, and manage studio garments.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProdForEdit(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#e8e2d5] text-[#141210] text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:bg-white transition-colors"
                >
                  + Add New Garment
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex gap-4">
                <input
                  type="text"
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  placeholder="Filter products by title, category, or slug..."
                  className="flex-1 bg-[#171513] border border-[#2e2a23] px-4 py-2.5 text-xs text-white placeholder-[#685f50] focus:outline-none focus:border-[#c2b6a2]"
                />
              </div>

              {/* Products Table */}
              <div className="bg-[#171513] border border-[#292520] rounded-[2px] overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#292520] text-[#7e7464] uppercase text-[10px] tracking-wider bg-[#13110f]">
                        <th className="py-3 px-3">Image</th>
                        <th className="py-3 px-3">Title / SKU</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Fabric</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Total Stock</th>
                        <th className="py-3 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221f1a] text-[#cfc7b8]">
                      {filteredAdminProducts.map((p) => {
                        const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                        return (
                          <tr key={p.id} className="hover:bg-[#1a1714]">
                            <td className="py-2.5 px-3">
                              <div className="w-10 aspect-[3/4] bg-[#221f1a] border border-[#332e27] overflow-hidden flex items-center justify-center">
                                {p.images.length > 0 ? (
                                  <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[8px] text-[#786e5e]">PH</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-serif text-sm text-white font-normal block">
                                {p.title}
                              </span>
                              <span className="text-[10px] font-mono text-[#827867]">
                                {p.slug}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 uppercase text-[10px] text-[#9c9180]">
                              {p.category_slug}
                            </td>
                            <td className="py-2.5 px-3">{p.fabric || "—"}</td>
                            <td className="py-2.5 px-3 font-mono text-white">
                              {formatPrice(p.price)}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`font-mono text-xs ${
                                  totalStock === 0 ? "text-[#d46a6a] font-bold" : "text-white"
                                }`}
                              >
                                {totalStock}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    setSelectedProdForEdit(p);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="text-xs text-[#c4b9a7] hover:text-white underline"
                                >
                                  Edit & Photos
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete garment "${p.title}"?`)) {
                                      deleteProduct(p.id);
                                      toast.success("Garment removed.");
                                    }
                                  }}
                                  className="text-xs text-[#a33232] hover:text-red-400"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VARIANT INVENTORY MATRIX */}
          {activeTab === "inventory" && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="font-serif text-3xl font-light text-white mb-1">
                  Variant Inventory Matrix
                </h2>
                <p className="text-xs text-[#8e8473]">
                  Inline quick-stock modifier. Changes reflect live on customer storefront immediately.
                </p>
              </div>

              <div className="bg-[#171513] border border-[#292520] rounded-[2px] overflow-hidden text-xs">
                <div className="overflow-x-auto max-h-[600px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#13110f] z-10 border-b border-[#292520]">
                      <tr className="text-[#7e7464] uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Garment</th>
                        <th className="py-3 px-4">Colour</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Current Stock</th>
                        <th className="py-3 px-4">Quick Adjust</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221f1a] text-[#cfc7b8]">
                      {products.flatMap((prod) =>
                        prod.variants.map((v) => (
                          <tr key={v.id} className="hover:bg-[#1a1714]">
                            <td className="py-2.5 px-4 font-serif text-white">{prod.title}</td>
                            <td className="py-2.5 px-4">{v.colour || prod.colour || "—"}</td>
                            <td className="py-2.5 px-4 font-medium text-white">{v.size}</td>
                            <td className="py-2.5 px-4 font-mono text-[11px] text-[#8e8473]">
                              {v.sku || `${prod.slug}-${v.size}`.toUpperCase()}
                            </td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`font-mono text-sm px-2 py-0.5 rounded-[1px] ${
                                  v.stock === 0
                                    ? "bg-[#331818] text-[#e06868]"
                                    : v.stock <= 4
                                    ? "bg-[#332b18] text-[#e0b468]"
                                    : "bg-[#1d2719] text-[#78d074]"
                                }`}
                              >
                                {v.stock} in stock
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    updateVariantStock(prod.id, v.id, v.stock - 1);
                                    toast.info(`Decreased ${prod.title} (${v.size}) stock to ${v.stock - 1}`);
                                  }}
                                  className="w-7 h-7 bg-[#24201a] text-white border border-[#3a342a] hover:bg-[#332d23] flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => {
                                    updateVariantStock(prod.id, v.id, v.stock + 5);
                                    toast.success(`Added +5 to ${prod.title} (${v.size}) stock.`);
                                  }}
                                  className="px-2 h-7 bg-[#24201a] text-white border border-[#3a342a] hover:bg-[#332d23] text-xs"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => {
                                    updateVariantStock(prod.id, v.id, v.stock + 10);
                                    toast.success(`Added +10 to ${prod.title} (${v.size}) stock.`);
                                  }}
                                  className="px-2 h-7 bg-[#24201a] text-white border border-[#3a342a] hover:bg-[#332d23] text-xs"
                                >
                                  +10
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS FULFILLMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="font-serif text-3xl font-light text-white mb-1">Customer Orders</h2>
                <p className="text-xs text-[#8e8473]">
                  Update order tracking, payment verification, and fulfillment stages.
                </p>
              </div>

              <div className="bg-[#171513] border border-[#292520] rounded-[2px] overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#292520] text-[#7e7464] uppercase text-[10px] tracking-wider bg-[#13110f]">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4">Tracking Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#221f1a] text-[#cfc7b8]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#1a1714]">
                        <td className="py-3 px-4 font-mono text-white font-medium">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-white block">{ord.customerName}</span>
                          <span className="text-[#7d7363] text-[11px]">{ord.customerEmail}</span>
                        </td>
                        <td className="py-3 px-4">{ord.date}</td>
                        <td className="py-3 px-4 font-mono text-white">
                          {formatPrice(ord.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setOrders((prev) =>
                                prev.map((o) =>
                                  o.id === ord.id ? { ...o, orderStatus: newStatus } : o
                                )
                              );
                              toast.success(`Updated ${ord.orderNumber} status to ${newStatus}`);
                            }}
                            className="bg-[#24201a] border border-[#3e382d] text-xs text-white px-2 py-1 rounded-[1px]"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#8e8473]">
                          {ord.trackingNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA & PHOTOGRAPHS */}
          {activeTab === "media" && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="font-serif text-3xl font-light text-white mb-1">
                  Media & Real Photographs Library
                </h2>
                <p className="text-xs text-[#8e8473]">
                  Store owner direct image repository. This is the official gateway for genuine product photography.
                </p>
              </div>

              {/* Add image URL or upload */}
              <div className="p-6 bg-[#171513] border border-[#292520] rounded-[2px] space-y-4">
                <h3 className="font-serif text-lg font-light text-white">Add New Studio Asset</h3>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter high-resolution direct image URL (https://...)"
                    className="flex-1 bg-[#221f1a] border border-[#3a342b] px-4 py-2.5 text-xs text-white placeholder-[#706655] focus:outline-none focus:border-[#c2b7a4]"
                  />
                  <button
                    onClick={() => {
                      if (!newImageUrl) return;
                      const newMedia = {
                        id: "m-" + Date.now(),
                        name: "Uploaded Studio Photograph",
                        url: newImageUrl,
                        date: new Date().toISOString().split("T")[0],
                      };
                      setMediaItems([newMedia, ...mediaItems]);
                      setNewImageUrl("");
                      toast.success("Image URL added to media library!");
                    }}
                    className="px-6 py-2.5 bg-[#e8e2d5] text-[#12100e] text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:bg-white transition-colors"
                  >
                    Add Asset
                  </button>
                </div>
              </div>

              {/* Media Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {mediaItems.map((m) => (
                  <div key={m.id} className="bg-[#171513] border border-[#292520] p-3 rounded-[2px] space-y-2">
                    <div className="w-full aspect-[3/4] bg-[#221f1a] overflow-hidden rounded-[1px]">
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-[#cfc7b8] line-clamp-1 block">{m.name}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(m.url);
                        toast.success("Image URL copied to clipboard!");
                      }}
                      className="w-full py-1.5 text-[10px] uppercase tracking-wider bg-[#24201a] hover:bg-[#302b23] text-white border border-[#3b3429] rounded-[1px]"
                    >
                      Copy URL
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DISCOUNTS & COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif text-3xl font-light text-white mb-1">
                  Discounts & Promo Codes
                </h2>
                <p className="text-xs text-[#8e8473]">
                  Create discount codes for seasonal promotions and welcome offerings.
                </p>
              </div>

              {/* Add Coupon */}
              <div className="p-6 bg-[#171513] border border-[#292520] rounded-[2px] flex gap-3 text-xs">
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="Coupon Code (e.g. VIP20)"
                  className="flex-1 bg-[#221f1a] border border-[#3a342b] px-3.5 py-2.5 text-white uppercase"
                />
                <input
                  type="number"
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(e.target.value)}
                  placeholder="% Off (e.g. 15)"
                  className="w-32 bg-[#221f1a] border border-[#3a342b] px-3.5 py-2.5 text-white"
                />
                <button
                  onClick={() => {
                    if (!newCouponCode || !newCouponValue) return;
                    setCoupons([
                      ...coupons,
                      {
                        code: newCouponCode.toUpperCase(),
                        type: "percent",
                        value: Number(newCouponValue),
                        minOrder: 0,
                        isActive: true,
                      },
                    ]);
                    setNewCouponCode("");
                    setNewCouponValue("");
                    toast.success("Coupon code created!");
                  }}
                  className="px-6 py-2.5 bg-[#e8e2d5] text-[#141210] uppercase font-semibold tracking-wider"
                >
                  Create
                </button>
              </div>

              <div className="bg-[#171513] border border-[#292520] rounded-[2px] overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#292520] text-[#7e7464] uppercase text-[10px] tracking-wider bg-[#13110f]">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Min. Order</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#221f1a] text-[#cfc7b8]">
                    {coupons.map((c) => (
                      <tr key={c.code}>
                        <td className="py-3 px-4 font-mono font-medium text-white">{c.code}</td>
                        <td className="py-3 px-4">
                          {c.type === "percent" ? `${c.value}% Off` : `₹${c.value} Flat Off`}
                        </td>
                        <td className="py-3 px-4 font-mono">{formatPrice(c.minOrder)}</td>
                        <td className="py-3 px-4">
                          <span className="text-[#59be66] bg-[#1a2d1d] px-2 py-0.5 rounded-[1px] text-[10px] uppercase font-medium">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: HOMEPAGE CMS */}
          {activeTab === "homepage_cms" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="font-serif text-3xl font-light text-white mb-1">
                  Homepage & Announcement CMS
                </h2>
                <p className="text-xs text-[#8e8473]">
                  Manage storefront content, hero headings, and promotional banners dynamically.
                </p>
              </div>

              {/* 1. Announcement Bar */}
              <div className="p-6 bg-[#171513] border border-[#292520] rounded-[2px] space-y-4 text-xs">
                <h3 className="font-serif text-lg font-light text-white pb-2 border-b border-[#292520]">
                  Top Announcement Bar
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#827766] uppercase text-[10px] mb-1">
                      Announcement Message
                    </label>
                    <input
                      type="text"
                      value={announcement.text}
                      onChange={(e) => updateAnnouncement({ text: e.target.value })}
                      className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[#827766] uppercase text-[10px] mb-1">
                        CTA Link Label
                      </label>
                      <input
                        type="text"
                        value={announcement.cta_label || ""}
                        onChange={(e) => updateAnnouncement({ cta_label: e.target.value })}
                        className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[#827766] uppercase text-[10px] mb-1">
                        CTA Destination URL
                      </label>
                      <input
                        type="text"
                        value={announcement.cta_href || ""}
                        onChange={(e) => updateAnnouncement({ cta_href: e.target.value })}
                        className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Hero Section */}
              <div className="p-6 bg-[#171513] border border-[#292520] rounded-[2px] space-y-4 text-xs">
                <h3 className="font-serif text-lg font-light text-white pb-2 border-b border-[#292520]">
                  Main Hero Banner
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#827766] uppercase text-[10px] mb-1">
                      Eyebrow Headline
                    </label>
                    <input
                      type="text"
                      value={hero.eyebrow || ""}
                      onChange={(e) => updateHero({ eyebrow: e.target.value })}
                      className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#827766] uppercase text-[10px] mb-1">
                      Hero Primary Heading
                    </label>
                    <input
                      type="text"
                      value={hero.heading}
                      onChange={(e) => updateHero({ heading: e.target.value })}
                      className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#827766] uppercase text-[10px] mb-1">
                      Hero Narrative Body
                    </label>
                    <textarea
                      rows={3}
                      value={hero.body || ""}
                      onChange={(e) => updateHero({ body: e.target.value })}
                      className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#827766] uppercase text-[10px] mb-1">
                      Hero Image URL (Leave blank to use Premium Neutral Placeholder)
                    </label>
                    <input
                      type="url"
                      value={hero.image_url || ""}
                      onChange={(e) => updateHero({ image_url: e.target.value || null })}
                      placeholder="https://..."
                      className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Brand Story Editorial */}
              <div className="p-6 bg-[#171513] border border-[#292520] rounded-[2px] space-y-4 text-xs">
                <h3 className="font-serif text-lg font-light text-white pb-2 border-b border-[#292520]">
                  Brand Story & Manifesto
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#827766] uppercase text-[10px] mb-1">
                      Manifesto Title
                    </label>
                    <input
                      type="text"
                      value={brandStory.heading}
                      onChange={(e) => updateBrandStory({ heading: e.target.value })}
                      className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#827766] uppercase text-[10px] mb-1">
                      Manifesto Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={brandStory.body}
                      onChange={(e) => updateBrandStory({ body: e.target.value })}
                      className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => toast.success("CMS settings saved and published!")}
                  className="px-8 py-3 bg-[#e8e2d5] text-[#141210] uppercase font-semibold tracking-wider text-xs"
                >
                  Save & Publish Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <ProductFormModal
          product={selectedProdForEdit}
          onClose={() => setIsProductModalOpen(false)}
          onSave={(prodData) => {
            if (selectedProdForEdit) {
              updateProduct(selectedProdForEdit.id, prodData);
              toast.success("Garment updated successfully!");
            } else {
              addProduct(prodData);
              toast.success("New garment created in catalogue!");
            }
            setIsProductModalOpen(false);
          }}
          onAddImage={addImageToProduct}
          onRemoveImage={removeImageFromProduct}
        />
      )}
    </div>
  );
}

// Sub-Component: Comprehensive Product Form Modal
interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: any) => void;
  onAddImage: (prodId: string, url: string) => void;
  onRemoveImage: (prodId: string, imgId: string) => void;
}

function ProductFormModal({
  product,
  onClose,
  onSave,
  onAddImage,
  onRemoveImage,
}: ProductFormModalProps) {
  const [title, setTitle] = useState(product?.title || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [subtitle, setSubtitle] = useState(product?.subtitle || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "4999");
  const [comparePrice, setComparePrice] = useState(product?.compare_at_price?.toString() || "");
  const [category, setCategory] = useState(product?.category_slug || "men");
  const [fabric, setFabric] = useState(product?.fabric || "European Linen");
  const [fit, setFit] = useState(product?.fit || "Relaxed");
  const [colour, setColour] = useState(product?.colour || "Ecru");
  const [care, setCare] = useState(product?.care || "Dry clean or gentle cold wash.");
  const [isNew, setIsNew] = useState(product?.is_new ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);

  const [imageUrlInput, setImageUrlInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const payload = {
      title,
      slug: finalSlug,
      subtitle: subtitle || `${colour} · ${fabric}`,
      description,
      price: Number(price),
      compare_at_price: comparePrice ? Number(comparePrice) : null,
      currency: "INR",
      category_slug: category,
      colour,
      fabric,
      fit,
      care,
      is_new: isNew,
      is_featured: isFeatured,
      is_active: true,
      rating: product?.rating || 4.7,
      review_count: product?.review_count || 14,
      images: product?.images || [],
      variants: product?.variants || [
        { id: "v-" + Date.now() + "-1", size: "S", colour, sku: `TST-${finalSlug}-S`, stock: 10 },
        { id: "v-" + Date.now() + "-2", size: "M", colour, sku: `TST-${finalSlug}-M`, stock: 15 },
        { id: "v-" + Date.now() + "-3", size: "L", colour, sku: `TST-${finalSlug}-L`, stock: 12 },
      ],
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-[#171513] border border-[#38332b] rounded-[2px] shadow-2xl max-h-[90vh] flex flex-col text-xs text-[#cfc7b8]">
        <div className="px-6 py-4 border-b border-[#2c2822] flex justify-between items-center bg-[#13110f]">
          <h3 className="font-serif text-xl font-light text-white">
            {product ? `Edit Garment: ${product.title}` : "Add New Garment to Studio"}
          </h3>
          <button onClick={onClose} className="p-1 text-[#887e6d] hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">
                Garment Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">Slug URL</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-title"
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="footwear">Footwear</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">
                Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">
                Compare-at (Original Price)
              </label>
              <input
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="Optional"
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8e8473] uppercase text-[10px] mb-1">
              Description & Craftsmanship Story
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">Fabric</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">Silhouette / Fit</label>
              <input
                type="text"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-[#8e8473] uppercase text-[10px] mb-1">Primary Colour</label>
              <input
                type="text"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                className="w-full bg-[#221f1a] border border-[#3a342b] p-2.5 text-white"
              />
            </div>
          </div>

          {/* Real Photography Upload / Image URL Manager */}
          {product && (
            <div className="pt-4 border-t border-[#292520] space-y-3">
              <h4 className="font-serif text-sm font-normal text-white">
                Genuine Product Photography
              </h4>
              <p className="text-[11px] text-[#7d7363]">
                If no images are provided, this garment gracefully displays the studio geometric placeholder.
              </p>

              {/* Existing Images */}
              {product.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto py-2">
                  {product.images.map((img) => (
                    <div key={img.id} className="relative w-20 aspect-[3/4] border border-[#3a342a] overflow-hidden group flex-shrink-0">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(product.id, img.id)}
                        className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 rounded-full hover:bg-black"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add direct image URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste direct high-res photo URL..."
                  className="flex-1 bg-[#221f1a] border border-[#3a342b] p-2 text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!imageUrlInput) return;
                    onAddImage(product.id, imageUrlInput);
                    setImageUrlInput("");
                    toast.success("Image attached to garment!");
                  }}
                  className="px-4 py-2 bg-[#2d2822] hover:bg-[#38322a] text-white uppercase text-[10px] tracking-wider"
                >
                  Attach Photo
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="accent-[#e8e2d5]"
              />
              <span className="text-white">Flag as New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#e8e2d5]"
              />
              <span className="text-white">Flag as Studio Featured</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[#292520] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#3a342a] text-[#a39886] hover:text-white uppercase tracking-wider text-[10px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#e8e2d5] text-[#12100e] hover:bg-white uppercase tracking-wider font-semibold text-[10px]"
            >
              Save Garment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
