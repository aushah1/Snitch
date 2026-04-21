import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  addToCart,
  getCart,
  getCartTotal,
  removeFromCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
} from "../services/cart.api";
import { setCartItems, setLoading , setCartTotal } from "../cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleGetCart = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getCart();
      dispatch(setCartItems(data.cart?.items || []));
      return data.cart;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleAddToCart = useCallback(
    async ({ productId, variantId, quantity = 1 }) => {
      try {
        dispatch(setLoading(true));
        const data = await addToCart({ productId, variantId, quantity });
        // Refresh cart after adding
        await handleGetCart();
        return data;
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, handleGetCart],
  );

  const handleRemoveFromCart = useCallback(
    async ({ productId, variantId }) => {
      try {
        dispatch(setLoading(true));
        const data = await removeFromCart({ productId, variantId });
        // Refresh cart after removing
        await handleGetCart();
        return data;
      } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, handleGetCart],
  );

  const handleCalculateCartTotal = useCallback(
    async (cart) => {
      try {
        dispatch(setLoading(true));
        const data = await getCartTotal(cart);
        dispatch(setCartTotal(data.total));
        return data;
      } catch (error) {
        console.error("Error calculating cart total:", error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleIncreaseQuantity = useCallback(
    async ({ productId, variantId }) => {
      try {
        dispatch(setLoading(true));
        const data = await increaseCartItemQuantity({
          productId,
          variantId,
        });
        // Refresh cart after increasing
        await handleGetCart();
        return data;
      } catch (error) {
        console.error("Error increasing quantity:", error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, handleGetCart],
  );

  const handleDecreaseQuantity = useCallback(
    async ({ productId, variantId }) => {
      try {
        dispatch(setLoading(true));
        const data = await decreaseCartItemQuantity({
          productId,
          variantId,
        });
        // Refresh cart after decreasing
        await handleGetCart();
        return data;
      } catch (error) {
        console.error("Error decreasing quantity:", error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, handleGetCart],
  );

  return {
    handleGetCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleCalculateCartTotal,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
  };
};
