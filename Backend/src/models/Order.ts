import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderItems: Array<{
    _id?: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
    priceAtTimeOfAdding: number;
    addedAt: Date;
  }>;

  status: "placed" | "completed" | "cancelled";

  createdAt: Date;
  updatedAt: Date;

  totalAmount: number;
  estimatedDeliveryDate: Date;
  deliveryAddress: string;
  paymentMethod: string;

  isOverdue: boolean;
  itemCount: number;
  canBeCancelled: boolean;

  cancelOrder(): Promise<IOrder>;
  completeOrder(): Promise<IOrder>;
}

interface IOrderModel extends mongoose.Model<IOrder> {
  findOverdue(): Promise<IOrder[]>;
  getUserOrders(userId: Types.ObjectId, status?: string): Promise<IOrder[]>;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
      index: true,
    },

    orderItems: [
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
        values: ["placed", "completed", "cancelled"],
        message: "Status must be placed, completed or cancelled",
      },
      default: "placed",
      index: true,
    },

    totalAmount: {
      type: Number,
      required: [true, "total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },

    estimatedDeliveryDate: {
      type: Date,
      required: [true, "Estimate delivery date is required"],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Estimate delivery date must be in the future",
      },
    },

    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
      minlength: [10, "Delivery address must be at least 10 characters long"],
      maxlength: [500, "Delivery address cannot be more than 500 characters"],
    },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["card", "cash", "upi", "netbanking"],
        message: "Payment method must be card, cash, upi, or netbanking",
      },
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.virtual("itemCount").get(function () {
  return this.orderItems.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual("isOverdue").get(function () {
  return (
    this.status !== "completed" &&
    this.status !== "cancelled" &&
    new Date() > this.estimatedDeliveryDate
  );
});

// VIRTUAL FIELD: Check if order can be cancelled (only placed orders can be cancelled)
orderSchema.virtual("canBeCancelled").get(function () {
  return this.status === "placed";
});

// FIX: Add compound index for common query pattern (userId + status)
// This makes queries like "get all placed orders for user X" much faster
orderSchema.index({ userId: 1, status: 1 });

// Add index for delivery date queries (e.g., "orders to deliver today")
orderSchema.index({ estimatedDeliveryDate: 1, status: 1 });

// Add index for recent orders queries
orderSchema.index({ createdAt: -1 });

// INSTANCE METHOD: Cancel an order (with business logic validation)
orderSchema.methods.cancelOrder = async function () {
  if (this.status !== "placed") {
    throw new Error(`Cannot cancel order with status: ${this.status}`);
  }

  this.status = "cancelled";
  return this.save();
};

// INSTANCE METHOD: Mark order as completed
orderSchema.methods.completeOrder = async function () {
  if (this.status === "cancelled") {
    throw new Error("Cannot complete a cancelled order");
  }

  this.status = "completed";
  return this.save();
};

// STATIC METHOD: Find overdue orders
orderSchema.statics.findOverdue = function () {
  return this.find({
    status: "placed",
    estimatedDeliveryDate: { $lt: new Date() },
  });
};

// STATIC METHOD: Get user's order history
orderSchema.statics.getUserOrders = function (
  userId: Types.ObjectId,
  status?: string
) {
  const query: any = { userId };
  if (status) query.status = status;

  return this.find(query)
    .sort({ createdAt: -1 })
    .populate("orderItems.productId", "itemName itemDisplayImage itemPrice");
};

// PRE-SAVE HOOK: Validate that items array is not empty
orderSchema.pre("save", function (next) {
  if (!this.orderItems || this.orderItems.length === 0) {
    return next(new Error("Order must contain at least one item"));
  }
  next();
});

const Order = mongoose.model<IOrder, IOrderModel>("Order", orderSchema);

export default Order;
