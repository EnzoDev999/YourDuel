import React from "react";
import { useDispatch } from "react-redux";
import { deleteDuel } from "../redux/slices/duelSlice";

const RefuseDuelButton = ({ duelId }) => {
  const dispatch = useDispatch();

  console.log("ID reçu par RefuseDuelButton lors du rendu :", duelId);

  const handleRefuseDuel = () => {
    if (duelId) {
      console.log("Suppression du duel avec ID :", duelId); // Vérification de l'ID
      dispatch(deleteDuel(duelId));
    } else {
      console.error("ID du duel non défini."); // Log pour identifier les problèmes
    }
  };

  return <button onClick={handleRefuseDuel}>Refuser le Duel</button>;
};

export default RefuseDuelButton;
