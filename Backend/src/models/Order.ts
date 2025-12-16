import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  orders: Array<{
    _id?: Types.ObjectId;
    productId: Types.ObjectId;
    quentity: number;
    priceAtTimeOfAdding: number;
    addedAt: Date;
  }>;

  status: "placed" | "completed" | "cancelled";

  createdAt: Date;
  totalAmount: number;
  estimatedDeliveryDate: Date;
  deliveryAddress: string;
  paymentMethod: string;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id is required"],
    index: true,
    unique: true,
  },

  orders: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: [true, "Product ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
        default: 1,
      },
      priceAtTimeOfAdding: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  status: {
    type: String,
    enum: {
      values: ["pending", "completed", "cancelled"],
      message: "Status must be pending, completed or cancelled",
    },
    default: "placed",
    index: true,
  },
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
