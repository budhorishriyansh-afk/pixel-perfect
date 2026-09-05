# Implementation Plan: Premium Fashion E-Commerce Platform for "TESTER"

Build a complete, production-grade, contemporary luxury fashion e-commerce platform for the brand **TESTER**. The application features a data-driven storefront, responsive navigation with mega menu and search, product catalogue with faceted filtering and sorting, rich product details with size guides and quick view, shopping cart and multi-step checkout, customer account management with order history, and an administrative suite with product CRUD, image upload, inventory management, order fulfillment, coupons, and homepage CMS.

All product imagery strictly adheres to the **Zero AI-Generated Images** requirement: displaying high-end, intentional geometric placeholders until administrators upload genuine photography.

---

## Zero AI-Generated Product Images Policy

> [!IMPORTANT]
> **Zero AI-Generated Product Images**:
> As specified in the hard requirements, no AI-generated models, garments, or stock fashion photos are generated or inserted. All seeded catalogue items and unpopulated banners render our custom `PremiumProductPlaceholder` and `PremiumHeroPlaceholder` components. Real images can be uploaded via the Admin Dashboard or provided via direct image URL, which instantly replace placeholders dynamically.

> [!NOTE]
> **Database & Architecture**:
> Leverages the pre-existing Supabase PostgreSQL instance (`gfoupwpuxtzvniycjptp.supabase.co`) containing schemas for `products`, `product_variants`, `categories`, `product_images`, `cart_items`, `wishlist_items`, `orders`, `order_items`, `coupons`, `gift_cards`, and `site_settings`. Provides a seamless client-side local cache fallback so the storefront and admin remain 100% interactive and resilient in all environments.

---

## Directory Structure

```
src/
├── components/
│   ├── ui/                         # Shadcn/Radix components (buttons, dialogs, drawers, etc.)
│   ├── placeholders/
│   │   ├── PremiumProductPlaceholder.tsx   # Elegant neutral luxury placeholder (3:4 ratio)
│   │   ├── PremiumHeroPlaceholder.tsx      # Full-width editorial hero placeholder
│   │   └── PremiumCategoryPlaceholder.tsx  # Minimalist category banner/tile placeholder
│   ├── storefront/
│   │   ├── AnnouncementBar.tsx     # Dismissible top bar synced with site_settings
│   │   ├── Header.tsx              # Sticky editorial header with brand wordmark & actions
│   │   ├── MegaMenu.tsx            # Multi-column hover + touch dropdown menu
│   │   ├── MobileNav.tsx           # Full-height mobile slide drawer with accordions
│   │   ├── SearchOverlay.tsx       # Real-time search with suggestions & instant results
│   │   ├── ProductCard.tsx         # Luxury 3:4 card, sale badges, hover preview, quick view
│   │   ├── ProductGrid.tsx         # Responsive 4-col / 2-col product grid with empty states
│   │   ├── QuickViewModal.tsx      # Instant product inspection and add-to-cart modal
│   │   ├── SizeGuideModal.tsx      # Multi-category measurement tables (Clothing & Shoes)
│   │   ├── CartDrawer.tsx          # Slide-out drawer with quantity controls and totals
│   │   └── Footer.tsx              # 5-column luxury footer with newsletter subscription
├── context/
│   ├── CartContext.tsx             # Persistent cart state (guest localStorage + user sync)
│   ├── WishlistContext.tsx         # Persistent wishlist state
│   └── AuthContext.tsx             # Supabase auth session + admin role detection & mock switcher
├── hooks/
│   ├── useCatalogue.ts             # Hook for products, categories, variants & admin mutations
│   └── useSiteCMS.ts               # Hook for announcement and hero CMS settings
└── routes/
    ├── __root.tsx                  # App shell with Google Fonts, providers, global modals
    ├── index.tsx                   # Luxury Homepage with 12 editorial sections
    ├── category.$slug.tsx          # Dynamic category page (/men, /women, etc.) with filters & sort
    ├── collections.$slug.tsx       # Collection pages (/collections/new-arrivals, /sale)
    ├── product.$slug.tsx           # Comprehensive product detail page with gallery & accordions
    ├── cart.tsx                    # Full cart review page
    ├── checkout.tsx                # 5-step checkout flow (contact, shipping, delivery, payment, review)
    ├── order-confirmation.$orderNumber.tsx # Order confirmation receipt
    ├── gift-card.tsx               # Gift card purchase & balance checker
    ├── search.tsx                  # Dedicated search results page
    ├── account.tsx                 # Customer portal (profile, addresses, order history)
    ├── auth.tsx                    # Login, registration, password reset & admin switch
    ├── about.tsx                   # Brand manifesto and material sourcing
    ├── men.tsx, women.tsx, kids.tsx, footwear.tsx, accessories.tsx, sale.tsx
    └── admin.tsx                   # Complete Admin Suite (Products, Inventory, Orders, CMS)
```

