import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userInfo: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user", // name of the slice
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userInfo = null;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { login, logout, setStatus, setError } = userSlice.actions; // export the action creators

export default userSlice.reducer; // export the reducer
