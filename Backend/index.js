const express = require("express");
const app = express();
const { connectDB } = require("./connectDB");
const Item = require("./models/Item");
const PORT = 5000;
const cors = require("cors");
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

app.get("/api/v1/itemList", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items from database" });
  }
});

app.post("/api/v1/itemList", async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);
    const newItem = new Item(data);
    await newItem.save();
    res.status(201).json({ message: "Item received", data });
  } catch (err) {
    res.status(500).json({ error: "Failed to post item to database" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
