import { Request, Response } from "express";
import Item from "../models/Item";

export const getItemByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({ item });
  } catch (err) {
    console.error("[ERROR] Failed to fetch item:", err);
    res.status(500).json({
      error: "Failed to fetch item from database",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
