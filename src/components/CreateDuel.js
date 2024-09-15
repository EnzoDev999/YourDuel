import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDuel } from "../redux/slices/duelSlice";
import axios from "axios"; // Importer axios pour faire la requête

const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL_NETWORK;

console.log("API_URL utilisé :", API_URL);
const CreateDuel = () => {
  const [category, setCategory] = useState("Culture Générale");
  const [opponentUsername, setOpponentUsername] = useState("");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id); // Récupérer l'ID de l'utilisateur connecté

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!opponentUsername) {
      alert("Veuillez entrer un nom d'utilisateur pour l'adversaire.");
      return;
    }

    try {
      // Rechercher l'ID de l'opponent par son nom d'utilisateur
      const response = await axios.get(
        `${API_URL}/api/auth/users/${opponentUsername}`
      );
      const opponentId = response.data._id;

      // Créer un nouveau duel avec les informations minimales requises
      const newDuel = {
        challenger: userId, // ID de l'utilisateur connecté
        opponent: opponentId, // Utiliser l'ID de l'opponent récupéré
        category, // Catégorie choisie
      };

      dispatch(createDuel(newDuel));

      // Réinitialisation des champs après soumission
      setCategory("Culture Générale");
      setOpponentUsername("");
    } catch (error) {
      console.error("Erreur lors de la recherche de l'utilisateur:", error);
      alert(
        "Erreur lors de la recherche de l'utilisateur. Vérifiez le nom d'utilisateur et réessayez."
      );
    }
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
            value={opponentUsername}
            onChange={(e) => setOpponentUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Lancer le Duel</button>
      </form>
    </div>
  );
};

export default CreateDuel;
