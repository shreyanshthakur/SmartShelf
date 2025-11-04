import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: String,
  itemPrice: {
    type: Number,
    required: true,
  },
  itemCategory: String,
  itemStock: {
    type: Number,
    required: true,
  },
  itemDisplayImage: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v);
      },
      message: "Invalid image URL",
    },
  },
  itemImages: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        return v.length <= 5;
      },
      message: "You can upload a maximum of 5 images",
    },
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
