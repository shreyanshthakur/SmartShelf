import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  items: Array<{
    _id?: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
    priceAtTimeOfAdding: number;
    addedAt: Date;
  }>;

  createdAt: Date;
  updatedAt: Date;

  totalAmount: number;
  totalItems: number;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
      unique: true,
    },

    items: [
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
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual fields
cartSchema.virtual("totalAmount").get(function () {
  return this.items.reduce(
    (sum, item) => sum + item.priceAtTimeOfAdding * item.quantity,
    0
  );
});

cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Index for performance
cartSchema.index({ updatedAt: 1 });

// Pre-save hook: Clean up items with 0 or negative quantity
cartSchema.pre("save", function (next) {
  this.items = this.items.filter((item) => item.quantity > 0);
  next();
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
