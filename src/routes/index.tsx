import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { PremiumHeroPlaceholder } from "../components/placeholders/PremiumHeroPlaceholder";
import { PremiumCategoryPlaceholder } from "../components/placeholders/PremiumCategoryPlaceholder";
import { ProductCard } from "../components/storefront/ProductCard";
import { useCatalogue } from "../hooks/useCatalogue";
import { useSiteCMS } from "../hooks/useSiteCMS";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { products } = useCatalogue();
  const { hero, brandStory } = useSiteCMS();

  // Curated subsets
  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);
  const mensCollection = products.filter((p) => p.category_slug === "men").slice(0, 4);
  const womensCollection = products.filter((p) => p.category_slug === "women").slice(0, 4);
  const footwear = products.filter((p) => p.category_slug === "footwear").slice(0, 4);
  const accessories = products.filter((p) => p.category_slug === "accessories").slice(0, 4);
  const saleProducts = products
    .filter((p) => p.compare_at_price && p.compare_at_price > p.price)
    .slice(0, 4);
  const editorsPicks = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      {/* 1 & 2. Announcement bar & Sticky Header */}
      <Header />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <PremiumHeroPlaceholder
          imageUrl={hero.image_url}
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          body={hero.body}
          ctaLabel={hero.cta_label}
          ctaHref={hero.cta_href}
        />

        {/* 4. New Arrivals Section */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e8e2d5]">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-1">
                LATEST RELEASES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1c1a17]">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/collections/new-arrivals"
              className="mt-3 sm:mt-0 text-xs font-sans uppercase tracking-[0.2em] font-medium text-[#1e1c19] border-b border-[#1e1c19] pb-0.5 hover:opacity-75 transition-opacity"
            >
              View All Pieces →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. Featured Categories Section (Large Visual Tiles) */}
        <section className="py-16 bg-[#f7f5ee] border-t border-b border-[#e8e3d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-2">
                CURATED WARDROBE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1c1a17]">
                Shop by Category
              </h2>
              <p className="text-xs text-[#6e6353] font-light mt-2 leading-relaxed">
                Refined garments constructed with uncompromising attention to proportion and texture.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              <PremiumCategoryPlaceholder
                title="Men"
                subtitle="Tailored & Relaxed"
                slug="men"
                count={products.filter((p) => p.category_slug === "men").length}
              />
              <PremiumCategoryPlaceholder
                title="Women"
                subtitle="Fluid Silhouettes"
                slug="women"
                count={products.filter((p) => p.category_slug === "women").length}
              />
              <PremiumCategoryPlaceholder
                title="Kids"
                subtitle="Youth Essentials"
                slug="kids"
                count={products.filter((p) => p.category_slug === "kids").length}
              />
              <PremiumCategoryPlaceholder
                title="Footwear"
                subtitle="Hand-stitched Leather"
                slug="footwear"
                count={products.filter((p) => p.category_slug === "footwear").length}
              />
              <PremiumCategoryPlaceholder
                title="Accessories"
                subtitle="Finishing Details"
                slug="accessories"
                count={products.filter((p) => p.category_slug === "accessories").length}
              />
            </div>
          </div>
        </section>

        {/* 6. Men's Spotlight */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e8e2d5]">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-1">
                STUDIO SELECTION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1c1a17]">
                Men's Wardrobe
              </h2>
            </div>
            <Link
              to="/category/men"
              className="mt-3 sm:mt-0 text-xs font-sans uppercase tracking-[0.2em] font-medium text-[#1e1c19] border-b border-[#1e1c19] pb-0.5 hover:opacity-75 transition-opacity"
            >
              Explore Men's →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {mensCollection.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 7. Women's Spotlight */}
        <section className="py-16 sm:py-20 bg-[#f9f8f4] border-t border-b border-[#e9e4d9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e8e2d5]">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-1">
                  CONTEMPORARY DRAPE
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1c1a17]">
                  Women's Silhouettes
                </h2>
              </div>
              <Link
                to="/category/women"
                className="mt-3 sm:mt-0 text-xs font-sans uppercase tracking-[0.2em] font-medium text-[#1e1c19] border-b border-[#1e1c19] pb-0.5 hover:opacity-75 transition-opacity"
              >
                Explore Women's →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {womensCollection.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 8. Editorial Brand Story */}
        <section className="py-20 sm:py-28 bg-[#1f1d1a] text-[#f7f5f0] border-t border-b border-[#2d2925]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#b0a797] font-sans font-medium block mb-4">
              MANIFESTO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#fbf9f5] leading-tight mb-6">
              {brandStory.heading}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#d1c9bd] font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              {brandStory.body}
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link
                to="/about"
                className="px-8 py-3.5 bg-[#f7f5f0] text-[#1f1d1a] text-xs font-sans tracking-[0.22em] uppercase font-medium hover:bg-white transition-colors"
              >
                {brandStory.cta_label || "READ STUDIO NOTES"}
              </Link>
            </div>
          </div>
        </section>

        {/* 9. Footwear & Accessories Dual Showcase */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Footwear Block */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d5] mb-6">
                <div>
                  <span className="text-[10px] tracking-[0.25em] text-[#8a8070] uppercase font-sans">
                    LEATHER GOODS
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1a17]">Footwear</h3>
                </div>
                <Link
                  to="/category/footwear"
                  className="text-xs font-sans uppercase tracking-[0.18em] underline text-[#25221e]"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {footwear.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>

            {/* Accessories Block */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d5] mb-6">
                <div>
                  <span className="text-[10px] tracking-[0.25em] text-[#8a8070] uppercase font-sans">
                    ACCOUTREMENTS
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#1c1a17]">Accessories</h3>
                </div>
                <Link
                  to="/category/accessories"
                  className="text-xs font-sans uppercase tracking-[0.18em] underline text-[#25221e]"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {accessories.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Seasonal Sale Section */}
        {saleProducts.length > 0 && (
          <section className="py-16 bg-[#fcf5f5] border-t border-b border-[#eddcdc]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e4cccc]">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#a32828] font-sans font-semibold block mb-1">
                    LIMITED ARCHIVE OFFERS
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#2e1d1d]">
                    Seasonal Archive Sale
                  </h2>
                </div>
                <Link
                  to="/collections/sale"
                  className="mt-3 sm:mt-0 text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#a32828] border-b border-[#a32828] pb-0.5 hover:opacity-80 transition-opacity"
                >
                  Shop Complete Sale →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {saleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 11. Editor's Picks / Recommendations */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto mb-10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-1">
              STUDIO CURATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1c1a17]">
              Editor's Picks
            </h2>
            <p className="text-xs text-[#6e6353] font-light mt-2 leading-relaxed">
              Timeless foundation pieces recommended by our design atelier for any occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {editorsPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
