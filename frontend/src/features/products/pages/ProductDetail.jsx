import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useProduct } from "../hooks/useProduct.js";
import { useCart } from "../../cart/hooks/useCart.js";
import Navbar from "../components/Navbar";
import SimilarProducts from "../components/SimilarProducts.jsx";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);
  const { handleGetProductDetails } = useProduct();
  const { handleAddToCart } = useCart();

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductDetails(productId);
      setProduct(data?.product || data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  }

  useEffect(() => { fetchProductDetails(); }, [productId]);

  const normalizedProduct = useMemo(() => {
    if (!product) return null;
    const np = { ...product };
    if (np.variants) {
      np.variants = np.variants.map((v) => {
        const normalizedAttrs = {};
        if (v.attributes) {
          Object.entries(v.attributes).forEach(([k, val]) => {
            const titleK = k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
            normalizedAttrs[titleK] = val;
          });
        }
        return { ...v, attributes: normalizedAttrs };
      });
    }
    return np;
  }, [product]);

  useEffect(() => {
    if (normalizedProduct?.variants?.length > 0) {
      setSelectedAttributes(normalizedProduct.variants[0].attributes || {});
    }
  }, [normalizedProduct]);

  const activeVariant = useMemo(() => {
    if (!normalizedProduct?.variants || normalizedProduct.variants.length === 0) return null;
    return normalizedProduct.variants.find((v) => {
      if (!v.attributes) return false;
      const vKeys = Object.keys(v.attributes);
      const sKeys = Object.keys(selectedAttributes);
      return vKeys.length === sKeys.length && vKeys.every((k) => v.attributes[k] === selectedAttributes[k]);
    });
  }, [normalizedProduct, selectedAttributes]);

  const availableAttributes = useMemo(() => {
    if (!normalizedProduct?.variants) return {};
    const attrs = {};
    normalizedProduct.variants.forEach((variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attrs[key]) attrs[key] = new Set();
          attrs[key].add(value);
        });
      }
    });
    Object.keys(attrs).forEach((key) => { attrs[key] = Array.from(attrs[key]); });
    return attrs;
  }, [normalizedProduct]);

  useEffect(() => { setSelectedImage(0); }, [activeVariant]);

  const handleAttributeChange = (attrName, value) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value };
    const exactMatch = normalizedProduct.variants.find((v) => {
      const vAttrs = v.attributes || {};
      return Object.keys(newAttrs).every((k) => newAttrs[k] === vAttrs[k]) &&
        Object.keys(vAttrs).every((k) => newAttrs[k] === vAttrs[k]);
    });
    if (exactMatch) setSelectedAttributes(exactMatch.attributes);
    else {
      const fallback = normalizedProduct.variants.find((v) => v.attributes && v.attributes[attrName] === value);
      if (fallback) setSelectedAttributes(fallback.attributes);
      else setSelectedAttributes(newAttrs);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="spinner-atelier" />
      </div>
    );
  }

  const displayImages =
    activeVariant?.images?.length > 0 ? activeVariant.images
      : product.images?.length > 0 ? product.images
        : [{ url: "" }];
  const displayPrice = activeVariant?.price?.amount ? activeVariant.price : product.price;

  const accordionItems = [
    { id: "craftsmanship", title: "Craftsmanship", content: "Every piece is meticulously crafted by our skilled artisans using time-honored techniques passed down through generations." },
    { id: "sizing", title: "Sizing & Fit", content: "Our pieces are designed for a relaxed, modern fit. We recommend selecting your usual size for the intended silhouette." },
    { id: "sustainability", title: "Sustainability", content: "We are committed to sustainable practices. All materials are responsibly sourced and our production processes minimize environmental impact." },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="pt-24 pb-20 px-6 lg:px-8 max-w-7xl mx-auto page-enter">
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="label-atelier text-outline mb-0!">
            <Link to="/" className="no-underline text-outline hover:text-secondary transition-colors">Collections</Link>
            {" "}— Atelier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ═══ LEFT: Image Gallery ═══ */}
          <div>
            {/* Main Image */}
            <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-surface-high img-zoom relative group">
              {displayImages[selectedImage]?.url ? (
                <img
                  src={displayImages[selectedImage]?.url || displayImages[0].url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container">
                  <p className="font-headline text-xl italic text-outline-variant">No Image</p>
                </div>
              )}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => prev === 0 ? displayImages.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-lowest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-none shadow-ambient"
                    aria-label="Previous">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => prev === displayImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-lowest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-none shadow-ambient"
                    aria-label="Next">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 mt-4">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden transition-all cursor-pointer border-2 ${selectedImage === idx
                      ? "border-secondary opacity-100 shadow-ambient"
                      : "border-transparent opacity-50 hover:opacity-100"
                      }`}>
                    <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Product Info ═══ */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="font-headline text-4xl lg:text-5xl text-on-surface font-light leading-[1.1] mb-2">
              The <em className="italic">{product.title}</em>
            </h1>

            {/* Price */}
            <p className="font-headline text-xl text-on-surface mb-8">
              {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
            </p>

            {/* Narrative Card */}
            <div className="bg-surface-container rounded-[1.5rem] p-6 mb-8">
              <h3 className="font-headline text-lg italic text-on-surface mb-3">
                The Narrative
              </h3>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variant Selectors */}
            <div className="flex flex-wrap gap-x-12 gap-y-6 mb-8">
              {Object.entries(availableAttributes).map(([attrName, values]) => (
                <div key={attrName} className="flex-1 min-w-[120px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="label-atelier !mb-0">{attrName}</h3>
                    {attrName.toLowerCase() === "size" && (
                      <button className="text-xs text-on-surface-variant hover:text-secondary transition-colors bg-transparent border-none cursor-pointer underline underline-offset-4">
                        Size Guide
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {values.map((val) => {
                      const isSelected = selectedAttributes[attrName] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAttributeChange(attrName, val)}
                          className={`min-w-[3rem] px-3 h-12 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer border ${isSelected
                            ? "bg-primary text-on-primary border-primary"
                            : "bg-transparent text-on-surface border-outline-variant hover:border-primary"
                            }`}>
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Stock */}
            {activeVariant && activeVariant.stock !== undefined && (
              <p className={`text-xs uppercase tracking-wider font-medium mb-6 ${activeVariant.stock > 0 ? "text-secondary" : "text-error"}`}>
                {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : "Out of stock"}
              </p>
            )}

            {/* Add to Bag Button */}
            <button
              className="btn-pill btn-primary w-full text-sm py-4 mb-4"
              onClick={() => {
                if (activeVariant) {
                  handleAddToCart({ productId: product._id, variantId: activeVariant._id });
                }
              }}>
              Add to Bag →
            </button>

            {/* Accordion */}
            <div className="mt-4 space-y-0">
              {accordionItems.map((item) => (
                <div key={item.id} className="border-t border-outline-variant/20">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between py-5 text-left bg-transparent border-none cursor-pointer">
                    <span className="font-headline text-base italic text-on-surface">{item.title}</span>
                    <span className="text-outline text-lg">{openAccordion === item.id ? "−" : "+"}</span>
                  </button>
                  {openAccordion === item.id && (
                    <div className="pb-5">
                      <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto">
        <SimilarProducts />
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 bg-surface border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-headline text-lg text-on-surface">
            <em className="italic">MAISON</em><span className="font-light not-italic">elle</span>
          </span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Terms</a>
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Shipping</a>
            <a href="#" className="text-xs text-outline no-underline uppercase tracking-wider hover:text-secondary transition-colors">Contact</a>
          </div>
          <p className="text-[0.6rem] text-outline uppercase tracking-[0.1em]">© 2024 MAISONelle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
