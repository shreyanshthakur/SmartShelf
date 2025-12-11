import { Request, Response } from "express";
import Cart from "../models/Cart";

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.find();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json({ message: "successfully fetched cart", cart });
  } catch (error) {
    console.log("[ERROR] Failed to get cart");
    return res.status(404).json({ message: "Cart not found" });
  }
};
