import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDuel } from "../redux/slices/duelSlice";
import PlayerSelect from "./PlayerSelect"; // Importer PlayerSelect

const CreateDuel = () => {
  const [category, setCategory] = useState("Culture Générale");
  const [selectedOpponent, setSelectedOpponent] = useState(null); // L'adversaire sélectionné
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id); // Récupérer l'ID de l'utilisateur connecté

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedOpponent) {
      alert("Veuillez sélectionner un adversaire.");
      return;
    }

    const opponentId = selectedOpponent.value;

    // Créer un nouveau duel avec les informations minimales requises
    const newDuel = {
      challenger: userId, // ID de l'utilisateur connecté
      opponent: opponentId, // Utiliser l'ID de l'adversaire sélectionné
      category, // Catégorie choisie
    };

    dispatch(createDuel(newDuel));

    // Réinitialisation des champs après soumission
    setCategory("Culture Générale");
    setSelectedOpponent(null);
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
          <PlayerSelect onSelectPlayer={setSelectedOpponent} />{" "}
          {/* Utilisation de PlayerSelect */}
        </div>
        <button type="submit">Lancer le Duel</button>
      </form>
    </div>
  );
};

export default CreateDuel;
