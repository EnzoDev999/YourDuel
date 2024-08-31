import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createDuel, setStatus, setError } from "../redux/slices/duelSlice";
import { fetchQuestions } from "../api";

const LaunchDuel = () => {
  const [opponent, setOpponent] = useState("");
  const [category, setCategory] = useState("Culture Générale");
  const dispatch = useDispatch();

  const handleLaunchDuel = async (e) => {
    e.preventDefault();
    dispatch(setStatus("loading"));
    try {
      const questions = await fetchQuestions(category);
      console.log("Questions fetched:", questions); // Log les questions pour vérification

      const newDuel = {
        id: Date.now(),
        challenger: "CurrentUser", // Ceci devrait être remplacé par l'utilisateur authentifié
        opponent,
        category,
        status: "pending",
        questions,
      };

      dispatch(createDuel(newDuel));
      dispatch(setStatus("succeeded"));
      setOpponent("");
    } catch (error) {
      dispatch(setError("Echec de la génération des questions"));
      dispatch(setStatus("failed"));
    }
  };

  return (
    <div>
      <h2>Launch a Duel</h2>
      <form onSubmit={handleLaunchDuel}>
        <div>
          <label>Opponent's Username:</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General Knowledge">General Knowledge</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Sports">Sports</option>
            {/* Ajoute d'autres catégories si nécessaire */}
          </select>
        </div>
        <button type="submit">Launch Duel</button>
      </form>
    </div>
  );
};

export default LaunchDuel;
