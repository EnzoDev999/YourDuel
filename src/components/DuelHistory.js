import React, { useEffect, useState } from "react";
import axios from "axios";

const DuelHistory = ({ userId }) => {
  const [duelHistory, setDuelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchDuelHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/auth/duelHistory/${userId}?page=${currentPage}&limit=3`
        );
        setDuelHistory(response.data.duels);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération de l'historique des duels");
        setLoading(false);
      }
    };

    fetchDuelHistory();
  }, [userId, API_URL, currentPage]);

  if (loading) {
    return <p>Chargement de l'historique des duels...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (duelHistory.length === 0) {
    return <p>Aucun duel joué.</p>;
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export default DuelHistory;
