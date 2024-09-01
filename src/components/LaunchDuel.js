import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createDuel, setStatus, setError } from "../redux/slices/duelSlice";

const LaunchDuel = () => {
  const [opponent, setOpponent] = useState("");
  const [category, setCategory] = useState("Culture Générale");
  const dispatch = useDispatch();

  const handleLaunchDuel = async (e) => {
    e.preventDefault();
    dispatch(setStatus("loading"));
    try {
      const newDuel = {
        id: Date.now(),
        challenger: "CurrentUser", // Remplacez par l'utilisateur authentifié
        opponent,
        category,
        status: "pending",
        question: null, // Assurez-vous que la question est null ici
        options: [],
        correctAnswer: null,
      };

      dispatch(createDuel(newDuel));
      dispatch(setStatus("succeeded"));
      setOpponent("");
    } catch (error) {
      dispatch(setError("Échec du lancement du duel"));
      dispatch(setStatus("failed"));
    }
  };

  return (
    <div>
      <h2>Lancer un Duel</h2>
      <form onSubmit={handleLaunchDuel}>
        <div>
          <label>Nom d'utilisateur de l'adversaire :</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Catégorie :</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Culture Générale">Culture Générale</option>
            <option value="Science">Science</option>
            <option value="Histoire">Histoire</option>
            <option value="Sports">Sports</option>
            {/* Ajoute d'autres catégories si nécessaire */}
          </select>
        </div>
        <button type="submit">Lancer le Duel</button>
      </form>
    </div>
  );
};

export default LaunchDuel;
