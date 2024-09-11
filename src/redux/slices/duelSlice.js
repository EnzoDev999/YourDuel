import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import questionsData from "../../data/questions.json"; // Importer les questions du fichier JSON

const initialState = {
  duels: [],
  status: "idle",
  error: null,
};
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://turbo-space-capybara-qjgjjxrp6q529xxr-5000.app.github.dev";

// Fonction pour sélectionner une question en fonction de la catégorie
function getQuestionByCategory(category) {
  const questions = questionsData.questions.filter(
    (q) => q.category === category
  );
  return questions[Math.floor(Math.random() * questions.length)];
}

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
      return response.data;
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

const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    // Utilisation de la fonction pour générer une question lors de l'acceptation d'un duel
    acceptDuel(state, action) {
      const duel = state.duels.find((duel) => duel._id === action.payload);
      if (duel) {
        duel.status = "accepted";
        const question = getQuestionByCategory(duel.category);
        duel.question = question.question;
        duel.options = question.options;
        duel.correctAnswer = question.correctAnswer;
        state.status = `Duel accepté contre ${duel.challengerUsername}`;
      }
    },
    // Action pour supprimer un duel
    removeDuel(state, action) {
      state.duels = state.duels.filter((duel) => duel._id !== action.payload);
    },
    // Mettre à jour la question dans un duel
    setQuestion(state, action) {
      const duel = state.duels.find(
        (duel) => duel._id === action.payload.duelId
      );
      if (duel) {
        duel.question = action.payload.question;
        duel.options = action.payload.options;
        duel.correctAnswer = action.payload.correctAnswer;
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
        const duel = state.duels.find(
          (duel) => duel._id === action.payload._id
        );
        if (duel) {
          duel.status = "accepted";
          duel.question = action.payload.question;
          duel.options = action.payload.options;
          duel.correctAnswer = action.payload.correctAnswer;
        }
        state.status = "succeeded";
      })
      .addCase(acceptDuel.rejected, (state, action) => {
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

export const { removeDuel, setQuestion, submitAnswer, clearDuels } =
  duelSlice.actions;

export default duelSlice.reducer;
