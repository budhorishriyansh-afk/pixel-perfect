import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useSiteCMS } from "../../hooks/useSiteCMS";

export const AnnouncementBar: React.FC = () => {
  const { announcement } = useSiteCMS();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("tester_announcement_dismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tester_announcement_dismissed", "true");
    }
  };

  if (!announcement.enabled || isDismissed) {
    return null;
  }

  return (
    <aside aria-label="Announcement" className="relative z-40 w-full bg-[#ede8df] text-[#363229] border-b border-[#ded7ca] text-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Empty left spacer to keep text perfectly centered */}
        <div className="w-6 hidden sm:block" />

        {/* Center message */}
        <div className="flex-1 text-center font-sans tracking-wide flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span>{announcement.text}</span>
          {announcement.cta_label && announcement.cta_href && (
            <Link
              to={announcement.cta_href}
              className="font-medium underline underline-offset-4 hover:text-[#111] transition-colors ml-1"
            >
              {announcement.cta_label} →
            </Link>
          )}
        </div>

        {/* Dismiss 'X' button */}
        <button
          onClick={handleDismiss}
          className="w-6 h-6 flex items-center justify-center text-[#736a5c] hover:text-[#111] transition-colors rounded-sm focus:outline-none focus:ring-1 focus:ring-[#736a5c]"
          aria-label="Close announcement"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
};
