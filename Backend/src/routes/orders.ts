import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createOrderController } from "../orders/createOrderController";
import { createPaymentIntentController } from "../orders/createPaymentIntentController";
import { getOrdersController } from "../orders/getOrdersController";
import { getOrderByIdController } from "../orders/getOrderByIdController";

const router = Router();

router.post(
  "/create-payment-intent",
  authenticateToken,
  createPaymentIntentController
);
router.post("/order", authenticateToken, createOrderController);
router.get("/get-orders", authenticateToken, getOrdersController);
router.get("/get-orders/:id", authenticateToken, getOrderByIdController);

export default router;
