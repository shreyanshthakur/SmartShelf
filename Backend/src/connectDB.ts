import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Replace with your MongoDB connection string
const connectionString = process.env.CONNECTION_STRING;
const mongoUri = `${connectionString}/smartShelf`;
console.log(mongoUri);

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Unable to connect to the db");
    process.exit(1);
  }
};

export default connectDB;
