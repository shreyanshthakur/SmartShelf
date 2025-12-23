import { Request, Response } from "express";
import Cart from "../models/Cart";

export const removeFromCartController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { itemId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from cart
    cart.items.splice(itemIndex, 1);

    await cart.save();

    await cart.populate(
      "items.productId",
      "itemName itemPrice itemDisplayImage itemStock"
    );

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("[ERROR] Failed to remove item from cart:", error);
    return res.status(500).json({
      message: "Failed to remove item from cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
