import { Request, Response } from "express";
import Order from "../models/Order";
import Item from "../models/Item";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      orders,
      status,
      createdAt,
      totalAmount,
      estimatedDeliveryDate,
      deliveryAddress,
      paymentMethod,
    } = req.body;
    const userId = (req as any)?.user?.userId;
    const order = new Order({
      userId,
      orderId,
      orders,
      status,
      createdAt,
      totalAmount,
      estimatedDeliveryDate,
      deliveryAddress,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      message: "Order Created Successfully",
      order,
    });
  } catch (error) {
    console.error("[ERROR] Error placing order", error);

    res.status(500).json({
      message: "Error creating item",
      error,
    });
  }
};
