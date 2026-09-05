import React, { useState } from "react";
import { Link } from "@tanstack/react-router";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#181614] text-[#cfc8bc] pt-16 pb-12 border-t border-[#292622]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Strip */}
        <div className="pb-16 border-b border-[#2e2a25] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#a89f8f] font-sans font-medium block mb-2">
              DISPATCHES FROM THE STUDIO
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#f7f5f0] tracking-tight mb-2">
              Join the TESTER list
            </h3>
            <p className="text-xs text-[#9c9384] font-light max-w-md leading-relaxed">
              Receive private invitations to seasonal previews, studio notes, and bespoke editorial releases.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 bg-[#26231f] border border-[#3e3933] rounded-[1px] text-xs text-[#e8e4dc]">
                ✓ Thank you for subscribing. We look forward to sharing our latest dispatches with you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-[#23201d] border border-[#3d3831] px-4 py-3 text-xs text-[#f7f5f0] placeholder-[#786f61] focus:outline-none focus:border-[#c2b7a4] rounded-[1px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#e8e4dc] hover:bg-white text-[#181614] text-xs font-sans tracking-[0.2em] uppercase font-medium rounded-[1px] transition-colors"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 5-Column Navigation Links */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs font-sans">
          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#f7f5f0] font-medium mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-2.5 text-[#9e9587]">
              <li><Link to="/category/men" className="hover:text-white transition-colors">Men's Wardrobe</Link></li>
              <li><Link to="/category/women" className="hover:text-white transition-colors">Women's Silhouettes</Link></li>
              <li><Link to="/category/kids" className="hover:text-white transition-colors">Kids & Youth</Link></li>
              <li><Link to="/category/footwear" className="hover:text-white transition-colors">Handcrafted Footwear</Link></li>
              <li><Link to="/category/accessories" className="hover:text-white transition-colors">Leather & Accessories</Link></li>
              <li><Link to="/collections/sale" className="text-[#d46a6a] hover:text-white transition-colors">Seasonal Archive Sale</Link></li>
              <li><Link to="/gift-card" className="hover:text-white transition-colors">Studio Gift Cards</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#f7f5f0] font-medium mb-4">
              THE BRAND
            </h4>
            <ul className="space-y-2.5 text-[#9e9587]">
              <li><Link to="/about" className="hover:text-white transition-colors">About TESTER</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Philosophy</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Material Sourcing</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Studio Journal</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Sustainability Stance</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#f7f5f0] font-medium mb-4">
              CONCIERGE
            </h4>
            <ul className="space-y-2.5 text-[#9e9587]">
              <li><Link to="/account" className="hover:text-white transition-colors">Client Services</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><span className="text-[#756c5e] cursor-default">Complimentary Shipping</span></li>
              <li><span className="text-[#756c5e] cursor-default">Returns & Exchanges</span></li>
              <li><span className="text-[#756c5e] cursor-default">Garment Care Guide</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#f7f5f0] font-medium mb-4">
              LEGAL & PRIVACY
            </h4>
            <ul className="space-y-2.5 text-[#9e9587]">
              <li><span className="text-[#756c5e] cursor-default">Terms & Conditions</span></li>
              <li><span className="text-[#756c5e] cursor-default">Privacy Policy</span></li>
              <li><span className="text-[#756c5e] cursor-default">Cookie Preferences</span></li>
              <li><span className="text-[#756c5e] cursor-default">Security Standards</span></li>
            </ul>
          </div>

          {/* Social & Directives */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#f7f5f0] font-medium mb-4">
              CONNECTED
            </h4>
            <ul className="space-y-2.5 text-[#9e9587]">
              <li><a href="#instagram" className="hover:text-white transition-colors">Instagram Studio</a></li>
              <li><a href="#pinterest" className="hover:text-white transition-colors">Pinterest Moodboard</a></li>
              <li><a href="#editorial" className="hover:text-white transition-colors">Vogue Runway Notes</a></li>
            </ul>

            <div className="pt-4">
              <span className="text-[10px] text-[#786f60] uppercase tracking-wider block mb-1">
                CURRENCY
              </span>
              <span className="text-xs text-[#cfc8bc] font-mono">
                INR (₹) · India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & wordmark */}
        <div className="pt-8 border-t border-[#292520] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7a7161]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-[0.2em] font-light text-[#ece6dc]">
              TESTER
            </span>
            <span>© {new Date().getFullYear()} TESTER Atelier. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase">
            <span>PREMIUM CONTEMPORARY FASHION</span>
            <span>·</span>
            <span>NEW DELHI / MUMBAI / MILAN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
