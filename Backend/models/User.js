const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEmail: String,
  userPassword: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
