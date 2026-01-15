import { Router } from "express";
import { registerController } from "../auth/registerController";
import { loginController } from "../auth/loginController";
import { authenticateToken } from "../middleware/authenticateToken";
import { changePasswordController } from "../auth/changePasswordController";
import { logoutController } from "../auth/logoutController";
import { getCurrentUserController } from "../auth/getCurrentUserController";
import { getUserProfileController } from "../auth/getUserProfileController";

const router = Router();

// Public routes
router.post("/signup", registerController);
router.post("/login", loginController);

// Protected routes (authentication required)
router.post("/change-password", authenticateToken, changePasswordController);
router.post("/logout", authenticateToken, logoutController);
router.get("/me", authenticateToken, getCurrentUserController);
router.get("/profile", authenticateToken, getUserProfileController);

export default router;
