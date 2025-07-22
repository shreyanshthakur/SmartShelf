import { Router } from "express";
import Item from "../models/Item";

const router = Router();

router.get("/itemList", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items from database" });
  }
});

router.get("itemList/:id", async (req, res) => {
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

router.post("itemList", async (req, res) => {
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

export default router;
