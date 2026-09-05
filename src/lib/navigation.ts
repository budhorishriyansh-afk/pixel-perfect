export type NavGroup = {
  label: string;
  slug: string;
  columns: { heading?: string; items: { label: string; slug: string }[] }[];
};

const sub = (parent: string, label: string) => ({
  label,
  slug: `${parent}-${label.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-")}`,
});

const group = (label: string, slug: string, items: string[], perColumn = 7): NavGroup => {
  const entries = items.map((i) => sub(slug, i));
  const columns: NavGroup["columns"] = [];
  for (let i = 0; i < entries.length; i += perColumn) {
    columns.push({ items: entries.slice(i, i + perColumn) });
  }
  return { label, slug, columns };
};

export const NAV_GROUPS: NavGroup[] = [
  group("Men", "men", [
    "New Arrivals",
    "T-Shirts",
    "Shirts",
    "Polos",
    "Trousers",
    "Jeans",
    "Shorts",
    "Jackets",
    "Blazers",
    "Sweaters",
    "Hoodies",
    "Co-ords",
    "Ethnic Wear",
    "Occasion Wear",
  ]),
  group("Women", "women", [
    "New Arrivals",
    "Tops",
    "Shirts",
    "Dresses",
    "Trousers",
    "Jeans",
    "Skirts",
    "Jackets",
    "Blazers",
    "Sweaters",
    "Hoodies",
    "Co-ords",
    "Ethnic Wear",
    "Occasion Wear",
  ]),
  group("Kids", "kids", [
    "Boys",
    "Girls",
    "Baby",
    "T-Shirts",
    "Shirts",
    "Dresses",
    "Bottomwear",
    "Outerwear",
    "Sets",
  ]),
  group("Footwear", "footwear", [
    "Sneakers",
    "Loafers",
    "Formal Shoes",
    "Casual Shoes",
    "Boots",
    "Sandals",
    "Slides",
  ]),
  group("Accessories", "accessories", [
    "Bags",
    "Wallets",
    "Belts",
    "Sunglasses",
    "Watches",
    "Caps",
    "Scarves",
    "Jewellery",
    "Other Accessories",
  ]),
  group("Sale", "sale", [
    "Men's Sale",
    "Women's Sale",
    "Kids' Sale",
    "Footwear Sale",
    "Accessories Sale",
  ]),
  {
    label: "Gift Card",
    slug: "gift-card",
    columns: [
      {
        items: [
          { label: "Buy Gift Card", slug: "gift-card" },
          { label: "Gift Card Balance", slug: "gift-card-balance" },
          { label: "Gift Card FAQ", slug: "gift-card-faq" },
        ],
      },
    ],
  },
];
