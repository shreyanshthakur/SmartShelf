import { Request, Response } from "express";
import { register } from "../services/AuthService";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const result = await register({ email, password, firstName, lastName });

    if (!result.success || !result.user) {
      return res.status(400).json({
        error: result.message,
      });
    }

    res.status(201).json({
      status: true,
      message: result.message,
      user: result.user,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user account" });
  }
};
