import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    itemName: string;
    itemPrice: number;
    itemDisplayImage: string;
    itemStock: number;
  };
  quantity: number;
  priceAtTimeOfAdding: number;
  addedAt: string;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: string; quantity: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/cart",
        { productId, quantity },
        { withCredentials: true }
      );
      return response.data.cart;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to add to cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
