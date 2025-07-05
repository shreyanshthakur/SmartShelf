const mongoose = require("mongoose");

// Replace with your MongoDB connection string
const mongoUri =
  "mongodb+srv://thakurshreyansh11:r8j8eubcX4VOdGby@cluster0.2m664.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Unable to connect to the db");
    process.exit(1);
  }
};

module.exports = { connectDB };
