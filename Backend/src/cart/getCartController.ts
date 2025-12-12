import { Request, Response } from "express";
import Cart from "../models/Cart";

export const getCartController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ userId, status: "active" }).populate(
      "items.productId",
      "itemName itemPrice itemDisplayImage itemStock"
    );

    // If no cart exists, return empty cart structure
    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: {
          items: [],
          totalAmount: 0,
          totalItems: 0,
        },
      });
    }

    return res.status(200).json({ message: "Successfully fetched cart", cart });
  } catch (error) {
    console.error("[ERROR] Failed to get cart:", error);
    return res.status(500).json({
      message: "Failed to fetch cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
