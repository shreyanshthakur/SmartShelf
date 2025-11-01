import express from "express";
import cors from "cors";
import connectDB from "./connectDB";

import authRoutes from "./routes/auth";
import itemRoutes from "./routes/items";

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
