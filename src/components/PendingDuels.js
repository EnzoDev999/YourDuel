import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDuels, acceptDuel } from "../redux/slices/duelSlice";
import RefuseDuelButton from "./RefuseDuelButton"; // Importation du bouton Refuser
import { io } from "socket.io-client";

const PendingDuels = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);
  const pendingDuels = useSelector((state) =>
    state.duel.duels.filter(
      (duel) => duel.opponent === userId && duel.status === "pending"
    )
  );
  const duelStatus = useSelector((state) => state.duel.status);

  useEffect(() => {
    if (userId) {
      dispatch(fetchDuels(userId));
    }

    // Connexion à WebSocket
    const socket = io("http://localhost:5000"); // Vérifie l'URL ici

    socket.emit("join", userId); // L'utilisateur rejoint son propre room
    console.log(`L'utilisateur ${userId} a rejoint le room WebSocket`);

    socket.on("duelReceived", (newDuel) => {
      console.log("Nouveau duel reçu :", newDuel); // Log pour vérifier la réception de l'événement
      dispatch(fetchDuels(userId)); // Met à jour les duels pour afficher la nouvelle invitation
    });

    return () => {
      socket.off("duelReceived"); // Nettoyage lorsque le composant est démonté
    };
  }, [dispatch, userId]);

  const handleAcceptDuel = (duelId) => {
    dispatch(acceptDuel(duelId));
  };

  return (
    <div>
      <h2>Invitations de Duels en Attente</h2>
      {duelStatus === "loading" ? (
        <p>Chargement des duels...</p>
      ) : pendingDuels.length > 0 ? (
        pendingDuels.map((duel) => (
          <div key={duel._id}>
            <p>Catégorie : {duel.category}</p>
            <p>Adversaire : {duel.challengerUsername}</p>
            <button onClick={() => handleAcceptDuel(duel._id)}>
              Accepter le Duel
            </button>
            <RefuseDuelButton duelId={duel._id} />{" "}
            {/* Assurez-vous que duel.id est bien passé */}
          </div>
        ))
      ) : (
        <p>Vous n'avez pas d'invitations en attente.</p>
      )}
    </div>
  );
};

export default PendingDuels;
