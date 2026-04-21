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

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto page-enter">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="label-atelier text-secondary mb-3">
              // Seller Atelier
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl text-on-surface font-light">
              My <em className="italic">Pieces</em>
            </h1>
            <p className="mt-3 text-sm text-outline font-light">
              Manage your collection and inventory
            </p>
          </div>
          <button
            onClick={() => navigate("/products/create")}
            className="btn-pill btn-secondary hidden md:flex"
          >
            + Create Piece
          </button>
        </div>

        {/* Mobile Create Button */}
        <button
          onClick={() => navigate("/products/create")}
          className="btn-pill btn-secondary w-full mb-8 md:hidden"
        >
          + Create New Piece
        </button>

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
                Your collection is empty. Begin your journey as an artisan by
                creating your first piece.
              </p>
              <button
                onClick={() => navigate("/products/create")}
                className="btn-pill btn-primary"
              >
                Create Your First Piece
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-surface-lowest rounded-2xl p-5 shadow-ambient">
                <p className="text-[0.6rem] uppercase tracking-[0.12em] text-outline mb-2">
                  Total Pieces
                </p>
                <p className="font-headline text-3xl text-on-surface font-light">
                  {sellerProducts.length}
                </p>
              </div>
              <div className="bg-surface-lowest rounded-2xl p-5 shadow-ambient">
                <p className="text-[0.6rem] uppercase tracking-[0.12em] text-outline mb-2">
                  Total Images
                </p>
                <p className="font-headline text-3xl text-on-surface font-light">
                  {sellerProducts.reduce(
                    (acc, p) => acc + (p.images?.length || 0),
                    0
                  )}
                </p>
              </div>
              <div className="bg-surface-lowest rounded-2xl p-5 shadow-ambient">
                <p className="text-[0.6rem] uppercase tracking-[0.12em] text-outline mb-2">
                  Avg. Price
                </p>
                <p className="font-headline text-3xl text-on-surface font-light">
                  ₹
                  {Math.round(
                    sellerProducts.reduce(
                      (acc, p) => acc + (p.price?.amount || 0),
                      0
                    ) / sellerProducts.length
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-surface-lowest rounded-2xl p-5 shadow-ambient">
                <p className="text-[0.6rem] uppercase tracking-[0.12em] text-outline mb-2">
                  Latest
                </p>
                <p className="text-sm text-on-surface font-light">
                  {new Date(
                    sellerProducts[0]?.createdAt
                  ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {sellerProducts.map((product) => (
                <div
                  key={product._id}
                  className="card-atelier cursor-pointer group"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Image */}
                  <div className="relative bg-surface-high overflow-hidden">
                    <img
                      src={
                        selectedImage[product._id] || product.images?.[0]?.url
                      }
                      alt={product.title}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.images?.length > 1 && (
                      <div className="absolute bottom-3 left-3 right-3 flex gap-1.5">
                        {product.images.map((image, index) => (
                          <button
                            key={image._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageChange(product._id, image.url);
                            }}
                            className={`w-8 h-8 rounded-lg overflow-hidden transition-all cursor-pointer border-2 ${
                              (selectedImage[product._id] || product.images[0]?.url) === image.url
                                ? "border-white opacity-100 shadow-lg"
                                : "border-transparent opacity-60 hover:opacity-90"
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`${product.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-headline text-lg text-on-surface line-clamp-1 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-outline line-clamp-2 mb-5 font-light">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="font-headline text-2xl text-on-surface">
                        ₹{product.price.amount.toLocaleString()}
                      </span>
                      <span className="text-[0.6rem] uppercase tracking-wider text-outline">
                        {product.price.currency}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex gap-4 text-[0.6rem] uppercase tracking-wider text-outline mb-5 pb-5 border-b border-outline-variant/15">
                      <span>
                        {new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span>{product.images?.length || 0} images</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product._id);
                        }}
                        className="flex-1 btn-pill btn-primary text-xs py-2.5"
                      >
                        Manage
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 btn-pill bg-error-container/30 text-error text-xs py-2.5 hover:bg-error-container/50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
