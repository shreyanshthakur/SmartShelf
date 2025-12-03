import { Router } from "express";
import { getItemsController } from "../items/getItemsController";
import { getItemByIdController } from "../items/getItemByIdController";
import { createItemController } from "../items/createItemController";
import { uploadImages } from "../middleware/upload";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

// Public routes
router.get("/items", getItemsController);
router.get("/items/:id", getItemByIdController);

// Protected routes (authentication required)
router.post("/item", authenticateToken, uploadImages, createItemController);

export default router;
