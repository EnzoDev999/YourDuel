import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createDuel } from "../redux/slices/duelSlice"; // Assurez-vous d'avoir cette action dans votre slice

const CreateDuel = () => {
  const [category, setCategory] = useState("Culture Générale");
  const [opponent, setOpponent] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!opponent) {
      alert("Veuillez entrer un nom d'utilisateur pour l'adversaire.");
      return;
    }

    // Logique pour créer un nouveau duel
    const newDuel = {
      category,
      opponent,
    };

    dispatch(createDuel(newDuel)); // Assurez-vous que cette action gère la création de duel dans votre slice

    // Réinitialisation des champs après soumission
    setCategory("Culture Générale");
    setOpponent("");
  };

  return (
    <div>
      <h2>Créer un nouveau Duel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Catégorie:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Culture Générale">Culture Générale</option>
            <option value="Science">Science</option>
            <option value="Histoire">Histoire</option>
            <option value="Sport">Sport</option>
            {/* Ajoutez d'autres catégories selon vos besoins */}
          </select>
        </div>
        <div>
          <label>Nom d'utilisateur de l'adversaire:</label>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Lancer le Duel</button>
      </form>
    </div>
  );
};

export default CreateDuel;
