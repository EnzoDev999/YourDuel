import React from "react";
import InitiateDuel from "./InitiateDuel";
import PendingDuels from "./PendingDuels";
import DuelQuestion from "./DuelQuestion";
import { useSelector } from "react-redux";

const DuelPage = ({ userId }) => {
  const duels = useSelector((state) =>
    state.duel.duels.filter(
      (duel) => duel.challenger === userId || duel.opponent === userId
    )
  );

  return (
    <div>
      <h1>Mes Duels</h1>
      <InitiateDuel userId={userId} />
      <PendingDuels userId={userId} />
      {duels.map((duel) => (
        <DuelQuestion key={duel.id} duel={duel} userId={userId} />
      ))}
    </div>
  );
};

export default DuelPage;
