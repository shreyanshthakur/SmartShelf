const express = require("express");
const app = express();
const { connectDB } = require("./connectDB");
connectDB();
const PORT = 5000;
const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("api/v1/itemList", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items from database" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
