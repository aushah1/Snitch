import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    loading: false,
    similarProducts: [],
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSimilarProducts: (state, action) => {
      state.similarProducts = action.payload;
    },
  },
});

export const { setSellerProducts, setProducts, setLoading, setSimilarProducts } =
  productSlice.actions;
export default productSlice.reducer;
