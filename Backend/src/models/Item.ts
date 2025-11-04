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
    required: false,
    validate: {
      validator: function (v: string) {
        if (!v) return true; // Allow empty or undefined
        return /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./?%&=]*)?\.(jpg|jpeg|png|webp|gif)$/i.test(
          v
        );
      },
      message: "Invalid image URL",
    },
  },
  itemImages: {
    type: [String],
    validate: {
      validator: function (v: string[]) {
        if (!v) return true; // Allow undefined or null
        if (v.length > 5) return false;
        const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/;
        return v.every((imgUrl) => urlRegex.test(imgUrl));
      },
      message:
        "Each image must be a valid image URL and you can upload a maximum of 5 images",
    },
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
