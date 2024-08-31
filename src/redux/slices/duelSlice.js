import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  duels: [],
  currentDuel: null,
  status: "idle",
  error: null,
};

const duelSlice = createSlice({
  name: "duel", // name of the slice
  initialState,
  reducers: {
    createDuel(state, action) {
      state.duels.push(action.payload); // add the duel to the state
    },
    acceptDuel(state, action) {
      const duel = state.duels.find((duel) => duel.id === action.payload); // find the duel in the state
      if (duel) {
        duel.status = "accepted"; // update the status of the duel
      }
    },
    setCurrentDuel(state, action) {
      state.currentDuel = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { createDuel, acceptDuel, setCurrentDuel, setStatus, setError } =
  duelSlice.actions; // export the action creators

export default duelSlice.reducer; // export the reducer
