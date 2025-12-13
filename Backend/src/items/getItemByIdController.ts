import { Request, Response } from "express";
import Item from "../models/Item";

export const getItemByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("[DEBUG] Fetching item with id:", id);

    const item = await Item.findById(id);

    if (!item) {
      console.log("[DEBUG] Item not found");
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    console.log("[DEBUG] Item found:", item);
    res.json({ item });
  } catch (err) {
    console.error("[ERROR] Failed to fetch item:", err);
    res.status(500).json({
      error: "Failed to fetch item from database",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
