import { Request, Response } from "express";
import Item from "../models/Item";

export const createItemController = async (req: Request, res: Response) => {
  try {
    console.log("[DEBUG] Request body:", req.body);
    console.log("[DEBUG] User from middleware:", (req as any).user);
    console.log("[DEBUG] Uploaded images:", (req as any).uploadedImages);

    const { name, description, category, price, stock } = req.body;
    const userId = (req as any).user?.userId; // Changed from .id to .userId
    const uploadedImages = (req as any).uploadedImages;

    // Validation
    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Name, category, and price are required",
      });
    }

    if (!uploadedImages || uploadedImages.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    // Map to correct Item model field names
    const item = new Item({
      itemName: name,
      itemDescription: description,
      itemCategory: category,
      itemPrice: Number(price),
      itemStock: stock ? Number(stock) : 1,
      createdBy: userId,
      itemImages: uploadedImages.map((img: any) => img.url),
      itemDisplayImage: uploadedImages[0]?.url, // Use first image as display
    });

    await item.save();

    console.log("[SUCCESS] Item created:", item._id);

    res.status(201).json({
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    console.error("[ERROR] Error creating item:", error);

    if (error instanceof Error) {
      console.error("[ERROR] Message:", error.message);
      console.error("[ERROR] Stack:", error.stack);
    }

    res.status(500).json({
      message: "Error creating item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
