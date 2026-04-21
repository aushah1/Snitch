import axios from "axios";

const cartApi = axios.create({
  baseURL: "https://snitch-yhyl.onrender.com/api/cart",
  withCredentials: true,
});

export const addToCart = async ({ productId, variantId, quantity }) => {
  try {
    const response = await cartApi.post(`/add/${productId}/${variantId}`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const getCart = async () => {
  try {
    const response = await cartApi.get(`/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const getCartTotal = async (cart) => {
  try {
    const response = await cartApi.post(`/calculate`, { cart });
    return response.data;
  } catch (error) {
    console.error("Error calculating cart total:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const removeFromCart = async ({ productId, variantId }) => {
  try {
    const response = await cartApi.post(`/remove/${productId}/${variantId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const increaseCartItemQuantity = async ({ productId, variantId }) => {
  try {
    const response = await cartApi.get(`/increase/${productId}/${variantId}`);
    return response.data;
  } catch (error) {
    console.error("Error increasing cart item quantity:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const decreaseCartItemQuantity = async ({ productId, variantId }) => {
  try {
    const response = await cartApi.get(`/decrease/${productId}/${variantId}`);
    return response.data;
  } catch (error) {
    console.error("Error decreasing cart item quantity:", error);
    throw error.response?.data || { message: "Server error" };
  }
};
