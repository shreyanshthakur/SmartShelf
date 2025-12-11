import { Router } from "express";
import { addToCartController } from "../cart/addToCartController";
import { getCart } from "../cart/getCart";

const router = Router();

router.post("/cart", addToCartController);
router.get("/cart", getCart);

export default router;
