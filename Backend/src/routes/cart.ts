import { Router } from "express";
import { addToCartController } from "../cart/addToCartController";
import { getCartController } from "../cart/getCartController";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.post("/cart", authenticateToken, addToCartController);
router.get("/cart", authenticateToken, getCartController);

export default router;
