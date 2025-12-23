import { Request, Response } from "express";
import Order from "../models/Order";
import Item from "../models/Item";
import mongoose from "mongoose";
import { validateHeaderName } from "http";
import Cart from "../models/Cart";

export const createOrderController = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = (req as any)?.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - User authentication required",
      });
    }

    const { deliveryAddress, paymentMethod } = req.body;

    if (!deliveryAddress || !paymentMethod) {
      await session.abortTransaction();
      return res.status(400).json({
        message:
          "Missing required fields: deliveryAddress and paymentMethod are mandatory",
      });
    }

    if (deliveryAddress.trim().length < 10) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid delivery address - must be at least 10 characters",
      });
    }

    const ValidPaymentMethods = ["card", "cash", "upi", "netbanking"];
    if (!ValidPaymentMethods.includes(paymentMethod.toLowerCase())) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Invalid payment method: Allowed: ${ValidPaymentMethods.join(
          ", "
        )}`,
      });
    }

    const cart = await Cart.findOne({
      userId,
    }).session(session);

    if (!cart) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "No cart found for user",
      });
    }

    if (!cart.items || cart.items.length == 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Cannot create order from empty cart",
      });
    }

    const orderItems = [];
    let calculatedTotalAmount = 0;

    for (const cartItem of cart.items) {
      const product = await Item.findById(cartItem.productId).session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          message: `Product with ID ${cartItem.productId} not found`,
        });
      }

      if (!product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Product ${product.itemName} is no longer available`,
        });
      }

      const availableStock = product.itemStock - (product.reserved || 0);

      if (availableStock < cartItem.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for "${product.itemName}". Available: ${availableStock}, Requested: ${cartItem.quantity}`,
        });
      }

      const currentPrice = product.itemPrice;

      const linetotal = currentPrice * cartItem.quantity;
      calculatedTotalAmount += linetotal;

      // Use findByIdAndUpdate to avoid full validation - only update reserved field
      await Item.findByIdAndUpdate(
        cartItem.productId,
        { $inc: { reserved: cartItem.quantity } },
        { session }
      );

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtTimeOfAdding: currentPrice,
        addedAt: new Date(),
      });
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

    const newOrder = new Order({
      userId,
      orderItems: orderItems,
      status: "placed",
      totalAmount: calculatedTotalAmount,
      estimatedDeliveryDate,
      deliveryAddress,
      paymentMethod: paymentMethod.toLowerCase(),
      createdAt: new Date(),
    });

    await newOrder.save({ session });

    // Clear cart items after order is placed
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    const populateOrder = await Order.findById(newOrder._id)
      .populate("orderItems.productId", "itemName itemDisplayImage itemPrice")
      .populate("userId", "name email");

    res.status(201).json({
      message: "Order placed successfully",
      order: populateOrder,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("[ERROR] Error placing order", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Invalid order data",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Failed to process order. Please try again later.",
    });
  } finally {
    session.endSession();
  }
};
