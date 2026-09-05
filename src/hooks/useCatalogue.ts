import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";

export interface ProductVariant {
  id: string;
  size: string;
  colour?: string | null;
  sku?: string | null;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  currency: string;
  category_id?: string | null;
  category_slug?: string;
  subcategory_id?: string | null;
  subcategory_slug?: string;
  colour?: string | null;
  fabric?: string | null;
  fit?: string | null;
  care?: string | null;
  is_active: boolean;
  is_new: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
}

// Fallback seed catalog matching 0001_seed_tester_demo_catalogue.sql
const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    slug: "tailored-linen-shirt",
    title: "Tailored Linen Shirt",
    subtitle: "Ecru · European Linen",
    description:
      "A considered piece from the TESTER studio. Cut from 100% European linen with a relaxed silhouette, finished with mother-of-pearl buttons, clean French seams, reinforced side gussets and understated collar structuring. Breathable yet substantial, crafted to soften gracefully with each wash.",
    price: 4999,
    compare_at_price: 5999,
    currency: "INR",
    category_slug: "men",
    subcategory_slug: "men-shirts",
    colour: "Ecru",
    fabric: "European Linen",
    fit: "Relaxed",
    care: "Dry clean or gentle cold machine wash. Reshape and line dry in shade. Warm iron whilst damp.",
    is_active: true,
    is_new: true,
    is_featured: true,
    rating: 4.8,
    review_count: 24,
    images: [],
    variants: [
      { id: "v1-1", size: "XS", colour: "Ecru", sku: "TST-LINEN-XS", stock: 0 },
      { id: "v1-2", size: "S", colour: "Ecru", sku: "TST-LINEN-S", stock: 6 },
      { id: "v1-3", size: "M", colour: "Ecru", sku: "TST-LINEN-M", stock: 14 },
      { id: "v1-4", size: "L", colour: "Ecru", sku: "TST-LINEN-L", stock: 18 },
      { id: "v1-5", size: "XL", colour: "Ecru", sku: "TST-LINEN-XL", stock: 10 },
      { id: "v1-6", size: "XXL", colour: "Ecru", sku: "TST-LINEN-XXL", stock: 4 },
    ],
  },
  {
    id: "prod-002",
    slug: "merino-wool-polo",
    title: "Merino Wool Polo",
    subtitle: "Charcoal · Extra-fine Merino Wool",
    description:
      "Knitted from 18-micron Australian merino wool yarn on a fine gauge machine. Features a clean ribbed collar without buttons, seamless shoulder construction, and delicate ribbed cuffs.",
    price: 5499,
    compare_at_price: 6999,
    currency: "INR",
    category_slug: "men",
    subcategory_slug: "men-polos",
    colour: "Charcoal",
    fabric: "Extra-fine Merino Wool",
    fit: "Slim",
    care: "Specialist wool wash or dry clean. Dry flat away from direct heat.",
    is_active: true,
    is_new: true,
    is_featured: true,
    rating: 4.9,
    review_count: 31,
    images: [],
    variants: [
      { id: "v2-1", size: "S", colour: "Charcoal", sku: "TST-POLO-S", stock: 8 },
      { id: "v2-2", size: "M", colour: "Charcoal", sku: "TST-POLO-M", stock: 12 },
      { id: "v2-3", size: "L", colour: "Charcoal", sku: "TST-POLO-L", stock: 16 },
      { id: "v2-4", size: "XL", colour: "Charcoal", sku: "TST-POLO-XL", stock: 5 },
    ],
  },
  {
    id: "prod-003",
    slug: "structured-cotton-blazer",
    title: "Structured Cotton Blazer",
    subtitle: "Midnight · Cotton Twill",
    description:
      "A soft-tailored single-breasted jacket made from dense Italian cotton twill. Half-canvassed with unpadded natural shoulders, patch pockets, horn buttons, and cupro sleeve lining.",
    price: 12999,
    compare_at_price: null,
    currency: "INR",
    category_slug: "men",
    subcategory_slug: "men-blazers",
    colour: "Midnight",
    fabric: "Cotton Twill",
    fit: "Tailored",
    care: "Dry clean only. Hang on contoured wooden hanger.",
    is_active: true,
    is_new: false,
    is_featured: true,
    rating: 4.7,
    review_count: 19,
    images: [],
    variants: [
      { id: "v3-1", size: "38R", colour: "Midnight", sku: "TST-BLZ-38", stock: 4 },
      { id: "v3-2", size: "40R", colour: "Midnight", sku: "TST-BLZ-40", stock: 8 },
      { id: "v3-3", size: "42R", colour: "Midnight", sku: "TST-BLZ-42", stock: 6 },
      { id: "v3-4", size: "44R", colour: "Midnight", sku: "TST-BLZ-44", stock: 2 },
    ],
  },
  {
    id: "prod-004",
    slug: "pima-cotton-t-shirt",
    title: "Pima Cotton T-Shirt",
    subtitle: "Off White · Pima Cotton",
    description:
      "Crafted from long-staple Peruvian pima cotton for unmatched softness and durability. Features a bound crew neck collar that retains its shape, blind hem finishing, and pre-shrunk construction.",
    price: 2199,
    compare_at_price: 2799,
    currency: "INR",
    category_slug: "men",
    subcategory_slug: "men-t-shirts",
    colour: "Off White",
    fabric: "Pima Cotton",
    fit: "Regular",
    care: "Machine wash cold. Line dry or tumble dry low.",
    is_active: true,
    is_new: true,
    is_featured: false,
    rating: 4.6,
    review_count: 42,
    images: [],
    variants: [
      { id: "v4-1", size: "XS", colour: "Off White", sku: "TST-TEE-XS", stock: 10 },
      { id: "v4-2", size: "S", colour: "Off White", sku: "TST-TEE-S", stock: 22 },
      { id: "v4-3", size: "M", colour: "Off White", sku: "TST-TEE-M", stock: 30 },
      { id: "v4-4", size: "L", colour: "Off White", sku: "TST-TEE-L", stock: 25 },
      { id: "v4-5", size: "XL", colour: "Off White", sku: "TST-TEE-XL", stock: 15 },
    ],
  },
  {
    id: "prod-005",
    slug: "pleated-wool-trousers",
    title: "Pleated Wool Trousers",
    subtitle: "Stone · Wool Blend",
    description:
      "Single-pleated trousers tailored with a high-rise waist and fluid straight leg. Includes side tab adjusters instead of belt loops, slanted side pockets, and jetted rear button pockets.",
    price: 6999,
    compare_at_price: null,
    currency: "INR",
    category_slug: "men",
    subcategory_slug: "men-trousers",
    colour: "Stone",
    fabric: "Wool Blend",
    fit: "Straight",
    care: "Dry clean only. Steam to refresh between wears.",
    is_active: true,
    is_new: false,
    is_featured: true,
    rating: 4.8,
    review_count: 15,
    images: [],
    variants: [
      { id: "v5-1", size: "30", colour: "Stone", sku: "TST-TRS-30", stock: 5 },
      { id: "v5-2", size: "32", colour: "Stone", sku: "TST-TRS-32", stock: 12 },
      { id: "v5-3", size: "34", colour: "Stone", sku: "TST-TRS-34", stock: 9 },
      { id: "v5-4", size: "36", colour: "Stone", sku: "TST-TRS-36", stock: 4 },
    ],
  },
  {
    id: "prod-006",
    slug: "selvedge-denim-jeans",
    title: "Selvedge Denim Jeans",
    subtitle: "Indigo · Selvedge Denim",
    description:
      "Woven on vintage shuttle looms in Okayama from 13.5oz ring-spun cotton denim. Classic red-line selvedge ID, custom copper hardware, and hidden rear pocket rivets.",
    price: 7499,
    compare_at_price: 8999,
    currency: "INR",
    category_slug: "men",
    subcategory_slug: "men-jeans",
    colour: "Indigo",
    fabric: "Selvedge Denim",
    fit: "Slim Taper",
    care: "Wash sparingly inside out in cold water. Hang dry.",
    is_active: true,
    is_new: false,
    is_featured: false,
    rating: 4.9,
    review_count: 27,
    images: [],
    variants: [
      { id: "v6-1", size: "30", colour: "Indigo", sku: "TST-DNM-30", stock: 7 },
      { id: "v6-2", size: "32", colour: "Indigo", sku: "TST-DNM-32", stock: 15 },
      { id: "v6-3", size: "34", colour: "Indigo", sku: "TST-DNM-34", stock: 11 },
    ],
  },
  {
    id: "prod-007",
    slug: "silk-column-dress",
    title: "Silk Column Dress",
    subtitle: "Ivory · Mulberry Silk",
    description:
      "Floor-length minimalist silhouette draped in heavyweight 22-momme mulberry silk crepe de chine. Subtle boat neckline, low scoop back with delicate ties, and fluid side slit for effortless movement.",
    price: 11999,
    compare_at_price: null,
    currency: "INR",
    category_slug: "women",
    subcategory_slug: "women-dresses",
    colour: "Ivory",
    fabric: "Mulberry Silk",
    fit: "Straight",
    care: "Dry clean only. Store on padded hanger.",
    is_active: true,
    is_new: true,
    is_featured: true,
    rating: 4.9,
    review_count: 18,
    images: [],
    variants: [
      { id: "v7-1", size: "XS", colour: "Ivory", sku: "TST-DRS-XS", stock: 3 },
      { id: "v7-2", size: "S", colour: "Ivory", sku: "TST-DRS-S", stock: 7 },
      { id: "v7-3", size: "M", colour: "Ivory", sku: "TST-DRS-M", stock: 10 },
      { id: "v7-4", size: "L", colour: "Ivory", sku: "TST-DRS-L", stock: 5 },
    ],
  },
  {
    id: "prod-008",
    slug: "oversized-poplin-shirt",
    title: "Oversized Poplin Shirt",
    subtitle: "White · Cotton Poplin",
    description:
      "Crisp 120-thread-count Egyptian cotton poplin cut in an architectural boyfriend drape. Pointed spread collar, elongated double-button cuffs, and dropped shoulders.",
    price: 4599,
    compare_at_price: 5499,
    currency: "INR",
    category_slug: "women",
    subcategory_slug: "women-shirts",
    colour: "White",
    fabric: "Cotton Poplin",
    fit: "Oversized",
    care: "Machine wash delicate. Line dry and warm iron.",
    is_active: true,
    is_new: true,
    is_featured: true,
    rating: 4.8,
    review_count: 36,
    images: [],
    variants: [
      { id: "v8-1", size: "XS", colour: "White", sku: "TST-POP-XS", stock: 9 },
      { id: "v8-2", size: "S", colour: "White", sku: "TST-POP-S", stock: 18 },
      { id: "v8-3", size: "M", colour: "White", sku: "TST-POP-M", stock: 22 },
      { id: "v8-4", size: "L", colour: "White", sku: "TST-POP-L", stock: 14 },
    ],
  },
  {
    id: "prod-009",
    slug: "wide-leg-wool-trousers",
    title: "Wide-Leg Wool Trousers",
    subtitle: "Graphite · Wool Blend",
    description:
      "Clean front tailored trousers featuring deep inverted pleats and a relaxed wide leg that pools elegantly over footwear. Back welt pockets and concealed zip fly.",
    price: 6999,
    compare_at_price: null,
    currency: "INR",
    category_slug: "women",
    subcategory_slug: "women-trousers",
    colour: "Graphite",
    fabric: "Wool Blend",
    fit: "Wide",
    care: "Dry clean only.",
    is_active: true,
    is_new: false,
    is_featured: true,
    rating: 4.7,
    review_count: 22,
    images: [],
    variants: [
      { id: "v9-1", size: "XS", colour: "Graphite", sku: "TST-WTRS-XS", stock: 6 },
      { id: "v9-2", size: "S", colour: "Graphite", sku: "TST-WTRS-S", stock: 12 },
      { id: "v9-3", size: "M", colour: "Graphite", sku: "TST-WTRS-M", stock: 14 },
      { id: "v9-4", size: "L", colour: "Graphite", sku: "TST-WTRS-L", stock: 8 },
    ],
  },
  {
    id: "prod-010",
    slug: "minimal-leather-sneaker",
    title: "Minimal Leather Sneaker",
    subtitle: "White · Full-Grain Leather",
    description:
      "Handcrafted in Civitanova Marche from buttery Italian full-grain nappa calfskin. Padded collar, calf leather lining, removable cushioned footbed, and durable Margom rubber sole.",
    price: 8999,
    compare_at_price: null,
    currency: "INR",
    category_slug: "footwear",
    subcategory_slug: "footwear-sneakers",
    colour: "White",
    fabric: "Full-Grain Leather",
    fit: "True to size",
    care: "Wipe clean with a soft damp cloth. Condition leather periodically.",
    is_active: true,
    is_new: true,
    is_featured: true,
    rating: 4.9,
    review_count: 53,
    images: [],
    variants: [
      { id: "v10-1", size: "UK 6", colour: "White", sku: "TST-SNK-6", stock: 4 },
      { id: "v10-2", size: "UK 7", colour: "White", sku: "TST-SNK-7", stock: 8 },
      { id: "v10-3", size: "UK 8", colour: "White", sku: "TST-SNK-8", stock: 12 },
      { id: "v10-4", size: "UK 9", colour: "White", sku: "TST-SNK-9", stock: 15 },
      { id: "v10-5", size: "UK 10", colour: "White", sku: "TST-SNK-10", stock: 9 },
      { id: "v10-6", size: "UK 11", colour: "White", sku: "TST-SNK-11", stock: 3 },
    ],
  },
  {
    id: "prod-011",
    slug: "suede-penny-loafer",
    title: "Suede Penny Loafer",
    subtitle: "Tobacco · Italian Suede",
    description:
      "Unlined slip-on penny loafer made from water-resistant reverse suede with a Blake-stitched leather outsole. Features hand-stitched apron apron details and a reinforced heel counter.",
    price: 10999,
    compare_at_price: 12999,
    currency: "INR",
    category_slug: "footwear",
    subcategory_slug: "footwear-loafers",
    colour: "Tobacco",
    fabric: "Italian Suede",
    fit: "True to size",
    care: "Protect with water-repellent suede spray. Brush with brass wire brush.",
    is_active: true,
    is_new: false,
    is_featured: true,
    rating: 4.8,
    review_count: 28,
    images: [],
    variants: [
      { id: "v11-1", size: "UK 7", colour: "Tobacco", sku: "TST-LOA-7", stock: 5 },
      { id: "v11-2", size: "UK 8", colour: "Tobacco", sku: "TST-LOA-8", stock: 9 },
      { id: "v11-3", size: "UK 9", colour: "Tobacco", sku: "TST-LOA-9", stock: 11 },
      { id: "v11-4", size: "UK 10", colour: "Tobacco", sku: "TST-LOA-10", stock: 6 },
    ],
  },
  {
    id: "prod-012",
    slug: "structured-leather-tote",
    title: "Structured Leather Tote",
    subtitle: "Cognac · Full-Grain Leather",
    description:
      "Substantial everyday tote bag crafted from 2.2mm vegetable-tanned Tuscan bridle leather. Raw interior with zipped hanging pocket, solid brass rivet reinforcements, and hand-burnished edges.",
    price: 14999,
    compare_at_price: null,
    currency: "INR",
    category_slug: "accessories",
    subcategory_slug: "accessories-bags",
    colour: "Cognac",
    fabric: "Full-Grain Leather",
    fit: "One size",
    care: "Nourish with beeswax balm twice a year. Keep dry.",
    is_active: true,
    is_new: true,
    is_featured: true,
    rating: 4.9,
    review_count: 39,
    images: [],
    variants: [
      { id: "v12-1", size: "One Size", colour: "Cognac", sku: "TST-TOTE-OS", stock: 8 },
    ],
  },
  {
    id: "prod-013",
    slug: "acetate-sunglasses",
    title: "Acetate Sunglasses",
    subtitle: "Tortoise · Italian Acetate",
    description:
      "Hand-finished sunglasses carved from 8mm Mazzucchelli cellulose acetate blocks. Features 5-barrel German hinges, embedded wire core temples, and Category 3 polarized mineral glass lenses.",
    price: 6999,
    compare_at_price: 8499,
    currency: "INR",
    category_slug: "accessories",
    subcategory_slug: "accessories-sunglasses",
    colour: "Tortoise",
    fabric: "Italian Acetate",
    fit: "One size",
    care: "Rinse with lukewarm water and clean with microfibre cloth.",
    is_active: true,
    is_new: true,
    is_featured: true,
    rating: 4.7,
    review_count: 21,
    images: [],
    variants: [
      { id: "v13-1", size: "One Size", colour: "Tortoise", sku: "TST-SUN-OS", stock: 14 },
    ],
  },
  {
    id: "prod-014",
    slug: "boys-cotton-shirt",
    title: "Boys Cotton Shirt",
    subtitle: "Sky · Fine Cotton",
    description:
      "Classic Oxford cotton shirt sized down for young gentlemen. Soft garment-washed feel with button-down collar and contrast locker loop.",
    price: 1999,
    compare_at_price: 2499,
    currency: "INR",
    category_slug: "kids",
    subcategory_slug: "kids-shirts",
    colour: "Sky",
    fabric: "Cotton",
    fit: "Regular",
    care: "Machine wash warm with like colours.",
    is_active: true,
    is_new: true,
    is_featured: false,
    rating: 4.5,
    review_count: 14,
    images: [],
    variants: [
      { id: "v14-1", size: "4-5Y", colour: "Sky", sku: "TST-KID-45", stock: 10 },
      { id: "v14-2", size: "6-7Y", colour: "Sky", sku: "TST-KID-67", stock: 12 },
      { id: "v14-3", size: "8-9Y", colour: "Sky", sku: "TST-KID-89", stock: 8 },
    ],
  },
  {
    id: "prod-015",
    slug: "bifold-leather-wallet",
    title: "Bifold Leather Wallet",
    subtitle: "Black · Calf Leather",
    description:
      "Ultra-slim 6-card bifold wallet crafted from supple French box calf leather. Lined with RFID blocking microfibre, full-length bill compartment, and heat-stamped TESTER logo.",
    price: 4499,
    compare_at_price: 5499,
    currency: "INR",
    category_slug: "accessories",
    subcategory_slug: "accessories-wallets",
    colour: "Black",
    fabric: "Calf Leather",
    fit: "One size",
    care: "Keep away from excessive moisture.",
    is_active: true,
    is_new: false,
    is_featured: false,
    rating: 4.8,
    review_count: 32,
    images: [],
    variants: [
      { id: "v15-1", size: "One Size", colour: "Black", sku: "TST-WLT-OS", stock: 18 },
    ],
  },
];

