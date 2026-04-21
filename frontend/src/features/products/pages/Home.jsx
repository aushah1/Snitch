import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";

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

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto page-enter">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Editorial Text */}
          <div>
            <p className="label-atelier mb-4 text-secondary">
              // New Season 2026
            </p>
            <h1 className="font-headline text-5xl lg:text-7xl tracking-tight text-on-surface leading-[1.05] font-light">
              <em className="italic">The</em> Curated
              <br />
              Collection
            </h1>
            <p className="mt-8 text-base text-on-surface-variant max-w-md leading-relaxed font-light">
              Handcrafted luxury goods from independent artisans. Each piece
              tells a story of meticulous craftsmanship and intentional design.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <button
                onClick={() => {
                  document
                    .getElementById("products-grid")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-pill btn-primary"
              >
                Explore Collection
              </button>
              <button className="btn-editorial">Our Story →</button>
            </div>
          </div>

          {/* Right - Featured Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-surface-high img-zoom shadow-ambient-lg">
              {products.length > 0 && products[0]?.images?.[0]?.url ? (
                <img
                  src={products[0].images[0].url}
                  alt="Featured product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
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
            {/* Floating tag */}
            <div className="absolute -bottom-4 -left-4 glass rounded-2xl py-3 px-5 shadow-ambient">
              <p className="text-[0.6rem] uppercase tracking-[0.15em] text-outline mb-1">
                Curated Selection
              </p>
              <p className="text-sm font-medium text-on-surface">
                {products.length} Pieces Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section
        id="products-grid"
        className="py-20 px-6 lg:px-8 bg-surface-low"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="label-atelier text-secondary mb-3">
                // The Collection
              </p>
              <h2 className="font-headline text-4xl lg:text-5xl text-on-surface font-light">
                All <em className="italic">Pieces</em>
              </h2>
            </div>
            <p className="hidden md:block text-sm text-outline font-light">
              {products.length} items
            </p>
          </div>

          {/* Loading State */}
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
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="card-atelier cursor-pointer group"
                >
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden bg-surface-high">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
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

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-headline text-lg text-on-surface line-clamp-1 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-outline line-clamp-2 mb-5 font-light leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-on-surface">
                        <span className="text-[0.65rem] uppercase tracking-wider text-outline mr-1">
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

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 bg-primary-container">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <span className="font-headline text-xl text-inverse-on-surface">
                MAISON<em className="not-italic font-light opacity-50">elle</em>
              </span>
              <p className="mt-4 text-xs text-outline leading-relaxed max-w-xs">
                An editorial e-commerce experience. Curated luxury from
                independent artisans worldwide.
              </p>
            </div>
            <div>
              <p className="label-atelier text-outline mb-4">Navigate</p>
              <div className="flex flex-col gap-3">
                <a href="/" className="text-xs text-inverse-on-surface no-underline hover:text-secondary-container transition-colors">Collection</a>
                <a href="/login" className="text-xs text-inverse-on-surface no-underline hover:text-secondary-container transition-colors">Account</a>
              </div>
            </div>
            <div>
              <p className="label-atelier text-outline mb-4">Legal</p>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-xs text-inverse-on-surface no-underline hover:text-secondary-container transition-colors">Terms of Service</a>
                <a href="#" className="text-xs text-inverse-on-surface no-underline hover:text-secondary-container transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-outline-variant/10">
            <p className="text-[0.6rem] text-outline tracking-[0.1em] uppercase">
              © 2026 MAISONelle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
