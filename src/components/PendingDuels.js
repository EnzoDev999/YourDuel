import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDuels, deleteDuel, acceptDuel } from "../redux/slices/duelSlice";
import { io } from "socket.io-client";

const PendingDuels = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id);
  const duels = useSelector((state) => state.duel.duels);
  const duelStatus = useSelector((state) => state.duel.status);

  // Filtre des duels envoyés par l'utilisateur (en attente de réponse)
  const sentDuels = duels.filter(
    (duel) => duel.challenger === userId && duel.status === "pending"
  );

  // Filtre des duels reçus par l'utilisateur (en attente d'acceptation ou de refus)
  const receivedDuels = duels.filter(
    (duel) => duel.opponent === userId && duel.status === "pending"
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchDuels(userId));
    }

    const socket = io(
      process.env.REACT_APP_API_URL ||
        "https://turbo-space-capybara-qjgjjxrp6q529xxr-5000.app.github.dev"
    );

    socket.emit("join", userId);
    console.log(`L'utilisateur ${userId} a rejoint le room WebSocket`);

    socket.on("duelReceived", (newDuel) => {
      console.log("Nouveau duel reçu :", newDuel);
      dispatch(fetchDuels(userId));
    });

    socket.on("duelAccepted", (updatedDuel) => {
      console.log("Duel accepté :", updatedDuel);
      dispatch(fetchDuels(userId));
    });

    socket.on("duelCancelled", (cancelledDuelId) => {
      console.log("Duel annulé:", cancelledDuelId);
      dispatch({
        type: "duel/removeDuel", // Action Redux pour supprimer le duel
        payload: cancelledDuelId,
      });
    });

    return () => {
      socket.off("duelReceived");
      socket.off("duelAccepted");
      socket.off("duelCancelled");
    };
  }, [dispatch, userId]);

  const handleAcceptDuel = (duelId) => {
    dispatch(acceptDuel(duelId));
  };
  const handleCancelDuel = (duelId) => {
    dispatch(deleteDuel(duelId));
  };

  return (
    <div>
      <h2>Duels en attente</h2>

      {duelStatus === "loading" ? (
        <p>Chargement des duels...</p>
      ) : (
        <>
          <h3>Duels que vous avez envoyés (en attente de réponse)</h3>
          {sentDuels.length > 0 ? (
            sentDuels.map((duel) => (
              <div key={duel._id}>
                <p>Catégorie : {duel.category}</p>
                <p>Envoyé à : {duel.opponentUsername}</p>
                <p>Status : En attente de réponse</p>
                <button onClick={() => handleCancelDuel(duel._id)}>
                  Annuler le Duel
                </button>
              </div>
            ))
          ) : (
            <p>Aucun duel en attente de réponse.</p>
          )}

          <h3>Duels reçus</h3>
          {receivedDuels.length > 0 ? (
            receivedDuels.map((duel) => (
              <div key={duel._id}>
                <p>Catégorie : {duel.category}</p>
                <p>Adversaire : {duel.challengerUsername}</p>
                <button onClick={() => handleAcceptDuel(duel._id)}>
                  Accepter le Duel
                </button>
                <button onClick={() => handleCancelDuel(duel._id)}>
                  Refuser le Duel
                </button>
              </div>
            ))
          ) : (
            <p>Vous n'avez pas d'invitations en attente.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PendingDuels;
