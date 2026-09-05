import React from "react";
import { Link } from "@tanstack/react-router";

interface PremiumCategoryPlaceholderProps {
  title: string;
  subtitle?: string;
  slug: string;
  imageUrl?: string | null;
  count?: number;
}

export const PremiumCategoryPlaceholder: React.FC<PremiumCategoryPlaceholderProps> = ({
  title,
  subtitle,
  slug,
  imageUrl,
  count,
}) => {
  return (
    <Link
      to={`/category/${slug}`}
      className="group relative block w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[#eeeae2] border border-[#dfdacd] transition-all duration-500 hover:shadow-lg"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        /* Neutral luxury category canvas */
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f2ec] to-[#e4ded3] flex flex-col justify-between p-6 md:p-8 transition-colors duration-500 group-hover:bg-[#ebe5d9]">
          <div
            className="absolute inset-0 opacity-[0.18] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #a89f8e 0, #a89f8e 1px, transparent 0, transparent 16px)`,
            }}
          />

          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] tracking-[0.25em] text-[#867b6b] uppercase font-sans">
              CATEGORY ARCHIVE
            </span>
            {count !== undefined && (
              <span className="text-[10px] tracking-wider text-[#867b6b] font-mono">
                [{count.toString().padStart(2, "0")} PIECES]
              </span>
            )}
          </div>

          <div className="relative z-10 my-auto text-center px-4">
            <span className="inline-block w-8 h-[1px] bg-[#867b6b] mb-4 group-hover:w-16 transition-all duration-500" />
            <h3 className="font-serif text-2xl md:text-3xl font-light text-[#22201d] tracking-wide mb-2 group-hover:-translate-y-1 transition-transform duration-300">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#706657] font-sans font-light tracking-wider max-w-[220px] mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          <div className="relative z-10 flex justify-center items-center">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] text-[#22201d] uppercase font-medium border-b border-[#22201d] pb-1 group-hover:gap-3 transition-all duration-300">
              <span>EXPLORE</span>
              <span>→</span>
            </span>
          </div>
        </div>
      )}

      {/* Subtle hover vignette */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
    </Link>
  );
};
