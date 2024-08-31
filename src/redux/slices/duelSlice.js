import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  duels: [],
  status: "idle",
  error: null,
};

const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    createDuel(state, action) {
      state.duels.push(action.payload);
    },
    acceptDuel(state, action) {
      const duel = state.duels.find((duel) => duel.id === action.payload);
      if (duel) {
        duel.status = "accepted";
      }
    },
    setQuestion(state, action) {
      return {
        ...state,
        duels: state.duels.map((duel) =>
          duel.id === action.payload.duelId
            ? {
                ...duel,
                question: action.payload.question,
                options: action.payload.options,
                correctAnswer: action.payload.correctAnswer,
              }
            : duel
        ),
      };
    },

    submitAnswer(state, action) {
      const duel = state.duels.find(
        (duel) => duel.id === action.payload.duelId
      );
      if (duel) {
        duel.responses = duel.responses || {};
        duel.responses[action.payload.userId] = action.payload.answer;
      }
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  createDuel,
  acceptDuel,
  setQuestion,
  submitAnswer,
  setCurrentDuel,
  setStatus,
  setError,
} = duelSlice.actions;
export default duelSlice.reducer;
