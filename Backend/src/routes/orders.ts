import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createOrderController } from "../orders/createOrderController";
import { createPaymentIntentController } from "../orders/createPaymentIntentController";

const router = Router();

router.post(
  "/create-payment-intent",
  authenticateToken,
  createPaymentIntentController
);
router.post("/order", authenticateToken, createOrderController);

export default router;
