import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";

const MARQUEE_ITEMS = [
  "Free Shipping Over ₹2,000",
  "Sustainable Fabrics",
  "New Arrivals Every Thursday",
  "30-Day Free Returns",
  "SS '26 Now Live",
];

const Home = () => {
  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await handleGetAllProducts();
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchProducts();
  }, [handleGetAllProducts]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const featuredProduct = products.length > 0 ? products[0] : null;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ═══ Hero Section ═══ */}
      <section className="pt-28 pb-16 px-6 lg:px-8 max-w-7xl mx-auto page-enter">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — Editorial Copy */}
          <div className="pt-8 lg:pt-16">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <p className="label-atelier text-secondary mb-0!">
                SS '26 Collection
              </p>
            </div>

            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl text-on-surface font-light leading-[1.05] tracking-tight">
              Dress the
              <br />
              <em className="italic text-secondary">self</em> you
              <br />
              became.
            </h1>

            <p className="mt-8 text-base text-on-surface-variant max-w-md leading-relaxed font-light">
              An editorial curation of enduring silhouettes, crafted from
              sustainably sourced natural fibers for the modern atelier.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <button
                onClick={() =>
                  document
                    .getElementById("products-grid")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-pill btn-primary">
                Explore Collection
              </button>
              <button className="btn-editorial">Watch Lookbook →</button>
            </div>

            {/* Stats Row */}
            <div className="mt-16 flex items-end gap-12 lg:gap-16">
              <div>
                <p className="font-headline text-3xl lg:text-4xl text-on-surface font-light">
                  100%
                </p>
                <p className="label-atelier mb-0! mt-1">Natural</p>
              </div>
              <div>
                <p className="font-headline text-3xl lg:text-4xl text-on-surface font-light">
                  {products.length || 48}
                </p>
                <p className="label-atelier mb-0! mt-1">Pieces</p>
              </div>
              <div>
                <p className="font-headline text-3xl lg:text-4xl text-on-surface font-light italic">
                  Est.
                </p>
                <p className="label-atelier mb-0! mt-1">2024</p>
              </div>
            </div>
          </div>

          {/* Right — Featured Product Image */}
          <div className="relative">
            <div className="aspect-4/5 rounded-4xl overflow-hidden bg-surface-high img-zoom shadow-ambient-lg">
              {featuredProduct?.variants[0].images?.[0]?.url ? (
                <img
                  src={featuredProduct?.variants[0].images[0].url}
                  alt={featuredProduct.title || "Featured product"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container">
                  <div className="text-center">
                    <p className="font-headline text-3xl italic text-outline-variant">
                      Atelier
                    </p>
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] text-outline mt-2">
                      Featured Piece
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Floating Card on Image */}
            {featuredProduct && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-2xl p-5 shadow-ambient flex items-end justify-between">
                  <div>
                    <p className="font-headline text-xl italic text-on-surface">
                      {featuredProduct.title}
                    </p>
                    <p className="text-[0.6rem] uppercase tracking-[0.15em] text-outline mt-1">
                      {featuredProduct.description?.substring(0, 40)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleProductClick(featuredProduct._id)}
                    className="btn-pill btn-primary text-xs shrink-0 ml-4">
                    + Add to Bag
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Marquee Banner ═══ */}
      <div className="py-4 bg-primary overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="text-[0.65rem] uppercase tracking-[0.2em] text-on-primary/80 font-medium mx-8 flex items-center gap-8">
                {item}
                <span className="text-secondary-container">✦</span>
              </span>
            ),
          )}
        </div>
      </div>

      {/* ═══ Products Grid Section ═══ */}
      <section id="products-grid" className="py-20 px-6 lg:px-8 bg-surface-low">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="label-atelier text-secondary mb-3">
                The Collection
              </p>
              <h2 className="font-headline text-4xl lg:text-5xl text-on-surface font-light">
                Top <em className="italic">Pieces</em>
              </h2>
            </div>
            <p className="hidden md:block text-sm text-outline font-light">
              {products.length} items
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-atelier">
                  <div className="aspect-[3/4] shimmer" />
                  <div className="p-6">
                    <div className="h-4 shimmer rounded-full w-3/4 mb-3" />
                    <div className="h-3 shimmer rounded-full w-1/2 mb-6" />
                    <div className="h-6 shimmer rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-headline text-3xl italic text-outline-variant mb-4">
                Coming Soon
              </p>
              <p className="text-sm text-outline max-w-md mx-auto">
                Our artisans are preparing the next collection. Check back soon
                for new arrivals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 stagger-children">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="card-atelier cursor-pointer group">
                  <div className="aspect-[3/4] overflow-hidden bg-surface-high">
                    {product.variants[0].images &&
                    product.variants[0].images.length > 0 ? (
                      <img
                        src={product.variants[0].images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-headline italic text-outline-variant">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-headline text-lg text-on-surface line-clamp-1 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-outline line-clamp-2 mb-5 font-light leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-on-surface font-headline">
                        <span className="text-[0.65rem] uppercase tracking-wider text-outline mr-1 font-body">
                          {product.price.currency}
                        </span>
                        {product.price.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="py-16 px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <span className="font-headline text-xl text-on-surface">
                <em className="italic">MAISON</em>
                <span className="font-light not-italic">elle</span>
              </span>
              <p className="mt-4 text-xs text-outline leading-relaxed max-w-xs">
                Crafting enduring elegance for the modern atelier. Sustainably
                sourced, thoughtfully designed.
              </p>
            </div>
            <div>
              <p className="label-atelier text-on-surface-variant mb-4">
                Explore
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="text-xs text-outline no-underline hover:text-secondary transition-colors">
                  Sustainability
                </a>
                <a
                  href="#"
                  className="text-xs text-outline no-underline hover:text-secondary transition-colors">
                  Shipping & Returns
                </a>
                <a
                  href="#"
                  className="text-xs text-outline no-underline hover:text-secondary transition-colors">
                  Privacy Policy
                </a>
              </div>
            </div>
            <div>
              <p className="label-atelier text-on-surface-variant mb-4">
                Connect
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="text-xs text-outline no-underline hover:text-secondary transition-colors">
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-xs text-outline no-underline hover:text-secondary transition-colors">
                  Pinterest
                </a>
                <a
                  href="#"
                  className="text-xs text-outline no-underline hover:text-secondary transition-colors">
                  Journal
                </a>
              </div>
            </div>
            <div>
              <p className="label-atelier text-on-surface-variant mb-4">
                Newsletter
              </p>
              <p className="text-xs text-outline mb-4">
                Subscribe for early access to collections.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input-atelier !rounded-r-none flex-1 text-xs"
                />
                <button className="btn-pill btn-primary !rounded-l-none px-5 text-xs">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-outline-variant/10">
            <p className="text-[0.6rem] text-outline tracking-[0.1em] uppercase">
              © 2024 MAISONelle Atelier. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
