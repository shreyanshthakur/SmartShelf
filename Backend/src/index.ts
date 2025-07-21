import express from "express";
import cors from "cors";
import connectDB from "./connectDB";
import Item from "./models/Item";

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

app.get("/api/v1/itemList", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items from database" });
  }
});

app.get("/api/v1/itemList/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "unable to fetch the item" });
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
