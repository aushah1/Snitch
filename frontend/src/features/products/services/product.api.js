import axios from "axios";

const productApi = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export const createProduct = async (formData) => {
  try {
    const response = await productApi.post("/", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const getSellerProducts = async () => {
  try {
    const response = await productApi.get("/seller");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const getAllProducts = async () => {
  try {
    const response = await productApi.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await productApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const addProductVariant = async (productId, variantData) => {
  try {
    console.log("Adding variant with data:", variantData);
    const formData = new FormData();

    // Add attributes
    formData.append("attributes", JSON.stringify(variantData.attributes));

    // Add stock
    formData.append("stock", variantData.stock);

    // Add price
    formData.append("priceAmount", variantData.price.amount);
    formData.append("priceCurrency", variantData.price.currency);

    variantData.images.forEach((image) => {
      formData.append(`images`, image.file);
    });

    const response = await productApi.post(`/${productId}/variants`, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding product variant:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await productApi.get(
      `/search?query=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error.response?.data || { message: "Server error" };
  }
};


export const getSimilarProducts = async (productId) => {
  try {
    const response = await productApi.get(`/similar/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error.response?.data || { message: "Server error" };
  }
};