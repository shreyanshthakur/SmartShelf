import { error } from "console";
import { Request, Response } from "express";
import User from "../models/User";

export const updateUserProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any)?.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    const { firstName, lastName, profile } = req.body;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    if (profile !== undefined) {
      user.profile = {
        ...user.profile,
        ...profile,
        address: {
          ...user.profile?.address,
          ...profile.address,
        },
        preferences: {
          ...user.profile?.preferences,
          ...profile.preferences,
        },
      };
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Unable to update user profile", err);
    return res.status(500).json({
      message: "Unable to update user profile",
    });
  }
};
