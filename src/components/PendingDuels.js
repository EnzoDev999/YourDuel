import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { acceptDuel } from "../redux/slices/duelSlice"; // Assurez-vous d'avoir cette action dans votre slice

const PendingDuels = ({ userId }) => {
  const dispatch = useDispatch();
  const pendingDuels = useSelector((state) =>
    state.duel.duels.filter(
      (duel) => duel.opponent === userId && duel.status === "pending"
    )
  );

  const handleAcceptDuel = (duelId) => {
    dispatch(acceptDuel(duelId));
  };

  return (
    <div>
      <h2>Invitations de Duels en Attente</h2>
      {pendingDuels.length > 0 ? (
        pendingDuels.map((duel) => (
          <div key={duel.id}>
            <p>Catégorie : {duel.category}</p>
            <p>Adversaire : {duel.challenger}</p>
            <button onClick={() => handleAcceptDuel(duel.id)}>
              Accepter le Duel
            </button>
          </div>
        ))
      ) : (
        <p>Vous n'avez pas d'invitations en attente.</p>
      )}
    </div>
  );
};

export default PendingDuels;
