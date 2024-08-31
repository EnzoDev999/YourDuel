import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import duelReducer from "./slices/duelSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // add the user reducer to the store
    duel: duelReducer, // add the duel reducer to the store
  },
});

export default store;
