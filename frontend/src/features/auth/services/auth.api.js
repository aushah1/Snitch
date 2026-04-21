import axios from "axios";

const authApi = axios.create({
  baseURL: "https://snitch-yhyl.onrender.com/api/auth",
  withCredentials: true,
});

export const registerUser = async ({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) => {
  try {
    const response = await authApi.post("/register", {
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await authApi.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const googleLogin = async () => {
  try {
    const response = (window.location.href = "/api/auth/google");
    return response.data;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error.response?.data || { message: "Server error" };
  }
};

export const getUser = async () => {
  try {
    const response = await authApi.get("/getme");
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error.response?.data || { message: "Server error" };
  }
};
