import React from "react";

interface PremiumProductPlaceholderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  aspectRatio?: "portrait" | "square" | "landscape";
  showComingSoon?: boolean;
}

export const PremiumProductPlaceholder: React.FC<PremiumProductPlaceholderProps> = ({
  title,
  subtitle,
  className = "",
  aspectRatio = "portrait",
  showComingSoon = true,
}) => {
  const aspectClass =
    aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-[16/9]";

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-[#f4f2ee] border border-[#e8e4dc] flex flex-col items-center justify-between p-6 select-none transition-colors duration-300 group-hover:bg-[#eeeae2] ${className}`}
      aria-label={title ? `${title} placeholder` : "Product placeholder"}
    >
      {/* Subtle fine geometric corner accents */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#d3cdc2]" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#d3cdc2]" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#d3cdc2]" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#d3cdc2]" />

      {/* Subtle diagonal background weave */}
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, #bbb3a5 0px, #bbb3a5 1px, transparent 1px, transparent 10px)`,
        }}
      />

      {/* Top watermark */}
      <div className="relative z-10 w-full flex justify-between items-center text-[10px] tracking-[0.25em] text-[#8e8576] uppercase font-sans">
        <span>TESTER</span>
        <span>STUDIO</span>
      </div>

      {/* Center luxury monogram & camera icon */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4">
        <div className="w-12 h-12 mb-3 rounded-full border border-[#cfc8bc] flex items-center justify-center text-[#786e5f] bg-[#fbf9f6]/70 shadow-sm transition-transform duration-500 group-hover:scale-105">
          <svg
            className="w-5 h-5 text-[#857b6d]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
        </div>

        {title && (
          <h4 className="font-serif text-sm md:text-base font-normal tracking-wide text-[#34312c] max-w-[200px] line-clamp-1 mb-1">
            {title}
          </h4>
        )}

        {subtitle && (
          <p className="text-[11px] tracking-wider text-[#857b6d] uppercase font-sans mb-1">
            {subtitle}
          </p>
        )}

        {showComingSoon && (
          <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-[#9e9587] font-medium border-t border-[#dfdacd] pt-2 mt-1">
            Product image coming soon
          </span>
        )}
      </div>

      {/* Bottom subtle detail */}
      <div className="relative z-10 w-full flex justify-between items-center text-[9px] tracking-[0.2em] text-[#9e9587] uppercase font-sans">
        <span>ARCHIVE REF.</span>
        <span>NO. 01</span>
      </div>
    </div>
  );
};
