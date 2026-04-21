import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "A — Z" },
  { value: "name-desc", label: "Z — A" },
];

const Collections = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { handleGetAllProducts, handleSearchProducts } = useProduct();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearchProducts(searchQuery.trim());
    } else {
      handleGetAllProducts();
    }
  }, [searchQuery, handleGetAllProducts, handleSearchProducts]);

  const clearSearch = () => {
    setSearchParams({});
  };

  // Sort products
  const sortedProducts = [...(Array.isArray(products) ? products : [])].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.price?.amount || 0) - (b.price?.amount || 0);
      case "price-desc":
        return (b.price?.amount || 0) - (a.price?.amount || 0);
      case "name-asc":
        return (a.title || "").localeCompare(b.title || "");
      case "name-desc":
        return (b.title || "").localeCompare(a.title || "");
      case "newest":
      default:
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
    }
  });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ═══ Hero Banner ═══ */}
      <section className="pt-28 pb-14 px-6 lg:px-8 max-w-7xl mx-auto page-enter">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <p className="label-atelier text-secondary mb-0!">
            {searchQuery ? "Search Results" : "The Archive"}
          </p>
        </div>
        <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl text-on-surface font-light leading-[1.05] tracking-tight">
          {searchQuery ? (
            <>
              Results for{" "}
              <em className="italic text-secondary">'{searchQuery}'</em>
            </>
          ) : (
            <>
              All <em className="italic text-secondary">Collections</em>
            </>
          )}
        </h1>
        <p className="mt-4 text-base text-on-surface-variant max-w-lg font-light leading-relaxed">
          {searchQuery
            ? `Showing pieces matching "${searchQuery}" from our collection.`
            : "Browse our complete catalogue of meticulously curated pieces — each crafted with intention and designed to endure."}
        </p>
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-on-surface-variant hover:text-secondary transition-colors bg-transparent border border-outline-variant/30 rounded-full px-5 py-2.5 cursor-pointer">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Clear search
          </button>
        )}
      </section>

      {/* ═══ Toolbar ═══ */}
      <div className="sticky top-[72px] z-30 bg-bg/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          {/* Left: count + filter */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-on-surface-variant font-light">
              <span className="font-medium text-on-surface">
                {sortedProducts.length}
              </span>{" "}
              pieces
            </p>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-on-surface-variant hover:text-secondary transition-colors bg-transparent border-none cursor-pointer">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filter
            </button>
          </div>

          {/* Right: sort + view toggle */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs uppercase tracking-[0.1em] text-on-surface-variant border border-outline-variant/20 rounded-full px-4 py-2 cursor-pointer focus:outline-none focus:border-secondary transition-colors appearance-none pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23735a39' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-surface-high rounded-full p-1 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none ${
                  viewMode === "grid"
                    ? "bg-primary text-on-primary"
                    : "bg-transparent text-on-surface-variant hover:text-on-surface"
                }`}
                aria-label="Grid view">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none ${
                  viewMode === "list"
                    ? "bg-primary text-on-primary"
                    : "bg-transparent text-on-surface-variant hover:text-on-surface"
                }`}
                aria-label="List view">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Products ═══ */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            /* Loading Skeletons */
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
              }>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-atelier">
                  <div
                    className={
                      viewMode === "grid" ? "aspect-[3/4] shimmer" : "h-32 shimmer"
                    }
                  />
                  <div className="p-6">
                    <div className="h-4 shimmer rounded-full w-3/4 mb-3" />
                    <div className="h-3 shimmer rounded-full w-1/2 mb-6" />
                    <div className="h-6 shimmer rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 bg-surface-low rounded-[2rem]">
              <div className="text-center max-w-sm">
                <p className="font-headline text-4xl italic text-outline-variant mb-4">
                  {searchQuery ? "No Results" : "Coming Soon"}
                </p>
                <p className="text-sm text-outline mb-8 font-light leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any pieces matching "${searchQuery}". Try a different search term.`
                    : "Our artisans are preparing the next collection. Check back soon for new arrivals."}
                </p>
                <button
                  onClick={() => {
                    if (searchQuery) clearSearch();
                    else navigate("/");
                  }}
                  className="btn-pill btn-primary">
                  {searchQuery ? "View All Pieces" : "Back to Home"}
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* ── Grid View ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 stagger-children">
              {sortedProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="card-atelier cursor-pointer group">
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden bg-surface-high relative">
                    {product.variants[0].images && product.variants[0].images.length > 0 ? (
                      <img
                        src={product.variants[0].images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-headline italic text-outline-variant text-lg">
                          No Image
                        </span>
                      </div>
                    )}
                    {/* Quick-view badge */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="glass rounded-full py-2.5 text-center">
                        <span className="text-[0.6rem] uppercase tracking-[0.15em] font-medium text-on-surface">
                          Quick View
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-headline text-lg text-on-surface line-clamp-1 mb-1 group-hover:text-secondary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-outline line-clamp-2 mb-5 font-light leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-on-surface font-headline">
                        <span className="text-[0.65rem] uppercase tracking-wider text-outline mr-1 font-body">
                          {product.price?.currency}
                        </span>
                        {product.price?.amount?.toLocaleString()}
                      </span>
                      <span className="text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── List View ── */
            <div className="space-y-4 stagger-children">
              {sortedProducts.map((product, index) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-surface-lowest rounded-2xl shadow-ambient hover:shadow-ambient-hover transition-all cursor-pointer group overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-48 md:w-56 aspect-square sm:aspect-auto sm:h-48 overflow-hidden bg-surface-high shrink-0">
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
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="label-atelier text-outline mb-0!">
                              #{String(index + 1).padStart(3, "0")}
                            </p>
                            <h3 className="font-headline text-2xl text-on-surface mb-2 group-hover:text-secondary transition-colors">
                              {product.title}
                            </h3>
                          </div>
                          <span className="font-headline text-2xl text-on-surface shrink-0">
                            <span className="text-xs uppercase tracking-wider text-outline mr-1 font-body">
                              {product.price?.currency}
                            </span>
                            {product.price?.amount?.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant font-light leading-relaxed line-clamp-2 max-w-2xl">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          {product.images?.length > 1 && (
                            <div className="flex -space-x-2">
                              {product.images.slice(0, 3).map((img, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-surface-lowest bg-surface-high">
                                  <img
                                    src={img.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {product.images.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-surface-high border-2 border-surface-lowest flex items-center justify-center">
                                  <span className="text-[0.5rem] text-outline font-medium">
                                    +{product.images.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          {product.variants?.length > 0 && (
                            <span className="text-[0.6rem] uppercase tracking-wider text-outline bg-surface-high rounded-full px-3 py-1">
                              {product.variants.length} variant
                              {product.variants.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-secondary font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                          View Piece →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="py-12 px-6 lg:px-8 bg-surface border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-headline text-lg text-on-surface">
            <em className="italic">MAISON</em>
            <span className="font-light not-italic">elle</span>
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">
              Shipping
            </a>
            <a
              href="#"
              className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">
              Contact
            </a>
          </div>
          <p className="text-[0.6rem] text-outline uppercase tracking-[0.1em]">
            © 2024 MAISONelle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Collections;