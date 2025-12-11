import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

export interface CartItem {
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
      console.log("[DEBUG] Calling post api for cart (addToCart)");
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

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/cart", {
        withCredentials: true,
      });
      return response.data.cart;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch cart"
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/cart/${itemId}`,
        { quantity },
        { withCredentials: true }
      );
      return response.data.cart;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async ({ itemId }: { itemId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/cart/${itemId}`,
        { withCredentials: true }
      );
      return response.data.cart;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to delete item from cart"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete("http://localhost:5000/api/v1/cart", {
        withCredentials: true,
      });
      return response.data.cart;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to clear cart"
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
    clearCartState: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.error = null;
    },
    incrementItemQuantity: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalItems += 1;
        state.totalAmount += item.priceAtTimeOfAdding;
      }
    },
    decrementItemQuantity: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalItems -= 1;
        state.totalAmount -= item.priceAtTimeOfAdding;
      }
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
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
      });
  },
});

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalAmount = (state: { cart: CartState }) =>
  state.cart.totalAmount;
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.totalItems;
export const selectCartLoading = (state: { cart: CartState }) =>
  state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
