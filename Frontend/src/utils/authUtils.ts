import type { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { setUser } from "../features/userSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const checkAuth = async (dispatch: Dispatch): Promise<void> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/me`, {
      withCredentials: true,
    });

    if (response && response.data && response.data.success) {
      dispatch(
        setUser({
          userId: response.data.user.userId,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
        }),
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
    const response = await axios.post(`${BACKEND_URL}/api/v1/logout`, null, {
      withCredentials: true,
    });

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

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (payload: {
  firstName?: string;
  lastName?: string;
  profile?: {
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
}) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/v1/update-profile`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
