import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Use Google's public DNS to resolve MongoDB Atlas SRV records
// (required when home router DNS does not support SRV record forwarding)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Replace with your MongoDB connection string
const connectionString = process.env.CONNECTION_STRING;
const mongoUri = `${connectionString}/smartShelf`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Successfully connected to database");
  } catch (e) {
    console.error("Unable to connect to the db:", (e as Error).message);
    process.exit(1);
  }
};

export default connectDB;
