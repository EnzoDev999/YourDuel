import React from "react";
import { useDispatch } from "react-redux";
import { deleteDuel } from "../redux/slices/duelSlice";

const RefuseDuelButton = ({ duelId }) => {
  const dispatch = useDispatch();

  const handleRefuseDuel = () => {
    if (duelId) {
      dispatch(deleteDuel(duelId));
    } else {
      console.error("ID du duel non défini."); // Log pour identifier les problèmes
    }
  };

  return <button onClick={handleRefuseDuel}>Refuser le Duel</button>;
};

export default RefuseDuelButton;
