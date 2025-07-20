import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  itemName: String,
  itemPrice: String,
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
