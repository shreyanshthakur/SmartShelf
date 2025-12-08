import { Router } from "express";
import { addToCartController } from "../cart/addToCartController";

const router = Router();

router.post("/cart", addToCartController);

export default router;
