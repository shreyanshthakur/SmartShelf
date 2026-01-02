import { Request, Response } from "express";
import Order from "../models/Order";

export const getOrdersController = async (req: Request, res: Response) => {
  try {
    // Find all the orders for a user and return
    const userId = (req as any)?.user?.userId;
    if (!userId) {
      return res.status(500).json({ message: "User ID not found in request" });
    }

    const status = req.query.status as string | undefined;
    const query: any = { userId };

    if (status) {
      const allowedStatuses = ["placed", "completed", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be: placed, completed or cancelled",
        });
      }
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("orderItems.productId");
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: status
          ? `No ${status} orders found for this account`
          : "No orders found for this account",
      });
    }

    return res.status(200).json({
      message: "Success",
      count: orders.length,
      filter: status || "all",
      orders,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching order for the user", error });
  }
};
