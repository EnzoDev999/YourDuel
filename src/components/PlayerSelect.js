import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const PlayerSelect = ({ onSelectPlayer }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/users`);
        const playerOptions = response.data.map((player) => ({
          value: player._id, // L'ID du joueur comme value
          label: player.username, // Le username à afficher
        }));
        setPlayers(playerOptions); // Mettre à jour les joueurs
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des joueurs");
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [API_URL]);

  if (loading) {
    return <p>Chargement des joueurs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Select
        options={players}
        onChange={onSelectPlayer} // Fonction appelée lors de la selection d'un joueur
        placeholder="Sélectionnez un joueur..."
        isSearchable={true} // Permet de rechercher un joueur
      />
    </div>
  );
};

export default PlayerSelect;
