import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState({});

  useEffect(() => {
    handleGetSellerProducts();
  }, [handleGetSellerProducts]);

  const handleImageChange = (productId, imageUrl) => {
    setSelectedImage((prev) => ({ ...prev, [productId]: imageUrl }));
  };

  const handleProductClick = (productId) => {
    navigate(`/seller/product/${productId}`);
  };

  // Stats calculations
  const totalPieces = sellerProducts.length;
  const totalImages = sellerProducts.reduce((acc, p) => acc + (p.images?.length || 0), 0);
  const avgPrice = totalPieces > 0
    ? Math.round(sellerProducts.reduce((acc, p) => acc + (p.price?.amount || 0), 0) / totalPieces)
    : 0;

  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto page-enter">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <h1 className="font-headline text-4xl lg:text-5xl text-on-surface font-light">
              L'Atelier <em className="italic text-secondary">Overview</em>
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant font-light">
              Your curated insights for {currentMonth}.
            </p>
          </div>
          <button
            onClick={() => navigate("/products/create")}
            className="btn-pill btn-primary">
            Publish New Collection
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="spinner-atelier mb-4" />
            <p className="text-xs uppercase tracking-[0.15em] text-outline">
              Loading your collection...
            </p>
          </div>
        ) : sellerProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-surface-low rounded-[2rem]">
            <div className="text-center max-w-sm">
              <p className="font-headline text-4xl italic text-outline-variant mb-4">
                Empty Atelier
              </p>
              <p className="text-sm text-outline mb-8 font-light leading-relaxed">
                Your collection is empty. Begin your journey as an artisan
                by creating your first piece.
              </p>
              <button
                onClick={() => navigate("/products/create")}
                className="btn-pill btn-primary">
                Create Your First Piece
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Total Volume */}
              <div className="bg-surface-lowest rounded-[1.5rem] p-7 shadow-ambient relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="label-atelier !mb-3">Total Pieces</p>
                    <p className="font-headline text-4xl text-on-surface font-light">
                      {totalPieces}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-on-primary bg-secondary/80 px-2.5 py-1 rounded-full">
                    +{Math.floor(Math.random() * 20 + 5)}%
                  </span>
                  <span className="text-xs text-outline font-light">
                    vs. previous period
                  </span>
                </div>
              </div>

              {/* Total Images */}
              <div className="bg-surface-lowest rounded-[1.5rem] p-7 shadow-ambient relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="label-atelier !mb-3">Total Images</p>
                    <p className="font-headline text-4xl text-on-surface font-light">
                      {totalImages}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-on-primary bg-secondary/80 px-2.5 py-1 rounded-full">
                    +{Math.floor(Math.random() * 10 + 3)}%
                  </span>
                  <span className="text-xs text-outline font-light">
                    vs. previous period
                  </span>
                </div>
              </div>

              {/* Avg Price */}
              <div className="bg-surface-lowest rounded-[1.5rem] p-7 shadow-ambient relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="label-atelier !mb-3">Avg. Price</p>
                    <p className="font-headline text-4xl text-on-surface font-light">
                      ₹{avgPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v12M8.5 9.5h7c1.1 0 2 .9 2 2s-.9 2-2 2h-7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-on-primary bg-secondary/80 px-2.5 py-1 rounded-full">
                    +{Math.floor(Math.random() * 25 + 8)}%
                  </span>
                  <span className="text-xs text-outline font-light">
                    vs. previous period
                  </span>
                </div>
              </div>
            </div>

            {/* Two-Column Layout: Product Grid + Featured Pieces */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left - Product list (Recent Commissions style) */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline text-2xl text-on-surface font-light">
                    <em className="italic text-secondary">Recent</em> Pieces
                  </h2>
                  <button
                    onClick={() => {}}
                    className="text-xs uppercase tracking-[0.12em] font-medium text-on-surface-variant hover:text-secondary transition-colors bg-transparent border-none cursor-pointer underline underline-offset-4">
                    View All
                  </button>
                </div>

                {/* Table-like layout */}
                <div className="bg-surface-lowest rounded-[1.5rem] shadow-ambient overflow-hidden">
                  {/* Header Row */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-low">
                    <div className="col-span-1">
                      <span className="label-atelier !mb-0 text-[0.6rem]">#</span>
                    </div>
                    <div className="col-span-4">
                      <span className="label-atelier !mb-0 text-[0.6rem]">Product</span>
                    </div>
                    <div className="col-span-3 hidden sm:block">
                      <span className="label-atelier !mb-0 text-[0.6rem]">Date</span>
                    </div>
                    <div className="col-span-2">
                      <span className="label-atelier !mb-0 text-[0.6rem]">Price</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="label-atelier !mb-0 text-[0.6rem]">Action</span>
                    </div>
                  </div>

                  {/* Product Rows */}
                  {sellerProducts.map((product, index) => (
                    <div
                      key={product._id}
                      className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-t border-outline-variant/10 hover:bg-surface-low/50 transition-colors cursor-pointer"
                      onClick={() => handleProductClick(product._id)}>
                      <div className="col-span-1">
                        <span className="text-xs text-outline font-medium">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-high shrink-0">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-surface-high" />
                          )}
                        </div>
                        <span className="text-sm text-on-surface font-medium line-clamp-1">
                          {product.title}
                        </span>
                      </div>
                      <div className="col-span-3 hidden sm:block">
                        <span className="text-xs text-outline font-light">
                          {new Date(product.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-headline text-base text-on-surface">
                          ₹{product.price.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleProductClick(product._id); }}
                          className="text-xs text-secondary font-medium hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer uppercase tracking-wider">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Featured Pieces Sidebar */}
              <div className="lg:col-span-1">
                <h2 className="font-headline text-2xl text-on-surface font-light mb-6">
                  <em className="italic text-secondary">Featured</em> Pieces
                </h2>

                <div className="space-y-5">
                  {sellerProducts.slice(0, 3).map((product) => (
                    <div
                      key={product._id}
                      className="bg-surface-lowest rounded-[1.5rem] p-5 shadow-ambient hover:shadow-ambient-hover transition-all cursor-pointer group"
                      onClick={() => handleProductClick(product._id)}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-high shrink-0 img-zoom">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-headline italic text-outline-variant text-xs">N/A</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-headline text-base text-on-surface line-clamp-1 group-hover:text-secondary transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-xs text-outline font-light mt-1">
                            Inventory: <strong className="text-on-surface">{product.images?.length || 0}</strong> images
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
                              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                              <polyline points="17 6 23 6 23 12" />
                            </svg>
                            <span className="text-[0.6rem] uppercase tracking-wider text-secondary font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 bg-surface border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-headline text-lg text-on-surface">
            <em className="italic">MAISON</em>
            <span className="font-light not-italic">elle</span>
          </span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Terms</a>
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Shipping</a>
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Contact</a>
          </div>
          <p className="text-[0.6rem] text-outline uppercase tracking-[0.1em]">
            © 2024 MAISONelle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
