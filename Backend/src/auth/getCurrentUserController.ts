import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getCurrentUserController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response | void> => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({
    success: true,
    user: {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
};
