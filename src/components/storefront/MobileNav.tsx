import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { NAV_GROUPS } from "../../lib/navigation";
import { useAuth } from "../../context/AuthContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  if (!isOpen) return null;

  const toggleSection = (slug: string) => {
    setExpandedSlug(expandedSlug === slug ? null : slug);
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm bg-[#fbf9f5] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Header with Logo and Close */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eae4d8]">
          <Link
            to="/"
            onClick={onClose}
            className="font-serif text-2xl tracking-[0.2em] font-light text-[#1a1815]"
          >
            TESTER
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5e5547] hover:text-[#111] transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Categories Accordion */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#ece7dc]">
          {NAV_GROUPS.map((group) => {
            const isExpanded = expandedSlug === group.slug;
            const isSale = group.slug === "sale";

            return (
              <div key={group.slug} className="py-3">
                <div className="flex items-center justify-between">
                  <Link
                    to={group.slug === "gift-card" ? "/gift-card" : `/category/${group.slug}`}
                    onClick={onClose}
                    className={`text-sm font-sans tracking-[0.18em] uppercase font-medium ${
                      isSale ? "text-[#a32828]" : "text-[#282521]"
                    }`}
                  >
                    {group.label}
                  </Link>

                  <button
                    onClick={() => toggleSection(group.slug)}
                    className="p-2 text-[#736858] hover:text-[#111]"
                    aria-label={`Toggle ${group.label} subcategories`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Subcategories */}
                {isExpanded && (
                  <div className="mt-2.5 pl-3 space-y-2.5 border-l border-[#dfd8cb] py-1">
                    {group.columns.flatMap((col) => col.items).map((subItem) => (
                      <Link
                        key={subItem.slug}
                        to={
                          group.slug === "gift-card"
                            ? "/gift-card"
                            : `/category/${group.slug}?sub=${encodeURIComponent(subItem.label)}`
                        }
                        onClick={onClose}
                        className="block text-xs font-sans text-[#5c5344] hover:text-[#000] py-0.5"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Utility Links (Account, Wishlist, Orders, Admin) */}
        <div className="p-6 bg-[#f4f0e8] border-t border-[#eae4d8] space-y-3 text-xs font-sans">
          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center gap-2.5 text-[#3e372e] hover:text-black"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{user ? `Account (${user.fullName})` : "Sign In / Register"}</span>
          </Link>

          <Link
            to="/account?tab=wishlist"
            onClick={onClose}
            className="flex items-center gap-2.5 text-[#3e372e] hover:text-black"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Saved Items / Wishlist</span>
          </Link>

          <Link
            to="/account?tab=orders"
            onClick={onClose}
            className="flex items-center gap-2.5 text-[#3e372e] hover:text-black"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Order History</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={onClose}
              className="flex items-center gap-2.5 text-[#8f2b2b] font-medium hover:text-black pt-1 border-t border-[#dfd8cb]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin Studio Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
