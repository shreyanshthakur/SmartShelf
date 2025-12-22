import express from "express";
import cors from "cors";
import connectDB from "./connectDB";

import authRoutes from "./routes/auth";
import itemRoutes from "./routes/items";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";

import cookieParser = require("cookie-parser");
import dotenv from "dotenv";

dotenv.config();

const PORT = 5000;
const app = express();

// Configure CORS to allow credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Frontend URL from env
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});

try {
  console.log("Connecting to database");
  connectDB();
  console.log("Successfully Connected to database");
} catch {
  console.log("Error connecting to database");
}

// API Routes
app.use("/api/v1/", authRoutes);
app.use("/api/v1", itemRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
