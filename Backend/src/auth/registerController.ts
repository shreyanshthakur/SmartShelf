import { Request, Response } from "express";
import { register } from "../services/AuthService";

export const registerController = async (req: Request, res: Response) => {
  console.log("Called register controller");
  try {
    const { email, password, firstName, lastName } = req.body;
    console.log(req.body);
    console.log(email, password, firstName, lastName);
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
    console.log("Before calling register");
    const result = await register({ email, password, firstName, lastName });
    console.log("after calling register");
    if (!result.success || !result.user) {
      console.log("[DEBUG] 400 status");
      return res.status(400).json({
        error: result.message,
      });
    }
    console.log("[DEBUG] 201 status");
    res.status(201).json({
      status: true,
      message: result.message,
      user: result.user,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user account" });
  }
};
