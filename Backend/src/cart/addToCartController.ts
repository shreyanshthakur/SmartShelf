import { Request, Response } from "express";
import Cart from "../models/Cart";
import Item from "../models/Item";

export const addToCartController = async (req: Request, res: Response) => {
  try {
    console.log("[DEBUG] addToCartController called");
    console.log((req as any).user?.userId);
    console.log("[DEBUG] After user?.userId");
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, quantity = 1 } = req.body;
    const parsedQuantity = parseInt(quantity);
    console.log("[DEBUG] Product ID: ", productId);
    console.log("[DEBUG] Quantity: ", quantity);
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Item.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: "Product is not available" });
    }

    if (product.itemStock < parsedQuantity) {
      return res.status(400).json({
        message: `Insufficient stock, Only ${product.itemStock} items available in stock`,
      });
    }

    let cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        status: "active",
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity =
        cart.items[existingItemIndex].quantity + parsedQuantity;

      if (newQuantity > product.itemStock) {
        return res.status(400).json({
          message: `Cannot add more. Only ${product.itemStock} items are available`,
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Product not in cart - add new item
      cart.items.push({
        productId: product._id,
        quantity,
        priceAtTimeOfAdding: product.itemPrice, // Price snapshot
        addedAt: new Date(),
      });
    }

    await cart.save();

    await cart.populate(
      "items.productId",
      "itemName itemPrice itemDisplayImage itemStock"
    );

    res.status(200).json({
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("[ERROR] Add to cart failed");
    res.status(500).json({
      message: "Unable to add to cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
