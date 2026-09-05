import React from "react";
import { Link } from "@tanstack/react-router";

interface PremiumHeroPlaceholderProps {
  imageUrl?: string | null;
  eyebrow?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const PremiumHeroPlaceholder: React.FC<PremiumHeroPlaceholderProps> = ({
  imageUrl,
  eyebrow = "Autumn / Winter Studio Collection",
  heading = "Uniquely Yours.",
  body = "Discover premium contemporary styles curated for the modern fashion connoisseur. Considered proportions, honest materials, and enduring silhouettes.",
  ctaLabel = "EXPLORE COLLECTION",
  ctaHref = "/collections/new-arrivals",
}) => {
  return (
    <section className="relative w-full min-h-[580px] md:min-h-[720px] overflow-hidden bg-[#e8e4dc] flex items-center justify-center border-b border-[#dad4c7]">
      {/* If real uploaded image is provided */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={heading}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.88]"
        />
      ) : (
        /* Intentional luxury editorial placeholder */
        <div className="absolute inset-0 bg-gradient-to-b from-[#efece5] via-[#e5e0d5] to-[#dbd5c8]">
          {/* Subtle architectural grid lines */}
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage: `linear-gradient(#bbb2a2 1px, transparent 1px), linear-gradient(90deg, #bbb2a2 1px, transparent 1px)`,
              backgroundSize: `80px 80px`,
            }}
          />

          {/* Large faint editorial watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="font-serif text-[18vw] font-light tracking-[0.15em] text-[#cec7b9]/40 leading-none">
              TESTER
            </span>
          </div>

          {/* Studio corner markings */}
          <div className="absolute top-8 left-8 text-[11px] tracking-[0.25em] text-[#827867] uppercase font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#827867]" />
            <span>STUDIO CAMPAIGN 2026</span>
          </div>
          <div className="absolute top-8 right-8 text-[11px] tracking-[0.25em] text-[#827867] uppercase font-sans hidden sm:block">
            <span>EDITORIAL PROJECTION</span>
          </div>
          <div className="absolute bottom-8 left-8 text-[10px] tracking-[0.2em] text-[#827867] uppercase font-sans hidden md:block">
            <span>PHOTOGRAPHY ASSETS CONFIGURED VIA ADMIN</span>
          </div>
        </div>
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />

      {/* Hero content card */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center flex flex-col items-center">
        {eyebrow && (
          <span className="inline-block text-[11px] md:text-xs tracking-[0.3em] uppercase text-[#3f392f] font-sans font-medium mb-4 px-3 py-1 border border-[#6b6252]/40 bg-[#fbf9f5]/85 rounded-[1px] backdrop-blur-sm">
            {eyebrow}
          </span>
        )}

        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-[#1c1a17] leading-[1.08] mb-6">
          {heading}
        </h1>

        {body && (
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-[#3f3a33] font-light leading-relaxed mb-8">
            {body}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={ctaHref}
            className="inline-flex items-center justify-center px-8 py-4 bg-[#1f1d1a] text-[#f7f5f0] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {ctaLabel}
          </Link>
          <Link
            to="/collections/sale"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#fcfbf9]/90 text-[#1f1d1a] border border-[#2a2620] text-xs font-sans tracking-[0.22em] uppercase font-medium rounded-[1px] hover:bg-[#f2ede4] transition-all duration-300 shadow-sm"
          >
            EXPLORE SALE
          </Link>
        </div>
      </div>
    </section>
  );
};
