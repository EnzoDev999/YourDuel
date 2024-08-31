import React from "react";
import InitiateDuel from "./InitiateDuel";
import PendingDuels from "./PendingDuels";
import DuelQuestion from "./DuelQuestion";

const DuelPage = () => {
  const userId = 1; // Simule un utilisateur avec un ID fixe

  return (
    <div>
      <h1>Duels</h1>
      <InitiateDuel userId={userId} />
      <PendingDuels userId={userId} />
      <DuelQuestion duelId={userId} userId={userId} />
    </div>
  );
};

export default DuelPage;
