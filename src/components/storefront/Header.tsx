import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AnnouncementBar } from "./AnnouncementBar";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchOverlay } from "./SearchOverlay";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, toggleAdminDemo } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#fcfbf9]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-b border-[#e6e0d4]"
            : "bg-[#fcfbf9] border-b border-[#eae4d8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile menu toggle + Desktop helper link */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 -ml-2 text-[#35312a] lg:hidden hover:text-black focus:outline-none"
                aria-label="Open mobile menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Quick direct links for desktop */}
              <div className="hidden lg:flex items-center space-x-6 text-[11px] font-sans tracking-[0.2em] uppercase text-[#615749]">
                <Link to="/collections/new-arrivals" className="hover:text-black transition-colors">
                  NEW IN
                </Link>
                <Link to="/collections/sale" className="text-[#a32828] font-semibold hover:opacity-80 transition-opacity">
                  SALE
                </Link>
              </div>
            </div>

            {/* Center: Prominent Brand Logo */}
            <div className="flex-shrink-0 text-center">
              <Link
                to="/"
                className="inline-block font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.22em] font-light text-[#1b1916] hover:opacity-90 transition-opacity"
              >
                TESTER
              </Link>
              <span className="block text-[8px] tracking-[0.35em] text-[#867b6b] uppercase font-sans font-normal -mt-0.5">
                STUDIO WARDROBE
              </span>
            </div>

            {/* Right: Actions (Search, Wishlist, Account, Cart) */}
            <div className="flex items-center justify-end space-x-1 sm:space-x-3 flex-1">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#3d372e] hover:text-black transition-colors rounded-sm flex items-center gap-1.5"
                aria-label="Search catalogue"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-[11px] font-sans uppercase tracking-[0.18em] hidden xl:inline-block">
                  Search
                </span>
              </button>

              {/* Wishlist */}
              <Link
                to="/account?tab=wishlist"
                className="relative p-2 text-[#3d372e] hover:text-black transition-colors"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1b1916] text-[#f7f5f0] text-[9px] font-mono font-medium flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              <Link
                to={user ? "/account" : "/auth"}
                className="p-2 text-[#3d372e] hover:text-black transition-colors hidden sm:block"
                aria-label="Account"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              {/* Admin Quick Switcher badge for testing */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:inline-flex items-center px-2 py-0.5 text-[10px] font-sans tracking-[0.18em] uppercase bg-[#1f1d1a] text-[#f7f5f0] rounded-[1px] hover:bg-black transition-colors"
                >
                  Admin
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={openCartDrawer}
                className="relative p-2 text-[#3d372e] hover:text-black transition-colors flex items-center gap-1.5"
                aria-label={`Shopping bag (${itemCount} items)`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#1b1916] text-[#f7f5f0] text-[9px] font-mono font-medium flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="text-[11px] font-sans uppercase tracking-[0.18em] hidden xl:inline-block">
                  Bag
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Mega Menu Navigation Row */}
          <MegaMenu />
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
