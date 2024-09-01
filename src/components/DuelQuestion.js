import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { submitAnswer } from "../redux/slices/duelSlice";

const DuelQuestion = ({ duel, userId }) => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [triggerUpdate, setTriggerUpdate] = useState(false); // État local pour forcer le re-render

  // Log du duel et de l'état complet pour débogage
  useEffect(() => {
    console.log("Duel reçu en prop:", duel);
    if (duel && duel.question) {
      console.log("Question trouvée:", duel.question);
      setTriggerUpdate((prev) => !prev); // Force le re-render si une question est trouvée
    }
  }, [duel]);

  const handleSubmitAnswer = () => {
    dispatch(
      submitAnswer({
        duelId: duel.id, // Utilise l'ID du duel passé en prop
        userId,
        answer: selectedOption,
      })
    );
    if (selectedOption === duel.correctAnswer) {
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect. La bonne réponse était : ${duel.correctAnswer}`);
    }
  };

  if (!duel) {
    return <p>Chargement du duel...</p>;
  }

  if (!duel.question) {
    return <p>En attente de la génération de la question...</p>;
  }

  console.log("Rendu de DuelQuestion avec:", {
    duel,
    question: duel.question,
    options: duel.options,
  });

  return (
    <div>
      <h3>{duel.question}</h3>
      {duel.options && duel.options.length > 0 ? (
        duel.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="quizOption"
                value={option}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              {option}
            </label>
          </div>
        ))
      ) : (
        <p>Pas d'options disponibles pour cette question.</p>
      )}
      <button onClick={handleSubmitAnswer} disabled={!selectedOption}>
        Soumettre la réponse
      </button>
      {feedback && <p>{feedback}</p>}
      {triggerUpdate && (
        <span style={{ display: "none" }}>{triggerUpdate}</span>
      )}
    </div>
  );
};

export default DuelQuestion;
