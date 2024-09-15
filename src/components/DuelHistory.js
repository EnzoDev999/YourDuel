import React, { useEffect, useState } from "react";
import axios from "axios";

const DuelHistory = ({ userId }) => {
  const [duelHistory, setDuelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchDuelHistory = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/duelHistory/${userId}`
        );
        setDuelHistory(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération de l'historique des duels");
        setLoading(false);
      }
    };

    fetchDuelHistory();
  }, [userId, API_URL]);

  if (loading) {
    return <p>Chargement de l'historique des duels...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (duelHistory.length === 0) {
    return <p>Aucun duel joué.</p>;
  }

  return (
    <div>
      <h3>Historique des duels</h3>
      <ul>
        {duelHistory.map((duel, index) => (
          <li key={index}>
            <p>
              <strong>Résultat:</strong>{" "}
              {duel.result === "win"
                ? "Victoire"
                : duel.result === "loss"
                ? "Défaite"
                : "Égalité"}
            </p>
            <p>
              <strong>Points gagnés:</strong> {duel.pointsGained}
            </p>
            <p>
              <strong>Date:</strong> {new Date(duel.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DuelHistory;
