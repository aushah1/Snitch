import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";

const SimilarProducts = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetSimilarProducts } = useProduct();
  const similarProducts = useSelector((state) => state.product.similarProducts);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    if (productId) {
      handleGetSimilarProducts(productId);
    }
  }, [productId, handleGetSimilarProducts]);

  if (loading && (!similarProducts || similarProducts.length === 0)) {
    return (
      <div className="py-16 px-6 lg:px-8 max-w-7xl mx-auto flex justify-center">
        <div className="spinner-atelier" />
      </div>
    );
  }

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 px-6 lg:px-8 max-w-7xl mx-auto border-t border-outline-variant/10 mt-16 page-enter">
      <div className="flex items-center gap-2 mb-10">
        <span className="w-2 h-2 rounded-full bg-secondary" />
        <h2 className="font-headline text-2xl lg:text-3xl text-on-surface mb-0">
          Similar <em className="italic text-secondary">Pieces</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
        {similarProducts.slice(0, 4).map((product) => (
          <div
            key={product._id}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate(`/products/${product._id}`);
            }}
            className="card-atelier cursor-pointer group">
            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden bg-surface-high relative">
              {product.variants?.[0]?.images?.length > 0 ? (
                <img
                  src={product.variants[0].images[0].url}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : product.images?.length > 0 ? (
                <img
                  src={product.images[0].url}
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
    </div>
  );
};

export default SimilarProducts;
