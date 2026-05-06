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
 *        name: category
 *        schema:
 *          type: string
 *        description: Filter by exact item category
 *      - in: query
 *        name: minPrice
 *        schema:
 *          type: number
 *          minimum: 0
 *        description: Minimum item price filter
 *      - in: query
 *        name: maxPrice
 *        schema:
 *          type: number
 *          minimum: 0
 *        description: Maximum item price filter
 *      - in: query
 *        name: minRating
 *        schema:
 *          type: number
 *          minimum: 0
 *          maximum: 5
 *        description: Minimum rating filter
 *      - in: query
 *        name: sortBy
 *        schema:
 *          type: string
 *          enum: [newest, price, rating]
 *        description: Sort field
 *      - in: query
 *        name: sortOrder
 *        schema:
 *          type: string
 *          enum: [asc, desc]
 *        description: Sort order
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
    const getQueryValue = (value: unknown): string => {
      if (Array.isArray(value)) {
        return String(value[0] ?? "");
      }
      return String(value ?? "");
    };

    const pageProvided = req.query.page !== undefined;
    const limitProvided = req.query.limit !== undefined;

    const searchTextProvided = req.query.search !== undefined;
    const categoryProvided = req.query.category !== undefined;
    const minPriceProvided = req.query.minPrice !== undefined;
    const maxPriceProvided = req.query.maxPrice !== undefined;
    const minRatingProvided = req.query.minRating !== undefined;
    const sortByProvided = req.query.sortBy !== undefined;
    const sortOrderProvided = req.query.sortOrder !== undefined;

    const currentPage = pageProvided
      ? parseInt(getQueryValue(req.query.page), 10)
      : 1;
    const limit = limitProvided
      ? parseInt(getQueryValue(req.query.limit), 10)
      : 25;

    const searchText = searchTextProvided
      ? getQueryValue(req.query.search).trim()
      : "";
    const category = categoryProvided
      ? getQueryValue(req.query.category).trim()
      : "";

    const minPriceText = minPriceProvided
      ? getQueryValue(req.query.minPrice).trim()
      : "";
    const maxPriceText = maxPriceProvided
      ? getQueryValue(req.query.maxPrice).trim()
      : "";
    const minRatingText = minRatingProvided
      ? getQueryValue(req.query.minRating).trim()
      : "";

    const minPrice = minPriceProvided ? Number(minPriceText) : undefined;
    const maxPrice = maxPriceProvided ? Number(maxPriceText) : undefined;
    const minRating = minRatingProvided ? Number(minRatingText) : undefined;

    const sortBy = sortByProvided
      ? getQueryValue(req.query.sortBy).trim().toLowerCase()
      : "newest";
    const sortOrder = sortOrderProvided
      ? getQueryValue(req.query.sortOrder).trim().toLowerCase()
      : "desc";

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

    if (minPriceProvided && (minPriceText === "" || Number.isNaN(minPrice))) {
      res.status(400).json({
        success: false,
        message: "minPrice must be a valid number",
      });
      return;
    }

    if (maxPriceProvided && (maxPriceText === "" || Number.isNaN(maxPrice))) {
      res.status(400).json({
        success: false,
        message: "maxPrice must be a valid number",
      });
      return;
    }

    if (
      minRatingProvided &&
      (minRatingText === "" || Number.isNaN(minRating))
    ) {
      res.status(400).json({
        success: false,
        message: "minRating must be a valid number",
      });
      return;
    }

    if (minPrice !== undefined && minPrice < 0) {
      res.status(400).json({
        success: false,
        message: "minPrice cannot be negative",
      });
      return;
    }

    if (maxPrice !== undefined && maxPrice < 0) {
      res.status(400).json({
        success: false,
        message: "maxPrice cannot be negative",
      });
      return;
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
      return;
    }

    if (minRating !== undefined && (minRating < 0 || minRating > 5)) {
      res.status(400).json({
        success: false,
        message: "minRating must be between 0 and 5",
      });
      return;
    }

    const allowedSortBy = new Set(["newest", "price", "rating"]);
    const allowedSortOrder = new Set(["asc", "desc"]);

    if (!allowedSortBy.has(sortBy)) {
      res.status(400).json({
        success: false,
        message: "sortBy must be one of: newest, price, rating",
      });
      return;
    }

    if (!allowedSortOrder.has(sortOrder)) {
      res.status(400).json({
        success: false,
        message: "sortOrder must be one of: asc, desc",
      });
      return;
    }

    const query: Record<string, unknown> = {};

    if (searchText) {
      query.$text = { $search: searchText };
    }

    if (category) {
      query.itemCategory = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) {
        priceFilter.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        priceFilter.$lte = maxPrice;
      }
      query.itemPrice = priceFilter;
    }

    if (minRating !== undefined) {
      query.rating = { $gte: minRating };
    }

    const direction = sortOrder === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { _id: -1 };

    if (sortBy === "price") {
      sort.itemPrice = direction;
    }

    if (sortBy === "rating") {
      sort.rating = direction;
    }

    if (sortBy === "newest") {
      sort._id = direction;
    }

    const offset = (currentPage - 1) * limit;
    const items = await Item.find(query).sort(sort).skip(offset).limit(limit);
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
