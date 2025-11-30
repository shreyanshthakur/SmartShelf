import { Request, Response } from "express";
import Item from "../models/Item";

export const getItemByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate("owner", "username", "email");
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
