import { Query } from "mongoose";
import Item from "../models/Item";
import { Request, Response } from "express";

/**
 * @swagger
 * /api/v1/items:
 *  get:
 *    summary: Get paginated list of items
 *    description: Retrieve items with pagination support
 *    tags: [Items]
 *    parameters:
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *        description: Search Text
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *          minimum: 1
 *        description: Page number
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 25
 *          minimum: 10
 *          maximum: 100
 *        description: Items per page (10 - 100)
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  type: object
 *                  properties:
 *                    items:
 *                      type: array
 *                      items:
 *                        type: object
 *                pagination:
 *                  type: object
 *                  properties:
 *                    currentPage:
 *                      type: integer
 *                    totalPages:
 *                      type: integer
 *                    totalItems:
 *                      type: integer
 *                    hasMore:
 *                      type: boolean
 *      400:
 *        description: Invalid parameters
 *      500:
 *        description: Server error
 *
 */
export const getItemsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pageProvided = req.query.page !== undefined;
    const limitProvided = req.query.limit !== undefined;

    const searchTextProvided = req.query.search !== undefined;

    const currentPage = pageProvided ? parseInt(req.query.page as string) : 1;
    const limit = limitProvided ? parseInt(req.query.limit as string) : 25;
    const searchText = searchTextProvided ? (req.query.search as string) : "";
    const query = searchTextProvided
      ? {
          $text: { $search: searchText },
        }
      : {};
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
    const items = await Item.find(query)
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);
    const totalItems = await Item.find(query).countDocuments();
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
