import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

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
    const fetchDuelHistory = async (page = 1) => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/duelHistory/${userId}?page=${page}&limit=3`
        );
        setDuelHistory(response.data.duels);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération de l'historique des duels");
        setLoading(false);
      }
    };

    fetchDuelHistory(currentPage);

    // Écouter l'événement "duelCompleted" via WebSocket
    const socket = io(API_URL);

    socket.emit("joinRooms", { userId, duelId: null }); // S'assurer que l'utilisateur rejoint la room correcte

    socket.on("duelCompleted", () => {
      console.log(
        "Duel terminé, rafraîchissement de l'historique des duels..."
      );
      fetchDuelHistory(currentPage); // Rafraîchir l'historique dès qu'un duel est terminé
    });

    return () => {
      socket.off("duelCompleted");
    };
  }, [API_URL, userId, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
              <strong>Adversaire :</strong> {duel.opponentUsername}
            </p>
            <p>
              <strong>Résultat:</strong>{" "}
              {duel.result === "win"
                ? "Victoire"
                : duel.result === "loss"
                ? "Défaite"
                : "Égalité"}
            </p>
            <p>
              <strong>Question :</strong> {duel.question}
            </p>
            <p>
              <strong>Votre réponse:</strong> {duel.userAnswer || "N/A"}
            </p>
            <p>
              <strong>Bonne réponse:</strong> {duel.correctAnswer}
            </p>
            <p>
              <strong>Points gagnés:</strong> {duel.pointsGained}
            </p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default DuelHistory;
