import { Router } from "express";
import Item from "../models/Item";
import { getItemsController } from "../items/getItemsController";

const router = Router();

router.get("/itemList", getItemsController);

router.get("/itemList/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch the item" });
  }
});

/**
 * Route: POST /itemList
 * Description: Add a new item to the database.
 * Request:
 *   - Body:
 *      - itemName (string): The name of the item (required).
 *      - itemPrice (number): The price of the item (required).
 *      - itemDescription (string): A description for the item (optional).
 *      - itemCategory (string): The category of the item (optional).
 *      - itemStock (number): The stock quantity of the item (required).
 *      - itemDisplayImage (string): The URL of the display image of the item (optional).
 *      - itemImages (array of strings): URLs of additional images (optional).
 * Response:
 *    - 201: Returns a success message and the created item data.
 *    - 500: Returns an error message if the item could not be saved.
 */
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
