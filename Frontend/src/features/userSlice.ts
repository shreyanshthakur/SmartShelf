import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  firstName: null as string | null,
  lastName: null as string | null,
  email: null as string | null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        email: string;
      }>
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
