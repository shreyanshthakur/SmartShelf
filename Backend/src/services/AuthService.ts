import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { verifyPassword } from "./PasswordService";

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
    console.log("[DEBUG] Came inside register");
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }
    console.log("[DEBUG] Not an existing user");
    // Create new user
    const newUser: IUser = new User(userData);
    await newUser.save();
    console.log("[DEBUG] Creation done");
    console.log("[DEBUG]", newUser._id.toString(), newUser.email);
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

// Create Login
export const Login = async (userData: {
  email: string;
  password: string;
}): Promise<AuthResult> => {
  try {
    // check if the password matches in the databasse, use passwordservice
    const userFound = await User.findOne({ email: userData.email });
    if (!userFound) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const isPasswordValid = await userFound.comparePassword(userData.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalide credentials",
      };
    }

    const token = jwt.sign(
      {
        userId: userFound._id,
        email: userFound.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      message: "Login successfull",
      token,
      user: {
        id: userFound._id.toString(),
        email: userFound.email,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error has occured during login",
    };
  }
};
