import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDuel, acceptDuel } from "../redux/slices/duelSlice";

const DuelTest = () => {
  const dispatch = useDispatch();
  const duels = useSelector((state) => state.duel.duels);

  const handleCreateDuel = () => {
    const newDuel = {
      id: Date.now(),
      challenger: "user1",
      opponent: "user2",
      category: "Culture Générale",
      status: "pending",
    };
    dispatch(createDuel(newDuel));
  };

  const handleAcceptDuel = (id) => {
    dispatch(acceptDuel(id));
  };

  return (
    <div>
      <h2>Duel Test</h2>
      <button onClick={handleCreateDuel}>Create Duel</button>
      <ul>
        {duels.map((duel) => (
          <li key={duel.id}>
            {duel.challenger} vs {duel.opponent} - {duel.category} -{" "}
            {duel.status}
            {duel.questions && (
              <ul>
                {duel.questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            )}
            {duel.status === "pending" && (
              <button onClick={() => handleAcceptDuel(duel.id)}>
                Accept Duel
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DuelTest;
