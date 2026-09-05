import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/storefront/Header";
import { Footer } from "../components/storefront/Footer";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] text-[#22201d]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#887f70] font-sans font-medium block mb-3">
            ATELIER MANIFESTO
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1a1815] leading-tight mb-6">
            Designed for the Discerning.
          </h1>
          <p className="text-sm sm:text-base text-[#6d6252] font-light leading-relaxed">
            TESTER was established on the principle that luxury contemporary dressing should be quiet, deliberate, and enduring.
          </p>
        </div>

        {/* Editorial Story Blocks */}
        <div className="space-y-12 text-xs sm:text-sm font-sans text-[#4d4436] font-light leading-relaxed border-t border-[#eae3d5] pt-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <h3 className="md:col-span-4 font-serif text-2xl text-[#1e1c19] font-normal">
              Honest Materials
            </h3>
            <p className="md:col-span-8">
              We source strictly from venerable mills across Europe and Japan. From unblended European flax linen to long-staple Peruvian pima cotton and extra-fine Australian merino wool, our fabrics are selected for how they breathe, drape, and evolve character through years of wear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-[#eae3d5] pt-12">
            <h3 className="md:col-span-4 font-serif text-2xl text-[#1e1c19] font-normal">
              Restrained Proportions
            </h3>
            <p className="md:col-span-8">
              Our silhouettes avoid the fleeting ephemera of hyper-trend fashion. Every sleeve pitch, lapel roll, and trouser break is calibrated to grant effortless confidence in metropolitan and leisure settings alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-[#eae3d5] pt-12">
            <h3 className="md:col-span-4 font-serif text-2xl text-[#1e1c19] font-normal">
              Limited Studio Runs
            </h3>
            <p className="md:col-span-8">
              We do not mass-produce. By crafting in conscious, disciplined batches, we respect our master pattern-cutters and avoid deadstock waste, preserving the quiet exclusivity of every garment in your wardrobe.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-[#eae3d5] text-center">
          <Link
            to="/collections/new-arrivals"
            className="inline-block px-10 py-4 bg-[#1f1d1a] text-[#f7f5f0] text-xs font-sans tracking-[0.22em] uppercase font-medium hover:bg-black transition-colors"
          >
            DISCOVER THE STUDIO WARDROBE
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
