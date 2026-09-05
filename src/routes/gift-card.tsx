import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { formatPrice } from "../lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/gift-card")({
  component: GiftCardPage,
});

const DENOMINATIONS = [1000, 2500, 5000, 10000];

function GiftCardPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");

  // Balance checker state
  const [checkCode, setCheckCode] = useState("");
  const [checkedBalance, setCheckedBalance] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast.error("Please provide a recipient email address.");
      return;
    }
    toast.success(
      `TESTER Digital Gift Card for ${formatPrice(effectiveAmount)} prepared for ${recipientName || recipientEmail}!`
    );
  };

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkCode) return;
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // Demo validation: if code ends in 5 or 0, give sample balance
      if (checkCode.toUpperCase().includes("TST")) {
        setCheckedBalance(5000);
      } else {
        setCheckedBalance(0);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-2">
            STUDIO PRIVILEGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1c1a17] mb-3">
            Digital Gift Cards
          </h1>
          <p className="text-xs sm:text-sm text-[#6d6353] font-light leading-relaxed">
            Give the freedom of choice across our full wardrobe of contemporary tailoring, fine knitwear, and handcrafted leather goods.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Card Visual Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#1e1c19] to-[#2e2a25] text-[#f7f5f0] p-8 rounded-[2px] shadow-xl flex flex-col justify-between border border-[#3e3933]">
              <div className="flex justify-between items-start">
                <span className="font-serif text-2xl tracking-[0.25em] font-light">TESTER</span>
                <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#b8b0a2]">
                  DIGITAL ATELIER PASS
                </span>
              </div>

              <div>
                <span className="text-[10px] font-sans tracking-[0.2em] text-[#a89f90] block uppercase mb-1">
                  Denomination
                </span>
                <span className="font-mono text-3xl font-light text-[#f7f5f0]">
                  {formatPrice(effectiveAmount)}
                </span>
              </div>

              <div className="flex justify-between items-end text-[10px] font-sans text-[#a89f90] tracking-wider uppercase">
                <span>{recipientName ? `FOR: ${recipientName}` : "FOR: ESTEEMED CLIENT"}</span>
                <span>NO EXPIRATION</span>
              </div>
            </div>
          </div>

          {/* Configuration Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePurchase} className="space-y-6 bg-white p-6 sm:p-8 border border-[#e8e2d5] rounded-[2px]">
              <h3 className="font-serif text-xl font-normal text-[#1e1c19] pb-3 border-b border-[#ece6da]">
                Select Denomination
              </h3>

              {/* Denomination Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DENOMINATIONS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`py-3 text-xs font-sans font-medium rounded-[1px] border transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? "bg-[#1f1d1a] text-[#f7f5f0] border-[#1f1d1a]"
                        : "bg-[#fcfbf9] text-[#2d2822] border-[#ded7ca] hover:border-black"
                    }`}
                  >
                    {formatPrice(amount)}
                  </button>
                ))}
              </div>

              {/* Recipient Details */}
              <div className="space-y-4 pt-4 border-t border-[#ece6da] text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#685e4f] mb-1 uppercase tracking-wider text-[10px]">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-[#fdfcf9] border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[#685e4f] mb-1 uppercase tracking-wider text-[10px]">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="w-full bg-[#fdfcf9] border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#685e4f] mb-1 uppercase tracking-wider text-[10px]">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-[#fdfcf9] border border-[#ded7ca] px-3.5 py-2.5 rounded-[1px] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#685e4f] mb-1 uppercase tracking-wider text-[10px]">
                    Personalized Note
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Wishing you elegance and comfort in every moment."
                    className="w-full bg-[#fdfcf9] border border-[#ded7ca] p-3 rounded-[1px] focus:outline-none focus:border-black text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#1f1d1a] hover:bg-black text-[#f7f5f0] text-xs font-sans tracking-[0.25em] uppercase font-medium rounded-[1px] transition-all"
              >
                PROCEED WITH GIFT CARD ({formatPrice(effectiveAmount)})
              </button>
            </form>
          </div>
        </div>

        {/* Gift Card Balance Verification Tool */}
        <section className="py-12 px-6 sm:px-10 bg-[#f7f5ee] border border-[#e4ded0] rounded-[2px] mb-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-2xl font-light text-[#1b1916] mb-2">
              Check Gift Card Balance
            </h3>
            <p className="text-xs text-[#6e6353] font-light mb-6">
              Enter your 16-character alphanumeric gift card code to view remaining credit.
            </p>

            <form onSubmit={handleCheckBalance} className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value)}
                placeholder="e.g. TST-GIFT-9982-1002"
                className="flex-1 bg-white border border-[#ded8cb] px-4 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-black rounded-[1px]"
              />
              <button
                type="submit"
                disabled={isChecking}
                className="px-6 py-2.5 bg-[#1f1d1a] text-[#f7f5f0] text-xs font-sans uppercase tracking-wider font-medium hover:bg-black rounded-[1px]"
              >
                {isChecking ? "Checking..." : "Verify"}
              </button>
            </form>

            {checkedBalance !== null && (
              <div className="mt-4 p-4 bg-white border border-[#ded7ca] rounded-[1px] text-xs font-sans">
                Available Card Balance:{" "}
                <strong className="font-mono text-sm text-[#1e1c19]">
                  {formatPrice(checkedBalance)}
                </strong>
              </div>
            )}
          </div>
        </section>

        {/* Gift Card FAQs */}
        <section className="max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl font-light text-[#1b1916] pb-3 border-b border-[#eae3d6] mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="divide-y divide-[#ece6da] text-xs font-sans text-[#5c5243]">
            <div className="py-4">
              <h4 className="font-medium text-[#1e1c19] mb-1">How are digital gift cards delivered?</h4>
              <p className="font-light leading-relaxed">
                Gift cards are issued immediately via encrypted digital pass to the recipient's email address, accompanied by your personal note and redemption code.
              </p>
            </div>
            <div className="py-4">
              <h4 className="font-medium text-[#1e1c19] mb-1">Do TESTER gift cards expire?</h4>
              <p className="font-light leading-relaxed">
                No, our gift cards hold their value indefinitely with zero depreciation or inactivity maintenance charges.
              </p>
            </div>
            <div className="py-4">
              <h4 className="font-medium text-[#1e1c19] mb-1">Can a gift card be used during promotional sales?</h4>
              <p className="font-light leading-relaxed">
                Yes, digital gift cards may be combined with promo codes and applied to all seasonal archive sales.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
