import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addToCart, getCart } from "../services/cart.api";
import { setCartItems, setLoading } from "../cart.slice";

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

  return {
    handleGetCart,
    handleAddToCart,
  };
};
