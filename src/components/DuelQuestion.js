import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswer } from "../redux/slices/duelSlice";

const DuelQuestion = ({ duelId, userId }) => {
  const dispatch = useDispatch();

  // Utilisation de `useSelector` pour récupérer le duel depuis Redux
  console.log("Duel ID utilisé dans DuelQuestion:", duelId);
  const duel = useSelector((state) =>
    state.duel?.duels?.find((d) => d.id === duelId)
  );
  console.log("Duel fetched from Redux:", duel);

  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [localUpdate, setLocalUpdate] = useState(false);

  // Ajoute un délai pour permettre la mise à jour complète de l'état avant de rendre le composant
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (duel) {
        console.log("Duel object après le délai:", duel);
        if (duel.question) {
          console.log("Question disponible après le délai :", duel.question);
          setLocalUpdate((prev) => !prev); // Force le re-render
        } else {
          console.log(
            "Aucune question disponible pour ce duel après le délai."
          );
        }
      } else {
        console.log("Duel non trouvé après le délai.");
      }
    }, 100); // Délai de 100ms

    // Nettoyage du timeout lorsqu'il n'est plus nécessaire
    return () => clearTimeout(timeout);
  }, [duelId, duel]);

  const handleSubmitAnswer = () => {
    dispatch(
      submitAnswer({
        duelId,
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

  if (!duel || !duel.question) {
    return <p>En attente de la génération de la question...</p>;
  }

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
      {/* Utilisation de localUpdate dans le DOM */}
      {localUpdate && <span style={{ display: "none" }}>{localUpdate}</span>}
    </div>
  );
};

export default DuelQuestion;
