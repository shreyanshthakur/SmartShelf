import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token?: string;
}

export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResult> => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Create new user
    const newUser: IUser = new User(userData);
    await newUser.save();

    return {
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    };
  } catch (error) {
    throw new Error(`Registration Failed: ${error}`);
  }
};
