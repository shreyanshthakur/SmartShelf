import { Request, Response } from "express";
import { register } from "../services/AuthService";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;
  } catch (err) {
    res.status(500).json({ error: "Failed to create user account" });
  }
};
