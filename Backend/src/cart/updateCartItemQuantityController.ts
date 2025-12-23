import { Request, Response } from "express";
import Item from "../models/Item";
import Cart from "../models/Cart";

export const updateCartItemQuantityController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    // find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find((item) => item._id?.toString() === itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await Item.findById(cartItem.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.isActive) {
      return res.status(400).json({
        message: "Product is no longer available",
      });
    }
    if (quantity > product.itemStock) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${product.itemStock} items available`,
      });
    }

    cartItem.quantity = quantity;

    await cart.save();

    await cart.populate(
      "items.productId",
      "itemName itemPrice itemDisplayImage itemStock"
    );

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating cart item quantity",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
