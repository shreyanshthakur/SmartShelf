import { Router } from "express";
import { addToCartController } from "../cart/addToCartController";
import { getCartController } from "../cart/getCartController";
import { authenticateToken } from "../middleware/authenticateToken";
import { updateCartItemQuantityController } from "../cart/updateCartItemQuantityController";
import { removeFromCartController } from "../cart/removeFromCartController";

const router = Router();

router.post("/cart", authenticateToken, addToCartController);
router.get("/cart", authenticateToken, getCartController);
router.put(
  "/cart/:itemId",
  authenticateToken,
  updateCartItemQuantityController
);
router.delete("/cart/:itemId", authenticateToken, removeFromCartController);

export default router;