const CATALOGUE_STORAGE_KEY = "tester_custom_products_v2";

export function useCatalogue() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CATALOGUE_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // ignore
        }
      }
    }
    return SEED_PRODUCTS;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to local storage for offline / quick admin edits
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CATALOGUE_STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  // Attempt to fetch fresh Supabase data
  useEffect(() => {
    async function loadFromDb() {
      try {
        const { data: dbProducts, error } = await supabase
          .from("products")
          .select("*, categories!category_id(slug), product_variants(*), product_images(*)")
          .eq("is_active", true);

        if (!error && dbProducts && dbProducts.length > 0) {
          const formatted: Product[] = dbProducts.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            price: Number(p.price),
            compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
            currency: p.currency || "INR",
            category_slug: p.categories?.slug || "men",
            colour: p.colour,
            fabric: p.fabric,
            fit: p.fit,
            care: p.care,
            is_active: p.is_active,
            is_new: p.is_new,
            is_featured: p.is_featured,
            rating: Number(p.rating || 4.5),
            review_count: Number(p.review_count || 12),
            images: (p.product_images || []).sort(
              (a: any, b: any) => a.position - b.position
            ),
            variants: p.product_variants || [],
          }));

          // Merge: if our local state has newly created admin products or images, preserve them
          setProducts((prev) => {
            const map = new Map(formatted.map((f) => [f.slug, f]));
            // check for custom products added in admin
            for (const item of prev) {
              if (!map.has(item.slug)) {
                map.set(item.slug, item);
              } else {
                // If local has custom images added by admin, prefer them
                const existing = map.get(item.slug)!;
                if (item.images.length > 0 && existing.images.length === 0) {
                  existing.images = item.images;
                }
              }
            }
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn("Using fallback local catalogue:", err);
      }
    }

    loadFromDb();
  }, []);

  const addProduct = (newProd: Omit<Product, "id">) => {
    const id = "prod-" + Math.random().toString(36).substring(2, 9);
    const fullProd: Product = { ...newProd, id };
    setProducts((prev) => [fullProd, ...prev]);
    return fullProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const updateVariantStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updatedVariants = prod.variants.map((v) =>
            v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
          );
          return { ...prod, variants: updatedVariants };
        }
        return prod;
      })
    );
  };

  const addImageToProduct = (productId: string, imageUrl: string, alt?: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const newImage: ProductImage = {
            id: "img-" + Math.random().toString(36).substring(2, 9),
            url: imageUrl,
            alt: alt || prod.title,
            position: prod.images.length,
          };
          return { ...prod, images: [...prod.images, newImage] };
        }
        return prod;
      })
    );
  };

  const removeImageFromProduct = (productId: string, imageId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          return { ...prod, images: prod.images.filter((img) => img.id !== imageId) };
        }
        return prod;
      })
    );
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateVariantStock,
    addImageToProduct,
    removeImageFromProduct,
  };
}
