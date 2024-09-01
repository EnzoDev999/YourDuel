import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswer } from "../redux/slices/duelSlice";

const DuelQuestion = ({ duelId }) => {
  const dispatch = useDispatch();

  // Sélection du duel à partir de l'état Redux
  const duel = useSelector((state) => {
    const foundDuel = state.duel.duels.find((d) => d.id === duelId);
    console.log("Duel trouvé :", foundDuel); // Log pour vérifier ce que reçoit le composant
    return foundDuel;
  });

  // État local pour stocker la réponse sélectionnée et le feedback
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    console.log("Duel mis à jour:", duel); // Log pour vérifier les mises à jour du duel
  }, [duel]);

  const handleSubmit = () => {
    if (duel && selectedOption) {
      dispatch(
        submitAnswer({
          duelId,
          answer: selectedOption,
        })
      );

      if (selectedOption === duel.correctAnswer) {
        setFeedback("Correct!");
      } else {
        setFeedback(
          `Incorrect. La bonne réponse était : ${duel.correctAnswer}`
        );
      }
    }
  };

  if (!duel) {
    return <p>Aucun duel en cours.</p>; // Message lorsque le duel n'est pas trouvé
  }

  if (!duel.question) {
    return <p>En attente de la génération de la question...</p>; // Message lorsque la question n'est pas encore générée
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
      <button onClick={handleSubmit} disabled={!selectedOption}>
        Soumettre la réponse
      </button>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default DuelQuestion;
