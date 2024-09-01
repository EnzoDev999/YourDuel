import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptDuel, setQuestion } from "../redux/slices/duelSlice";
import questionsData from "../data/questions.json"; // Importer le fichier JSON avec les questions

const PendingDuels = ({ userId }) => {
  const dispatch = useDispatch();
  const duels = useSelector((state) =>
    state.duel.duels.filter(
      (duel) => duel.opponent === userId && duel.status === "pending"
    )
  );

  const getRandomQuestion = (category) => {
    const filteredQuestions = category
      ? questionsData.questions.filter((q) => q.category === category)
      : questionsData.questions;

    return filteredQuestions[
      Math.floor(Math.random() * filteredQuestions.length)
    ];
  };

  const handleAcceptDuel = async (duelId, category) => {
    dispatch(acceptDuel(duelId));

    // Générer une question après l'acceptation du duel
    const questionData = getRandomQuestion(category);

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
      <h2>Duels en Attente</h2>
      {duels.length > 0 ? (
        duels.map((duel) => (
          <div key={duel.id}>
            <p>Duel en {duel.category}</p>
            <button onClick={() => handleAcceptDuel(duel.id, duel.category)}>
              Accepter le Duel
            </button>
          </div>
        ))
      ) : (
        <p>Pas de duels en attente.</p>
      )}
    </div>
  );
};

export default PendingDuels;
