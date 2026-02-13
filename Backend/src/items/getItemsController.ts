import Item from "../models/Item";
import { Request, Response } from "express";

export const getItemsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const items = await Item.find().skip(skip).limit(limit);
    if (!items) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items from database" });
  }
};
