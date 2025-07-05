const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: String,
  itemPrice: String,
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
