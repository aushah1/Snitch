import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  getSellerProducts,
  createProduct,
  getAllProducts,
  getProductDetails,
  addProductVariant,
  searchProducts,
} from "../services/product.api";
import { setSellerProducts, setProducts, setLoading } from "../product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleGetSellerProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getSellerProducts();
      dispatch(setSellerProducts(data.products));
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleCreateProduct = useCallback(
    async (formData) => {
      try {
        dispatch(setLoading(true));

        const data = await createProduct(formData);
        await handleGetSellerProducts();
        return data.product;
      } catch (error) {
        console.error("Error creating product:", error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [handleGetSellerProducts],
  );

  const handleGetAllProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getAllProducts();
      dispatch(setProducts(data.products));
      return data.products;
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  const handleGetProductDetails = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await getProductDetails(id);
      return data.product;
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  const handleAddProductVariant = useCallback(
    async (productId, variantData) => {
      try {
        dispatch(setLoading(true));
        const data = await addProductVariant(productId, variantData);
        return data;
      } catch (error) {
        console.error("Error adding product variant:", error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [],
  );

  const handleSearchProducts = useCallback(async (query) => {
    try {
      dispatch(setLoading(true));
      const products = await searchProducts(query);
      dispatch(setProducts(products));
      return products;
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  return {
    handleGetSellerProducts,
    handleCreateProduct,
    handleGetAllProducts,
    handleGetProductDetails,
    handleAddProductVariant,
    handleSearchProducts,
  };
};
