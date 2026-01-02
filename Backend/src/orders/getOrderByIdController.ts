import { Request, Response } from "express";
import Order from "../models/Order";

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any)?.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const orders = await Order.findById(id).populate("orderItems.productId");

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    if (String(orders.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json({
      orders,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error,
    });
  }
};
