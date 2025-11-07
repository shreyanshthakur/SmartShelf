import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("[DEBUG] Came inside login");
  // Extract the email and password from the request body
  const { email, password } = req.body;
  console.log("[DEBUG] res.body:", email, password);
  if (!email || !password) {
    res.status(401).json({
      sucess: false,
      message: "Email or password is not supplied or is incorrect",
      error: "ValidationError",
    });
  }

  try {
    const user = await User.findOne({ email: email });

    if (user === null) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        error: "ValidationError",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
      throw new Error("JWt_secret is not set in the env");
    }
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user?._id }, jwt_secret, {
        expiresIn: "1h",
      });

      res.cookie("accessToken", token, {
        maxAge: 3600000,
        httpOnly: true,
        secure:
          process.env.NODE_ENV == "production" ||
          process.env.USE_SECURE_COOKIES === "true",
        sameSite: "lax",
      });

      res.status(200).json({
        success: true,
        message: "User successfully logged in",
        userId: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
      });
    } else {
      res.status(401).json({
        sucess: false,
        message: "Email or Password is invalid",
        Error: "ValidationError",
      });
      return;
    }
  } catch (err) {
    console.error("[ERROR] Login failed:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
  return;
};
