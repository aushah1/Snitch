import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartTotal: null,
    loading: false,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCartTotal: (state, action) => {
      state.cartTotal = action.payload;
    },
  },
});

export const { setCartItems, setLoading, setCartTotal } = cartSlice.actions;
export default cartSlice.reducer;
