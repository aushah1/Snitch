import axios from "axios";

const cartApi = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});



export const addToCart = async ({ productId, variantId, quantity }) => {
  try {
    const response = await cartApi.post(`/add/${productId}/${variantId}`, {quantity });
    return response.data;
  }
  catch (error) {
    console.error("Error adding to cart:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const getCart = async () => {
  try {
    const response = await cartApi.get(`/`);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching cart:", error);
    throw error.response?.data || { message: "Server error" };
  }
};