import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createDuel } from "../redux/slices/duelSlice";

const LaunchDuel = () => {
  const [opponent, setOpponent] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();

  const handleLaunchDuel = (e) => {
    e.preventDefault();
    const newDuel = {
      id: Date.now(),
      challenger: "CurrentUser", // Ceci devrait être remplacé par l'utilisateur authentifié
      opponent,
      category,
      status: "pending",
    };
    dispatch(createDuel(newDuel));
    setOpponent("");
  };

  return (
    <div>
      <h2>Launch a Duel</h2>
      <form onSubmit={handleLaunchDuel}>
        <div>
          <label> Opponent's Username:</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            requied
          />
        </div>
        <div>
          <label> Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Culture Générale">Culture Générale</option>
            <option value="Sport">Sport</option>
            <option value="Arts">Arts</option>
            <option value="Sciences">Sciences</option>
            <option value="Technologie">Technologie</option>
            {/* Ajoute d'autres catégories si nécessaire */}
          </select>
        </div>
        <button type="submit">Launch Duel</button>
      </form>
    </div>
  );
};

export default LaunchDuel;
