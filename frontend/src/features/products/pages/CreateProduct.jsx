import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Navbar from "../components/Navbar";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "", description: "", priceAmount: "", priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const toAdd = Array.from(files).slice(0, remaining);
    const newImages = toAdd.map((file) => ({
      file, preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => { addFiles(e.target.files); e.target.value = ""; };
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [images]);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      images.forEach((img) => data.append("images", img.file));
      await handleCreateProduct(data);
      navigate("/");
    } catch (err) {
      console.error("Failed to create product", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-5xl mx-auto page-enter">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-outline hover:text-secondary transition-colors bg-transparent border-none cursor-pointer mb-6">
          ← Back
        </button>

        {/* Header */}
        <div className="mb-12">
          <p className="label-atelier text-secondary mb-3">// New Piece</p>
          <h1 className="font-headline text-4xl lg:text-5xl text-on-surface font-light">
            Create <em className="italic">Listing</em>
          </h1>
          <p className="mt-3 text-sm text-on-surface-variant font-light">
            Add a new piece to your collection.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16">
            {/* LEFT: Text Fields */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="cp-title" className="label-atelier">Product Title</label>
                <input
                  id="cp-title" type="text" name="title" required
                  value={formData.title} onChange={handleChange}
                  placeholder="e.g. Oversized Linen Shirt"
                  className="input-atelier"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="cp-description" className="label-atelier">Description</label>
                <textarea
                  id="cp-description" name="description" rows={5}
                  value={formData.description} onChange={handleChange}
                  placeholder="Describe the product — material, fit, details..."
                  className="input-atelier"
                />
              </div>

              {/* Price */}
              <div>
                <label className="label-atelier">Pricing</label>
                <div className="flex gap-4">
                  <div className="flex-[3]">
                    <input
                      id="cp-priceAmount" type="number" name="priceAmount" required min="0" step="0.01"
                      value={formData.priceAmount} onChange={handleChange}
                      placeholder="0.00"
                      className="input-atelier"
                    />
                  </div>
                  <div className="flex-[1]">
                    <select
                      id="cp-priceCurrency" name="priceCurrency"
                      value={formData.priceCurrency} onChange={handleChange}
                      className="input-atelier">
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label-atelier !mb-0">Images</label>
                <span className="text-xs text-outline">{images.length}/{MAX_IMAGES}</span>
              </div>

              {/* Drop Zone */}
              {images.length < MAX_IMAGES && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`dropzone-atelier ${isDragging ? "dragging" : ""}`}>
                  <div className="w-12 h-12 rounded-full bg-surface-high flex items-center justify-center mx-auto mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Drop images here or{" "}
                    <span className="text-secondary underline underline-offset-2">tap to upload</span>
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-wider text-outline mt-2">
                    Up to {MAX_IMAGES} images
                  </p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </div>
              )}

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group bg-surface-high">
                      <img src={img.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/50 text-on-primary text-xs uppercase tracking-wider font-medium border-none cursor-pointer">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-14">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pill btn-primary w-full py-4 text-sm">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner-atelier !w-4 !h-4 !border-white/30 !border-t-white" />
                  Publishing...
                </span>
              ) : "Publish Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
