import { useMemo } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";
import { ProductGrid } from "../components/storefront/ProductGrid";
import { useCatalogue } from "../hooks/useCatalogue";

export const Route = createFileRoute("/collections/$slug")({
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = useParams({ from: "/collections/$slug" });
  const { products } = useCatalogue();

  const isSale = slug === "sale";
  const isNewArrivals = slug === "new-arrivals";
  const isEditorsPicks = slug === "editors-picks";

  const collectionTitle = isSale
    ? "Seasonal Archive Sale"
    : isNewArrivals
    ? "New Arrivals"
    : isEditorsPicks
    ? "Editor's Picks"
    : slug.replace(/-/g, " ").toUpperCase();

  const collectionDescription = isSale
    ? "Selected archive silhouettes, tailored garments, and seasonal footwear with limited-time reductions."
    : isNewArrivals
    ? "The latest arrivals from the TESTER studio. Cut from natural fibers with contemporary proportions."
    : "Key foundation pieces selected by our design atelier for their enduring quality.";

  const filteredProducts = useMemo(() => {
    if (isSale) {
      return products.filter((p) => p.compare_at_price && p.compare_at_price > p.price);
    }
    if (isNewArrivals) {
      return products.filter((p) => p.is_new);
    }
    if (isEditorsPicks) {
      return products.filter((p) => p.is_featured);
    }
    return products.filter((p) => p.category_slug?.toLowerCase() === slug.toLowerCase());
  }, [products, slug, isSale, isNewArrivals, isEditorsPicks]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-sans text-[#827867] uppercase tracking-wider mb-6">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span>Collections</span>
          <span>/</span>
          <span className="text-[#201e1a] font-medium">{slug}</span>
        </nav>

        {/* Collection Banner Header */}
        <div className="pb-8 border-b border-[#eae4d8] mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#887f70] font-sans font-medium block mb-2">
            CURATED CAPSULE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#1c1a17] mb-3">
            {collectionTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#6c6253] font-light max-w-2xl leading-relaxed">
            {collectionDescription}
          </p>
          <div className="mt-4 text-xs font-mono text-[#8a7f70]">
            {filteredProducts.length} garments available
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          emptyMessage={`No items found in the ${collectionTitle} collection.`}
        />
      </main>

      <Footer />
    </div>
  );
}
