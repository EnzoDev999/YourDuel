import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import questionsData from "../../data/questions.json";

const initialState = {
  duels: [],
  status: "idle",
  error: null,
};
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Action pour récupérer les duels depuis le backend
export const fetchDuels = createAsyncThunk(
  "duel/fetchDuels",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/duels/user/${userId}`);
      console.log("Duels récupérés de l'API:", response); // Log des données récupérées
      return response.data; // Cela devrait être un tableau de duels
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

function getQuestionByCategory(category) {
  const questions = questionsData.questions.filter(
    (q) => q.category === category
  );
  return questions[Math.floor(Math.random() * questions.length)];
}

// Action asynchrone pour créer un duel via le backend
export const createDuel = createAsyncThunk(
  "duel/createDuel",
  async (duelData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/duels`, duelData); // Notez l'utilisation de '/api/duels' ici
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDuel = createAsyncThunk(
  "duel/deleteDuel",
  async (duelId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/duels/${duelId}/refuse`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    acceptDuel(state, action) {
      const duel = state.duels.find((duel) => duel.id === action.payload);
      if (duel) {
        duel.status = "accepted";
        const question = getQuestionByCategory(duel.category);
        duel.question = question.question;
        duel.options = question.options;
        duel.correctAnswer = question.correctAnswer;
        state.status = `Duel accepté contre ${duel.challenger}`;
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
        duel.userAnswer = action.payload.answer;
      }
    },
    clearDuels(state) {
      state.duels = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDuel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDuel.fulfilled, (state, action) => {
        state.duels.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createDuel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchDuels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDuels.fulfilled, (state, action) => {
        state.duels = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDuels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteDuel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDuel.fulfilled, (state, action) => {
        state.duels = state.duels.filter(
          (duel) => duel._id !== action.meta.arg
        );
        state.status = "succeeded";
      })
      .addCase(deleteDuel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { acceptDuel, setQuestion, submitAnswer, clearDuels } =
  duelSlice.actions;

export default duelSlice.reducer;
