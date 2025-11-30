import { Router } from "express";
import Item from "../models/Item";
import { getItemsController } from "../items/getItemsController";
import { getItemByIdController } from "../items/getItemByIdController";

const router = Router();

router.get("/items", getItemsController);
router.get("/items/:id", getItemByIdController);

router.post("/itemList", async (req, res) => {
  try {
    const data = req.body;
    const newItem = new Item(data);
    await newItem.save();
    res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (err) {
    res.status(500).json({ error: "Failed to post item to database" });
  }
});

export default router;
