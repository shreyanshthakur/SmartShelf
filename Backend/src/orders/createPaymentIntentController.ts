import { Request, Response } from "express";
import Stripe from "stripe";
import Cart from "../models/Cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const createPaymentIntentController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any)?.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - User authentication required",
      });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cannot create payment - cart is empty",
      });
    }

    let totalAmount = 0;
    for (const item of cart.items) {
      const product = item.productId as any;
      if (product && typeof product.itemPrice === "number") {
        totalAmount += product.itemPrice * item.quantity;
      }
    }

    // add shipping and tax
    const shippingCost = 10;
    const taxRate = 0.1;
    const tax = totalAmount * taxRate;
    const finalAmount = totalAmount + shippingCost + tax;

    const amountInCents = Math.round(finalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        userId: userId.toString(),
        itemCount: cart.items.length.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: finalAmount,
    });
  } catch (error: any) {
    console.error("Payment Intent Error: ", error);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};
