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
      const newDuel = {
        id: Date.now(), // Génère un ID unique pour chaque duel
        ...action.payload,
        status: "pending", // Le duel est en attente d'acceptation
      };
      state.duels.push(newDuel);
      state.status = `Duel envoyé à ${action.payload.opponent} dans la catégorie ${action.payload.category}`;
    },
    acceptDuel(state, action) {
      const duel = state.duels.find((duel) => duel.id === action.payload);
      if (duel) {
        duel.status = "accepted";
      }
    },
    setQuestion(state, action) {
      const duel = state.duels.find(
        (duel) => duel.id === action.payload.duelId
      );
      if (duel) {
        duel.question = action.payload.question;
        duel.options = action.payload.options;
        duel.correctAnswer = action.payload.correctAnswer;
      }
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
