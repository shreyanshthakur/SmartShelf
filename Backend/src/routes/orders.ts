import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createOrderController } from "../orders/createOrderController";
import { createPaymentIntentController } from "../orders/createPaymentIntentController";
import { getOrdersController } from "../orders/getOrdersController";

const router = Router();

router.post(
  "/create-payment-intent",
  authenticateToken,
  createPaymentIntentController
);
router.post("/order", authenticateToken, createOrderController);
router.get("/get-orders", authenticateToken, getOrdersController);

export default router;
