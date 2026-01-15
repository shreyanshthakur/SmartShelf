import { Request, Response } from "express";
import User from "../models/User";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getUserProfileController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req?.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userProfile = await User.findById(userId).select("-password");
    if (!userProfile) {
      return res.status(404).json({
        message: "User not found in the database",
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      userProfile,
    });
  } catch (error) {
    console.log("Error fetching user profile", error);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
