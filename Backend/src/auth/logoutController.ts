import { Request, Response } from "express";

export const logoutController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure:
        process.env.NODE_ENV == "production" ||
        process.env.USE_SECURE_COOKIES === "true",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (err) {
    console.error("[ERROR] Logout failed: ", err);
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while logging out",
    });
  }
};
