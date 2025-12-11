import { Request, Response } from "express";
import Item from "../models/Item";

export const getItemByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("[DEBUG] id is: ", id);
    console.log("[DEBUG] here");
    const item = await Item.findById(id).populate("owner", "username email");
    console.log("[DEBUD] item is: ", item);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Unable to fetch specific item by ID",
      });
    }
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items from database" });
  }
};
