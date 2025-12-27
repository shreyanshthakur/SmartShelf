import type { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { setUser } from "../features/userSlice";

const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const checkAuth = async (dispatch: Dispatch): Promise<void> => {
  try {
    const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/me`, {
      withCredentials: true,
    });
    // Debug log removed for production

    console.log("Auth check response:", response.data);

    if (response && response.data && response.data.success) {
      dispatch(
        setUser({
          userId: response.data.user.userId,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
        })
      );
    } else {
      dispatch(setUser(null));
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    dispatch(setUser(null));
  }
};

export const logoutUser = async (dispatch: Dispatch): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${VITE_BACKEND_URL}/api/v1/logout`,
      null,
      {
        withCredentials: true,
      }
    );

    if (response?.data?.success) {
      dispatch(setUser(null));
      return true;
    } else {
      dispatch(setUser(null));
      return false;
    }
  } catch (err) {
    console.error("Error logging out", err);
    dispatch(setUser(null));
    return false;
  }
};