---

## Implemented Architecture

### 1. Design System & Typography
- **Google Fonts Integration**: Cormorant Garamond for editorial display titles and Jost for modern geometric sans-serif UI typography.
- **Color Foundations**: Warm ivory background (`#fcfbf8`), dark charcoal ink typography (`#1e1c19`), champagne and muted sand accents (`#ede8df`), and restrained seasonal archive sale reds (`#a32828`).
- **Global Providers**: `CartProvider`, `WishlistProvider`, `AuthProvider`, `CartDrawer`, `Toaster` wrapped in `__root.tsx`.

### 2. High-End Placeholder Components (Zero AI Imagery)
- `PremiumProductPlaceholder`: Geometric luxury frame, subtle diagonal weave texture, studio monogram watermark, 3:4 portrait ratio, and understated "Product image coming soon" caption.
- `PremiumHeroPlaceholder`: Architectural grid and large editorial watermark; displays real uploaded images when provided in CMS.
- `PremiumCategoryPlaceholder`: Luxury architectural category tiles with piece counter.

### 3. Storefront Shared Components & Navigation
- `AnnouncementBar`: Dismissible per session, warm champagne tone, dynamically driven by CMS.
- `Header`: Sticky header that reduces height with frosted glass blur and border on scroll.
- `MegaMenu`: Full multi-column mega menu with subcategories across Men, Women, Kids, Footwear, Accessories, Sale, and Gift Cards. Touch and ESC accessible.
- `MobileNav`: Slide-over drawer with accordion sections, quick account links, and admin studio shortcut.
- `SearchOverlay`: Real-time instant search with suggestions, popular categories, and product preview cards.
- `ProductCard`: 3:4 card with hover image transition, discount badges, quick view, and wishlist button.
- `QuickViewModal`: Modal dialog for inspecting garments, picking size, selecting quantity, and adding to bag.
- `SizeGuideModal`: Measurement conversion tables for Men, Women, and Footwear.
- `CartDrawer`: Right slide-over drawer with free shipping progress bar, promo code applicator, and subtotal.
- `Footer`: 5-column luxury footer with newsletter subscription.

### 4. Storefront Routes
- `index.tsx`: Homepage with Hero, New Arrivals, Shop by Category, Men's Collection, Women's Collection, Footwear, Accessories, Sale, Brand Story Manifesto, Editor's Picks, Newsletter, and Footer.
- `category.$slug.tsx`: Faceted filtering by garment type, size, color, and price range. Sorting by featured, newest, price, rating, and discount.
- `collections.$slug.tsx`: Dynamic capsules for new arrivals, seasonal archive sale, and studio picks.
- `product.$slug.tsx`: Complete PDP with gallery, size selector with disabled out-of-stock sizes, quantity stepper, "Add to Bag", "Buy Now 1-Click", specifications accordions, and related product recommendations.
- `cart.tsx`: Full shopping bag page with quantity stepper, vouchers, and summary.
- `checkout.tsx`: Multi-step checkout with contact information, shipping address, delivery options, payment methods, and real order creation.
- `order-confirmation.$orderNumber.tsx`: Order confirmation receipt with studio fulfillment tracking.
- `gift-card.tsx`: Gift card denominations, recipient details, and live balance verification tool.
- `account.tsx`: Customer dashboard with profile, order history, addresses, and saved wishlist.
- `auth.tsx`: Sign in, registration, and quick demo role switchers.
- `about.tsx`: Brand manifesto, material sourcing, and atelier story.

### 5. Admin Dashboard Suite (`/admin`)
- **Dashboard Overview**: Revenue, orders fulfilled, active products count, low stock warnings, and recent dispatches.
- **Product Management**: Full table with search, product creation/editing modal, variant stock, and image manager (URL or upload).
- **Variant Inventory Matrix**: Inline stock updater with quick `+5`, `+10`, `-1` adjustments that update live across the storefront.
- **Orders Fulfillment**: Complete order tracking, fulfillment status dropdowns (`Confirmed`, `Processing`, `Shipped`, `Delivered`), and courier tracking codes.
- **Media Library**: Real photography repository for store owners.
- **Discounts & Coupons**: Promo code manager with percent or flat off discounts (`WELCOME10`, `TESTER500`).
- **Homepage & Announcement CMS**: Direct configuration for announcement text, hero banner headlines/images, and brand story copy.
- **Access Gate**: Strict authorization check protecting the admin suite from unprivileged visitors.

---

## Verification Summary
- Zero AI-generated images used across the application.
- Real-time reactivity between Admin changes and Storefront display.
- Smooth navigation, shopping bag persistence, coupon evaluation, and order fulfillment tracking.
