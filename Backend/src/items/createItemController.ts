import { Request, Response } from "express";
import Item from "../models/Item";

export const createItemController = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price } = req.body;
    const userId = (req as any).user.id;
    const uploadedImages = (req as any).uploadedImages;

    const item = new Item({
      name,
      description,
      category,
      price,
      owner: userId,
      images: uploadedImages?.map((img: any) => img.url) || [],
    });

    await item.save();

    res.status(201).json({
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item" });
  }
};
