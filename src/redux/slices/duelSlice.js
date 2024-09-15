import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  duels: [],
  status: "idle",
  error: null,
};

const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL_NETWORK;

// Action pour récupérer les duels depuis le backend
export const fetchDuels = createAsyncThunk(
  "duel/fetchDuels",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/duels/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action pour créer un duel via le backend
export const createDuel = createAsyncThunk(
  "duel/createDuel",
  async (duelData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/duels`, duelData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action pour accepter un duel via le backend
export const acceptDuel = createAsyncThunk(
  "duel/acceptDuel",
  async (duelId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/duels/${duelId}/accept`);
      return response.data; // Le backend renverra la question, les options et la réponse correcte
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action pour supprimer un duel
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

export const fetchRandomQuestion = createAsyncThunk(
  "duel/fetchRandomQuestion",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/questions/random/${category}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitAnswer = createAsyncThunk(
  "duel/submitAnswer",
  async ({ duelId, answer, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/duels/${duelId}/answer`,
        { answer, userId }
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
    // Action pour supprimer un duel
    removeDuel(state, action) {
      state.duels = state.duels.filter((duel) => duel._id !== action.payload);
    },
    // Mettre à jour la question dans un duel (après acceptation)
    setQuestion(state, action) {
      const duel = state.duels.find(
        (duel) => duel._id === action.payload.duelId
      );
      if (duel) {
        duel.question = action.payload.question;
        duel.options = action.payload.options;
        duel.correctAnswer = action.payload.correctAnswer;
        duel.status = action.payload.status;
        duel.winner = action.payload.winner;
      }
    },
    // Soumettre la réponse à une question
    submitAnswer(state, action) {
      const duel = state.duels.find(
        (duel) => duel._id === action.payload.duelId
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
        console.log("fetchDuels.fulfilled - duels récupérés :", action.payload); // Log pour vérifier les duels
        state.duels = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDuels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(acceptDuel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(acceptDuel.fulfilled, (state, action) => {
        const updatedDuel = state.duels.find(
          (duel) => duel._id === action.payload._id
        );
        if (updatedDuel) {
          updatedDuel.status = "accepted";
          updatedDuel.question = action.payload.question;
          updatedDuel.options = action.payload.options;
          updatedDuel.correctAnswer = action.payload.correctAnswer;
          console.log(
            "acceotDuel Duel mis à jour avec la question :",
            JSON.parse(JSON.stringify(updatedDuel))
          ); // Utilisez current() pour déproxer
        } else {
          console.log("Duel non trouvé lors de l'acceptation"); // Ajoutez ce log pour être sûr que le duel est bien trouvé
        }
        state.status = "succeeded";
      })
      .addCase(acceptDuel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRandomQuestion.fulfilled, (state, action) => {
        const duel = state.duels.find(
          (duel) => duel._id === action.payload.duelId
        );
        if (duel) {
          duel.question = action.payload.question;
          duel.options = action.payload.options;
          duel.correctAnswer = action.payload.correctAnswer;

          console.log(
            "fetchrandom Duel mis à jour avec la question :",
            JSON.parse(JSON.stringify(duel))
          );
        }
      })
      .addCase(fetchRandomQuestion.rejected, (state, action) => {
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
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        const duel = state.duels.find(
          (duel) => duel._id === action.payload.duelId
        );
        if (duel) {
          duel.userAnswer = action.payload.answer;
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { removeDuel, setQuestion, clearDuels } = duelSlice.actions;

export default duelSlice.reducer;
