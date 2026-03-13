import Item from "../models/Item";
import { Request, Response } from "express";

export const getItemsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pageProvided = req.query.page !== undefined;
    const limitProvided = req.query.limit !== undefined;

    const currentPage = pageProvided ? parseInt(req.query.page as string) : 1;
    const limit = limitProvided ? parseInt(req.query.limit as string) : 25;

    if (pageProvided && isNaN(currentPage)) {
      res
        .status(400)
        .json({ success: false, message: "Page must be a valid number" });
      return;
    }
    if (limitProvided && isNaN(limit)) {
      res.status(400).json({
        success: false,
        message: "Limit must be a valid number",
      });
      return;
    }
    if (currentPage < 1) {
      res.status(400).json({
        success: false,
        message: "Page must be at least 1",
      });
      return;
    }
    if (limit < 10 || limit > 100) {
      res.status(400).json({
        success: false,
        message: "Limit must be between 10-100",
      });
      return;
    }
    const offset = (currentPage - 1) * limit;
    const items = await Item.find().sort({ _id: -1 }).skip(offset).limit(limit);
    const totalItems = await Item.find().countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = currentPage < totalPages;
    res.status(200).json({
      success: true,
      data: {
        items: items,
      },
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasMore,
      },
    });
  } catch (err) {
    console.error("Error fetching items: ", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch items from database",
    });
  }
};
