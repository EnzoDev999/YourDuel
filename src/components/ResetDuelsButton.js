import React from "react";
import { useDispatch } from "react-redux";
import { clearDuels } from "../redux/slices/duelSlice";

const ResetDuelsButton = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(clearDuels());
  };

  return <button onClick={handleReset}>Vider tous les duels</button>;
};

export default ResetDuelsButton;
