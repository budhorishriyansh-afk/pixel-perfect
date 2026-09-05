import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";

export interface AnnouncementSettings {
  text: string;
  cta_label?: string;
  cta_href?: string;
  enabled: boolean;
}

export interface HeroSettings {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta_label?: string;
  cta_href?: string;
  image_url?: string | null;
}

export interface BrandStorySettings {
  heading: string;
  body: string;
  cta_label?: string;
  cta_href?: string;
  image_url?: string | null;
}

const DEFAULT_ANNOUNCEMENT: AnnouncementSettings = {
  text: "Complimentary worldwide shipping on all orders",
  cta_label: "Shop Now",
  cta_href: "/collections/men",
  enabled: true,
};

const DEFAULT_HERO: HeroSettings = {
  eyebrow: "Autumn / Winter Studio Collection",
  heading: "Uniquely Yours.",
  body: "Discover premium contemporary styles curated for the modern fashion connoisseur. Considered proportions, honest materials and enduring silhouettes.",
  cta_label: "EXPLORE COLLECTION",
  cta_href: "/collections/new-arrivals",
  image_url: null,
};

const DEFAULT_BRAND_STORY: BrandStorySettings = {
  heading: "Designed for the discerning.",
  body: "TESTER is a contemporary wardrobe built on restraint: considered proportions, honest materials and finishing that rewards a closer look. Every piece is crafted in limited numbers, with fabrics sourced from historic mills across Europe and Japan.",
  cta_label: "OUR MANIFESTO",
  cta_href: "/about",
  image_url: null,
};

const CMS_STORAGE_KEY = "tester_cms_settings_v2";

export function useSiteCMS() {
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CMS_STORAGE_KEY + "_announcement");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_ANNOUNCEMENT;
  });

  const [hero, setHero] = useState<HeroSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CMS_STORAGE_KEY + "_hero");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_HERO;
  });

  const [brandStory, setBrandStory] = useState<BrandStorySettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CMS_STORAGE_KEY + "_brand_story");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_BRAND_STORY;
  });

  // Persist to local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CMS_STORAGE_KEY + "_announcement", JSON.stringify(announcement));
      localStorage.setItem(CMS_STORAGE_KEY + "_hero", JSON.stringify(hero));
      localStorage.setItem(CMS_STORAGE_KEY + "_brand_story", JSON.stringify(brandStory));
    }
  }, [announcement, hero, brandStory]);

  // Load from Supabase site_settings if available
  useEffect(() => {
    async function loadCMS() {
      try {
        const { data, error } = await supabase.from("site_settings").select("*");
        if (!error && data) {
          for (const row of data) {
            if (row.key === "announcement" && row.value) {
              setAnnouncement((prev) => ({ ...prev, ...(row.value as any) }));
            }
            if (row.key === "hero" && row.value) {
              setHero((prev) => ({ ...prev, ...(row.value as any) }));
            }
            if (row.key === "brand_story" && row.value) {
              setBrandStory((prev) => ({ ...prev, ...(row.value as any) }));
            }
          }
        }
      } catch (err) {
        // use local fallback
      }
    }
    loadCMS();
  }, []);

  const updateAnnouncement = (updates: Partial<AnnouncementSettings>) => {
    setAnnouncement((prev) => ({ ...prev, ...updates }));
  };

  const updateHero = (updates: Partial<HeroSettings>) => {
    setHero((prev) => ({ ...prev, ...updates }));
  };

  const updateBrandStory = (updates: Partial<BrandStorySettings>) => {
    setBrandStory((prev) => ({ ...prev, ...updates }));
  };

  return {
    announcement,
    hero,
    brandStory,
    updateAnnouncement,
    updateHero,
    updateBrandStory,
  };
}
