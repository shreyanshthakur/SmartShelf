import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    itemName: string;
    itemPrice: number;
    itemDisplayImage: string;
  };
  quantity: number;
  priceAtTimeOfAdding: number;
  addedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderItems: OrderItem[];
  status: "placed" | "completed" | "cancelled";
  totalAmount: number;
  estimateDeliverDate: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  filter: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  filter: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (status: string | undefined, { rejectWithValue }) => {
    try {
      const url = status
        ? `http://localhost:5000/api/v1/get-orders?status=${status}`
        : "http://localhost:5000/api/v1/get-orders";

      const response = await axios.get(url, {
        withCredentials: true,
      });
      return { orders: response.data.orders, filter: response.data.filter };
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch orders";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/get-orders/${orderId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.orders;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch order details";
      return rejectWithValue(errorMessage);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.filter = action.payload.filter;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.orders = [];
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentOrder = null;
      });
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
