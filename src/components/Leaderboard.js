import React, { useEffect, useState } from "react";
import axios from "axios";
const { io } = require("socket.io-client");

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_URL_LOCAL
      : process.env.REACT_APP_API_URL_NETWORK;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/leaderboard`);
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération du classement général");
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Ecouter l'événement leaderboardUpdated via WebSocket
    const socket = io(API_URL);

    socket.on("leaderboardUpdated", () => {
      console.log("Duel terminé, rafraîchissement du classement...");
      fetchLeaderboard(); // Rafraîchir le classement dès qu'un duel est terminé
    });

    return () => {
      socket.off("duelCompleted");
    };
  }, [API_URL]);

  if (loading) {
    return <p>Chargement du classement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (leaderboard.length === 0) {
    return <p>Aucun utilisateur n'a encore marqué de points.</p>;
  }

  return (
    <div>
      <h3>Classement Général</h3>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Utilisateur</th>
            <th>Points</th>
            <th>Victoires</th>
            <th>Égalités</th>
            <th>Duels Joués</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.points}</td>
              <td>{user.totalWins}</td>
              <td>{user.totalDraws}</td>
              <td>{user.totalDuelsPlayed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
