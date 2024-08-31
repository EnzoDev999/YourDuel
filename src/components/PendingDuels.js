import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptDuel, setQuestion } from "../redux/slices/duelSlice";
import { fetchQuestions } from "../api";

const PendingDuels = ({ userId }) => {
  const dispatch = useDispatch();
  const duels = useSelector((state) =>
    state.duel.duels.filter(
      (duel) => duel.opponent === userId && duel.status === "pending"
    )
  );

  const handleAcceptDuel = async (duelId, category) => {
    dispatch(acceptDuel(duelId));

    // Générer une question après l'acceptation du duel
    const questionData = await fetchQuestions(category);

    dispatch(
      setQuestion({
        duelId,
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
      })
    );

    console.log("Dispatched setQuestion with:", {
      duelId: duelId, // Assurez-vous que ce duelId est correct
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
    });
  };

  return (
    <div>
      <h2>Pending Duels</h2>
      {duels.length > 0 ? (
        duels.map((duel) => (
          <div key={duel.id}>
            <p>Duel en {duel.category}</p>
            <button onClick={() => handleAcceptDuel(duel.id, duel.category)}>
              Accept Duel
            </button>
          </div>
        ))
      ) : (
        <p>No pending duels.</p>
      )}
    </div>
  );
};

export default PendingDuels;
