import { useDispatch } from "react-redux";
import {
  loginUser,
  registerUser,
  googleLogin,
  getUser,
} from "../services/auth.api";
import { setLoading, setUser } from "../auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await loginUser({ email, password });
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller,
  }) {
    try {
      dispatch(setLoading(true));
      const data = await registerUser({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });
      console.log("Register response user:", data.user);
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGoogleLogin() {
    try {
      dispatch(setLoading(true));
      const data = await googleLogin();
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleGetUser() {
    try {
      dispatch(setLoading(true));
      const data = await getUser();
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      console.error("Fetching user failed:", error);
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleLogin, handleRegister, handleGoogleLogin, handleGetUser };
};
