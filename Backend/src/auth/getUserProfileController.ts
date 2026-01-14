import { Request, Response } from "express";
import User from "../models/User";

export const getUserProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any)?.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const id = userId.toHexString();
    console.log(id);
    const userProfile = await User.findById(id).select("-password");
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
    console.log(error);
    return res
      .status(403)
      .json({ message: "something went wrong in fetching user profile" });
  }

  return;
};
