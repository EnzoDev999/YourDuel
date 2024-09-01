import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userInfo: null,
  users: [], // Liste des utilisateurs inscrits
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user", // name of the slice
  initialState,
  reducers: {
    loginUser(state, action) {
      const user = state.users.find(
        (u) => u.username === action.payload.username
      );
      if (user) {
        state.isAuthenticated = true;
        state.userInfo = user;
        state.error = null;
      } else {
        state.error = "Utilisateur non trouvé";
      }
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.userInfo = null;
    },
    registerUser(state, action) {
      const userExists = state.users.some(
        (u) => u.username === action.payload.username
      );
      if (!userExists) {
        state.users.push(action.payload);
        state.isAuthenticated = true;
        state.userInfo = action.payload;
        state.error = null;
      } else {
        state.error = "Nom d'utilisateur déjà pris";
      }
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  registerUser,
  setStatus,
  setError,
  clearError,
} = userSlice.actions; // export the action creators

export default userSlice.reducer; // export the reducer
