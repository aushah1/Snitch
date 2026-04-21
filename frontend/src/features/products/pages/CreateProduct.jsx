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
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variantForm, setVariantForm] = useState({
    attributes: {},
    stock: "",
    attributeKey: "",
    attributeValue: "",
    images: [],
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const variantFileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const toAdd = Array.from(files).slice(0, remaining);
    const newImages = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [images],
  );
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !formData.tags.includes(val)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddAttribute = () => {
    if (!variantForm.attributeKey || !variantForm.attributeValue) return;
    setVariantForm((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [prev.attributeKey]: prev.attributeValue,
      },
      attributeKey: "",
      attributeValue: "",
    }));
  };

  const handleRemoveAttribute = (key) => {
    setVariantForm((prev) => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[key];
      return { ...prev, attributes: newAttributes };
    });
  };

  const handleAddVariant = () => {
    if (
      !variantForm.stock ||
      Object.keys(variantForm.attributes).length === 0
    ) {
      alert("Please add at least one attribute and specify stock");
      return;
    }
    const newVariant = {
      attributes: variantForm.attributes,
      stock: parseInt(variantForm.stock),
      price: {
        amount: formData.priceAmount,
        currency: formData.priceCurrency,
      },
      images: variantForm.images.map((img) => ({
        file: img.file,
        preview: img.preview,
      })),
    };
    setVariants((prev) => [...prev, newVariant]);
    setVariantForm({
      attributes: {},
      stock: "",
      attributeKey: "",
      attributeValue: "",
      images: [],
    });
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantFiles = (files) => {
    const toAdd = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setVariantForm((prev) => ({
      ...prev,
      images: [...prev.images, ...toAdd],
    }));
  };

  const handleVariantFileChange = (e) => {
    handleVariantFiles(e.target.files);
    e.target.value = "";
  };

  const handleRemoveVariantImage = (index) => {
    setVariantForm((prev) => {
      const updated = [...prev.images];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  // const getUniqueAttributeValues = () => {
  //   const attributeMap = {};
  //   variants.forEach((variant) => {
  //     Object.entries(variant.attributes).forEach(([key, value]) => {
  //       if (!attributeMap[key]) {
  //         attributeMap[key] = new Set();
  //       }
  //       attributeMap[key].add(value);
  //     });
  //   });
  //   return attributeMap;
  // };

  // const groupVariantsByAttribute = () => {
  //   const groupedByAttribute = {};
  //   variants.forEach((variant, index) => {
  //     Object.entries(variant.attributes).forEach(([key, value]) => {
  //       if (!groupedByAttribute[key]) {
  //         groupedByAttribute[key] = {};
  //       }
  //       if (!groupedByAttribute[key][value]) {
  //         groupedByAttribute[key][value] = [];
  //       }
  //       groupedByAttribute[key][value].push(index);
  //     });
  //   });
  //   return groupedByAttribute;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (variants.length === 0) {
      alert("Please add at least one variant");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      data.append("tags", JSON.stringify(formData.tags));

      // Format variants with their images
      const variantsWithImages = variants.map((variant) => ({
        attributes: variant.attributes,
        stock: variant.stock,
        price: variant.price,
        images: variant.images.map((img, idx) => ({
          url: img.preview,
          index: idx,
        })),
      }));
      data.append("variants", JSON.stringify(variantsWithImages));

      // Add variant images with variant index
      variants.forEach((variant, variantIdx) => {
        variant.images.forEach((img) => {
          data.append(`variant-${variantIdx}-images`, img.file);
        });
      });

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
                <label htmlFor="cp-title" className="label-atelier">
                  Product Title
                </label>
                <input
                  id="cp-title"
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Oversized Linen Shirt"
                  className="input-atelier"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="cp-description" className="label-atelier">
                  Description
                </label>
                <textarea
                  id="cp-description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product — material, fit, details..."
                  className="input-atelier"
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="cp-tags" className="label-atelier">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-[0.05em] bg-surface-high border border-outline-variant flex items-center gap-1 group text-on-surface">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="opacity-50 group-hover:opacity-100 hover:text-error transition-all cursor-pointer border-none bg-transparent flex items-center justify-center p-0.5 ml-1">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  id="cp-tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Press Enter to add tags (e.g. Summer, Limited Edition)"
                  className="input-atelier"
                />
              </div>

              {/* Price */}
              <div>
                <label className="label-atelier">Pricing</label>
                <div className="flex gap-4">
                  <div className="flex-[3]">
                    <input
                      id="cp-priceAmount"
                      type="number"
                      name="priceAmount"
                      required
                      min="0"
                      step="0.01"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="input-atelier"
                    />
                  </div>
                  <div className="flex-[1]">
                    <select
                      id="cp-priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="input-atelier">
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div>
                <label className="label-atelier">Variants</label>
                <div className="space-y-3">
                  {/* Add Variant Attributes */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Size"
                        value={variantForm.attributeKey}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.length > 0) {
                            val = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                          }
                          setVariantForm((prev) => ({
                            ...prev,
                            attributeKey: val,
                          }));
                        }}
                        className="input-atelier flex-1"
                      />
                      <input
                        type="text"
                        placeholder="e.g. L"
                        value={variantForm.attributeValue}
                        onChange={(e) =>
                          setVariantForm((prev) => ({
                            ...prev,
                            attributeValue: e.target.value,
                          }))
                        }
                        className="input-atelier flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttribute}
                        className="btn-pill bg-surface-high text-on-surface text-xs px-4">
                        Add
                      </button>
                    </div>

                    {/* Selected Attributes */}
                    {Object.keys(variantForm.attributes).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(variantForm.attributes).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center gap-2 bg-surface-high rounded-full px-3 py-1">
                              <span className="text-xs text-on-surface">
                                {key}: {value}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAttribute(key)}
                                className="text-outline hover:text-error transition-colors border-none bg-transparent cursor-pointer">
                                ×
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stock Input & Images */}
                  {Object.keys(variantForm.attributes).length > 0 && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Stock"
                          min="0"
                          value={variantForm.stock}
                          onChange={(e) =>
                            setVariantForm((prev) => ({
                              ...prev,
                              stock: e.target.value,
                            }))
                          }
                          className="input-atelier flex-1"
                        />
                      </div>

                      {/* Variant Images Upload */}
                      <div className="border border-outline-variant rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs label-atelier !mb-0">
                            Variant Images
                          </label>
                          <span className="text-[0.65rem] text-outline">
                            {variantForm.images.length}/{MAX_IMAGES}
                          </span>
                        </div>

                        {variantForm.images.length < MAX_IMAGES && (
                          <button
                            type="button"
                            onClick={() => variantFileInputRef.current?.click()}
                            className="text-xs text-secondary hover:text-secondary/80 transition-colors border-none bg-transparent cursor-pointer underline underline-offset-2">
                            + Add images
                          </button>
                        )}
                        <input
                          ref={variantFileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleVariantFileChange}
                          className="hidden"
                        />

                        {/* Variant Image Previews */}
                        {variantForm.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {variantForm.images.map((img, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-square rounded-lg overflow-hidden group bg-surface-lowest">
                                <img
                                  src={img.preview}
                                  alt={`Variant img ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantImage(idx)}
                                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/50 text-on-primary text-[0.65rem] uppercase tracking-wider font-medium border-none cursor-pointer">
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="btn-pill btn-primary w-full text-xs">
                        Add Variant
                      </button>
                    </div>
                  )}
                </div>

                {/* Variants List */}
                {variants.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-medium text-on-surface">
                      Variants ({variants.length})
                    </h3>
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="border border-outline-variant rounded-lg p-4 bg-surface-lowest">
                        {/* Variant Info */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-xs">
                            <p className="text-on-surface font-medium mb-1">
                              {Object.entries(variant.attributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                            </p>
                            <p className="text-outline">
                              Stock: {variant.stock}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="text-error hover:bg-error-container/30 transition-colors rounded-full w-6 h-6 flex items-center justify-center border-none bg-transparent cursor-pointer text-sm">
                            ×
                          </button>
                        </div>

                        {/* Variant Images */}
                        {variant.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {variant.images.map((img, imgIdx) => (
                              <div
                                key={imgIdx}
                                className="aspect-square rounded-lg overflow-hidden bg-surface-high">
                                <img
                                  src={img.preview}
                                  alt={`${Object.values(variant.attributes).join("-")}-${imgIdx}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {variant.images.length === 0 && (
                          <p className="text-[0.65rem] text-outline italic">
                            No images added
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label-atelier !mb-0">Images</label>
                <span className="text-xs text-outline">
                  {images.length}/{MAX_IMAGES}
                </span>
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-outline">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Drop images here or{" "}
                    <span className="text-secondary underline underline-offset-2">
                      tap to upload
                    </span>
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-wider text-outline mt-2">
                    Up to {MAX_IMAGES} images
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group bg-surface-high">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
              ) : (
                "Publish Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
