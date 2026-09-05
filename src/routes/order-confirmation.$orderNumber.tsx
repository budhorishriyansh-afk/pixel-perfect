import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { formatPrice } from "../lib/format";

export const Route = createFileRoute("/order-confirmation/$orderNumber")({
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { orderNumber } = useParams({ from: "/order-confirmation/$orderNumber" });

  // Read order from local storage if placed in current session
  let orderData: any = null;
  if (typeof window !== "undefined") {
    try {
      const orders = JSON.parse(localStorage.getItem("tester_customer_orders") || "[]");
      orderData = orders.find((o: any) => o.orderNumber === orderNumber);
    } catch {}
  }

  const items = orderData?.items || [
    {
      title: "Tailored Linen Shirt",
      color: "Ecru",
      size: "M",
      quantity: 1,
      price: 4999,
    },
  ];
  const total = orderData?.total || 4999;
  const address = orderData?.shippingAddress || {
    fullName: "Alexander Wright",
    line1: "Flat 4B, The Oberoi Enclave, Golf Links",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110003",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ede8dc] border border-[#ded8cb] flex items-center justify-center text-[#2a2620]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-2">
            TRANSMISSION CONFIRMED
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1c1a17] mb-2">
            Thank you for your order
          </h1>
          <p className="text-xs sm:text-sm text-[#665c4d] font-light leading-relaxed">
            Your studio dispatch reference is <strong className="font-mono text-black font-semibold">{orderNumber}</strong>.
            A confirmation dispatch receipt has been recorded for your account.
          </p>
        </div>

        {/* Order Status Progress Steps */}
        <div className="p-6 sm:p-8 bg-[#f7f5ee] border border-[#e4ded0] rounded-[2px] mb-10">
          <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-medium text-[#736857] mb-6">
            Studio Fulfillment Journey
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-sans">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#1e1c19] text-[#f7f5f0] flex items-center justify-center font-bold mb-2">
                ✓
              </div>
              <span className="font-medium text-[#1e1c19]">Confirmed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#3d3830] text-[#f7f5f0] flex items-center justify-center font-bold mb-2">
                2
              </div>
              <span className="font-medium text-[#1e1c19]">Preparing</span>
            </div>
            <div className="flex flex-col items-center opacity-45">
              <div className="w-8 h-8 rounded-full border border-[#9b907f] text-[#6d6455] flex items-center justify-center mb-2">
                3
              </div>
              <span>Dispatched</span>
            </div>
            <div className="flex flex-col items-center opacity-45">
              <div className="w-8 h-8 rounded-full border border-[#9b907f] text-[#6d6455] flex items-center justify-center mb-2">
                4
              </div>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-6 sm:p-8 bg-white border border-[#e8e2d5] rounded-[2px] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-[#ece6d9] gap-4">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-wider text-[#857a69] block mb-1">
                Destination Address
              </span>
              <h4 className="font-serif text-lg text-[#1e1c19] font-normal">{address.fullName}</h4>
              <p className="text-xs text-[#635b4c] font-sans leading-relaxed">
                {address.line1}, {address.city}, {address.state} {address.postalCode}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-sans uppercase tracking-wider text-[#857a69] block mb-1">
                Estimated Delivery
              </span>
              <p className="font-serif text-lg text-[#1e1c19]">2–4 Business Days</p>
              <span className="text-xs text-[#2e6d36] font-sans">Complimentary Studio Express</span>
            </div>
          </div>

          {/* Garments List */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-[#736857] mb-4">
              Garments in Shipment
            </h4>
            <div className="divide-y divide-[#eee9df]">
              {items.map((it: any, i: number) => (
                <div key={i} className="py-3 flex justify-between items-center text-xs font-sans">
                  <div>
                    <strong className="font-serif text-sm font-normal text-[#1e1c19] block">
                      {it.title}
                    </strong>
                    <span className="text-[11px] text-[#786e5e]">
                      {it.color} · Size: {it.size} · Qty: {it.quantity}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-[#1e1c19]">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#ece6d9] flex justify-between items-center text-sm font-medium">
            <span>Total Paid</span>
            <span className="font-mono text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-xs font-sans uppercase tracking-[0.2em]">
          <Link
            to="/"
            className="px-8 py-3.5 bg-[#1e1c19] text-[#f7f5f0] font-medium hover:bg-black transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/account?tab=orders"
            className="px-8 py-3.5 border border-[#1e1c19] text-[#1e1c19] font-medium hover:bg-[#f2ece1] transition-colors"
          >
            View Account Orders
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
