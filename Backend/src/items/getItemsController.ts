import Item from "../models/Item";
import { Request, Response } from "express";

export const getItemsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  // this route should return all the items in the database
  try {
    const items = await Item.find();
    if (!items) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items from database" });
  }
};
