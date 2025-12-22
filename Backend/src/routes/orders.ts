import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createOrderController } from "../orders/createOrderController";

const router = Router();

router.post("/order", authenticateToken, createOrderController);

export default router;
