import React, { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { NAV_GROUPS, NavGroup } from "../../lib/navigation";

export const MegaMenu: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<NavGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveGroup(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveGroup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:block"
      onMouseLeave={() => setActiveGroup(null)}
    >
      <nav className="flex items-center justify-center space-x-8 py-3.5 border-t border-b border-[#e8e4dc]/70">
        {NAV_GROUPS.map((group) => {
          const isOpen = activeGroup?.slug === group.slug;
          const isSale = group.slug === "sale";

          return (
            <div
              key={group.slug}
              className="relative py-1"
              onMouseEnter={() => setActiveGroup(group)}
            >
              <Link
                to={group.slug === "gift-card" ? "/gift-card" : `/category/${group.slug}`}
                onClick={() => setActiveGroup(isOpen ? null : group)}
                className={`text-[11px] font-sans uppercase tracking-[0.22em] font-medium transition-colors duration-200 py-1 border-b-2 ${
                  isOpen
                    ? "border-[#1e1c19] text-[#1e1c19]"
                    : "border-transparent text-[#443e35] hover:text-[#111]"
                } ${isSale ? "!text-[#a32828] font-semibold" : ""}`}
              >
                {group.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Mega Menu Dropdown */}
      {activeGroup && (
        <div
          className="absolute left-0 right-0 top-full w-full bg-[#fdfcf9] border-b border-[#e2dcd0] shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
          onMouseEnter={() => setActiveGroup(activeGroup)}
        >
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-8">
              {/* Category columns */}
              {activeGroup.columns.map((col, idx) => (
                <div key={idx} className="space-y-3">
                  {col.heading && (
                    <h4 className="text-[10px] tracking-[0.25em] font-sans font-semibold uppercase text-[#8c8273] border-b border-[#ede9e0] pb-1.5">
                      {col.heading}
                    </h4>
                  )}
                  <ul className="space-y-2.5">
                    {col.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          to={
                            activeGroup.slug === "gift-card"
                              ? item.slug === "gift-card"
                                ? "/gift-card"
                                : `/gift-card?tab=${item.slug.replace("gift-card-", "")}`
                              : `/category/${activeGroup.slug}?sub=${encodeURIComponent(item.label)}`
                          }
                          onClick={() => setActiveGroup(null)}
                          className="text-xs font-sans text-[#4a443b] hover:text-[#000] hover:translate-x-1 inline-block transition-transform duration-150"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Curated Editorial Callout on the right */}
              <div className="col-span-1 border-l border-[#ede9e0] pl-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8c8273] font-sans font-medium block mb-2">
                    COLLECTION NOTE
                  </span>
                  <h4 className="font-serif text-lg text-[#1f1d1a] font-normal leading-snug mb-2">
                    {activeGroup.label} Studio Archive
                  </h4>
                  <p className="text-xs text-[#6e6456] leading-relaxed font-light mb-4">
                    Explore considered proportions and natural fibers designed for contemporary living.
                  </p>
                </div>
                <Link
                  to={activeGroup.slug === "gift-card" ? "/gift-card" : `/category/${activeGroup.slug}`}
                  onClick={() => setActiveGroup(null)}
                  className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-[#1e1c19] border-b border-[#1e1c19] pb-0.5 hover:gap-3 transition-all"
                >
                  <span>VIEW ALL {activeGroup.label.toUpperCase()}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
