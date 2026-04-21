import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";
import Navbar from "../../products/components/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const {
    handleGetCart,
    handleRemoveFromCart,
    handleCalculateCartTotal,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
  } = useCart();
  const cartItems = useSelector((state) => state.cart.items);
  const loading = useSelector((state) => state.cart.loading);
  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setFetchError(null);
        const cart = await handleGetCart();
        if (cart) {
          await handleCalculateCartTotal(cart);
        }
      } catch (err) {
        setFetchError("Unable to load your cart.");
        console.error(err);
      }
    };
    fetchCart();
  }, [handleGetCart, handleCalculateCartTotal]);
  console.log(cartItems);

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      item.variant?.price?.amount || item.product?.price?.amount || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const currency =
    cartItems[0]?.variant?.price?.currency ||
    cartItems[0]?.product?.price?.currency ||
    "INR";

  const currencySymbol =
    {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
    }[currency] || currency;

  // Loading
  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="pt-28 pb-20 px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="h-4 shimmer rounded-full w-1/6 mb-3" />
            <div className="h-10 shimmer rounded-full w-1/3 mb-2" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-6 bg-surface-lowest rounded-2xl p-6 shadow-ambient">
                <div className="w-28 h-28 shimmer rounded-xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 shimmer rounded-full w-1/2" />
                  <div className="h-3 shimmer rounded-full w-3/4" />
                  <div className="h-6 shimmer rounded-full w-1/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-5xl mx-auto page-enter">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-outline hover:text-secondary transition-colors bg-transparent border-none cursor-pointer mb-10">
          ← Continue Shopping
        </button>

        {/* Header */}
        <div className="mb-12">
          <p className="label-atelier text-secondary mb-3">// Your Bag</p>
          <h1 className="font-headline text-4xl lg:text-5xl text-on-surface font-light">
            Shopping <em className="italic">Cart</em>
          </h1>
        </div>

        {/* Error */}
        {fetchError && (
          <div className="mb-8 py-4 px-6 bg-error-container/30 rounded-2xl">
            <p className="text-sm text-error">{fetchError}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-surface-low rounded-[2rem]">
            <div className="text-center max-w-sm">
              {/* Cart Icon */}
              <div className="w-20 h-20 rounded-full bg-surface-high flex items-center justify-center mx-auto mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-outline-variant">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <p className="font-headline text-3xl italic text-outline-variant mb-3">
                Your Bag is Empty
              </p>
              <p className="text-sm text-outline font-light leading-relaxed mb-8">
                Discover our curated collection and find pieces that speak to
                you.
              </p>
              <button
                onClick={() => navigate("/")}
                className="btn-pill btn-primary">
                Explore Collection
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-5 stagger-children">
              {cartItems.map((item, index) => {
                console.log(item);

                const product = item.product || {};
                const variantId = typeof item.variant === 'string' ? item.variant : item.variant?._id;
                const variant = product?.variants?.find(v => v._id === variantId) || (typeof item.variant === 'object' ? item.variant : {});
                
                const price =
                  variant.price?.amount || product.price?.amount || 0;
                const itemCurrency =
                  variant.price?.currency || product.price?.currency || "INR";
                const imageUrl =
                  variant.images?.[0]?.url ||
                  product.variants?.[0]?.images?.[0]?.url ||
                  product.images?.[0]?.url;
                const sym =
                  { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" }[
                    itemCurrency
                  ] || itemCurrency;

                return (
                  <div
                    key={item._id || index}
                    className="bg-surface-lowest rounded-2xl p-5 shadow-ambient hover:shadow-ambient-hover transition-all group">
                    <div className="flex gap-5">
                      {/* Image */}
                      <div
                        className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-surface-high shrink-0 cursor-pointer img-zoom"
                        onClick={() =>
                          product._id && navigate(`/products/${product._id}`)
                        }>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-headline italic text-outline-variant text-sm">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3
                            className="font-headline text-lg text-on-surface line-clamp-1 cursor-pointer hover:text-secondary transition-colors"
                            onClick={() =>
                              product._id &&
                              navigate(`/products/${product._id}`)
                            }>
                            {product.title || "Untitled Product"}
                          </h3>
                          {/* Variant attributes */}
                          {variant.attributes &&
                            Object.keys(variant.attributes).length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(variant.attributes).map(
                                  ([key, value]) => (
                                    <span
                                      key={key}
                                      className="text-[0.6rem] uppercase tracking-wider bg-surface-high text-on-surface-variant rounded-full px-3 py-1">
                                      {key}: {value}
                                    </span>
                                  ),
                                )}
                              </div>
                            )}
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-end justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center gap-1">
                            <span className="text-[0.6rem] uppercase tracking-wider text-outline mr-2">
                              Qty
                            </span>
                            <div className="flex items-center bg-surface-high rounded-full overflow-hidden">
                              <button
                                onClick={async () => {
                                  try {
                                    await handleDecreaseQuantity({
                                      productId: item.product._id,
                                      variantId: variantId,
                                    });
                                  } catch (err) {
                                    console.error(
                                      "Failed to decrease quantity:",
                                      err,
                                    );
                                  }
                                }}
                                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-highest transition-colors border-none bg-transparent cursor-pointer text-sm">
                                −
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-on-surface">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={async () => {
                                  try {
                                    await handleIncreaseQuantity({
                                      productId: item.product._id,
                                      variantId: variantId,
                                    });
                                  } catch (err) {
                                    console.error(
                                      "Failed to increase quantity:",
                                      err,
                                    );
                                  }
                                }}
                                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-highest transition-colors border-none bg-transparent cursor-pointer text-sm">
                                +
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="font-headline text-xl text-on-surface">
                              {sym}
                              {(price * (item.quantity || 1)).toLocaleString()}
                            </span>
                            {(item.quantity || 1) > 1 && (
                              <p className="text-[0.6rem] text-outline mt-0.5">
                                {sym}
                                {price.toLocaleString()} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={async () => {
                          try {
                            await handleRemoveFromCart({
                              productId: item.product._id,
                              variantId: variantId,
                            });
                          } catch (err) {
                            console.error("Failed to remove item:", err);
                          }
                        }}
                        className="self-start w-8 h-8 flex items-center justify-center rounded-full hover:bg-error-container/30 text-outline hover:text-error transition-all cursor-pointer border-none bg-transparent opacity-0 group-hover:opacity-100 shrink-0">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface-lowest rounded-[1.5rem] p-7 shadow-ambient sticky top-28">
                <p className="label-atelier text-secondary mb-5">// Summary</p>
                <h3 className="font-headline text-xl text-on-surface mb-6">
                  Order <em className="italic">Summary</em>
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-light">
                      Subtotal ({cartTotal?.itemCount || cartItems.length}{" "}
                      {(cartTotal?.itemCount || cartItems.length) === 1
                        ? "item"
                        : "items"}
                      )
                    </span>
                    <span className="text-on-surface font-medium">
                      {currencySymbol}
                      {(cartTotal?.subtotal || subtotal).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-light">
                      Shipping
                    </span>
                    <span className="text-secondary font-medium text-xs uppercase tracking-wider">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-light">
                      Tax
                    </span>
                    <span className="text-on-surface-variant font-light text-xs">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="tonal-divider !my-5" />

                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-sm font-medium text-on-surface uppercase tracking-wider">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="font-headline text-3xl text-on-surface">
                      {currencySymbol}
                      {(cartTotal?.total || subtotal).toLocaleString()}
                    </span>
                    <p className="text-[0.6rem] text-outline uppercase tracking-wider mt-1">
                      {cartTotal?.currency || currency}
                    </p>
                  </div>
                </div>

                <button className="btn-pill btn-primary w-full py-4 text-sm mb-3">
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="btn-pill bg-transparent text-on-surface w-full py-3 text-xs ghost-border hover:bg-surface-high">
                  Continue Shopping
                </button>

                {/* Trust badges */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5 text-[0.55rem] uppercase tracking-wider text-outline">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-secondary">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Secure
                  </div>
                  <div className="w-px h-3 bg-outline-variant/30" />
                  <div className="flex items-center gap-1.5 text-[0.55rem] uppercase tracking-wider text-outline">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-secondary">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    Authentic
                  </div>
                  <div className="w-px h-3 bg-outline-variant/30" />
                  <div className="flex items-center gap-1.5 text-[0.55rem] uppercase tracking-wider text-outline">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-secondary">
                      <polyline points="20 12 20 22 4 22 4 12" />
                      <rect x="2" y="7" width="20" height="5" />
                      <line x1="12" y1="22" x2="12" y2="7" />
                      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                    </svg>
                    Gift Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
