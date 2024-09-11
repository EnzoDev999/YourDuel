import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswer, setQuestion } from "../redux/slices/duelSlice";
import { io } from "socket.io-client";

const DuelQuestion = ({ duelId }) => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");

  // Sélection du duel à partir de l'état Redux
  const duel = useSelector((state) => {
    const foundDuel = state.duel.duels.find((d) => d._id === duelId); // Utilisation de _id si c'est l'identifiant unique
    console.log("Duel trouvé :", foundDuel); // Log pour vérifier ce que reçoit le composant
    return foundDuel;
  });

  useEffect(() => {
    // Connexion à WebSocket, cette logique n'a pas besoin d'être déclenchée à chaque modification de duel
    const socket = io(
      process.env.REACT_APP_API_URL ||
        "http://turbo-space-capybara-qjgjjxrp6q529xxr-5000.app.github.dev"
    );

    socket.emit("join", duelId); // Rejoindre la room spécifique au duel
    console.log(`Rejoint la room du duel ${duelId}`);

    // Écoute pour l'événement duelReady
    socket.on("duelAccepted", (updatedDuel) => {
      console.log("Duel prêt avec la question:", updatedDuel);

      // Mise à jour de l'état redux avec les données du duel accepté
      dispatch(
        setQuestion({
          duelId: updatedDuel._id,
          question: updatedDuel.question,
          options: updatedDuel.options,
          correctAnswer: updatedDuel.correctAnswer,
        })
      );
    });

    return () => {
      socket.off("duelAccepted"); // Nettoyage de l'événement lors du démontage
    };
  }, [dispatch, duelId]); // duelId est suffisant ici, pas besoin d'inclure "duel"

  const handleSubmit = () => {
    if (duel && selectedOption) {
      dispatch(
        submitAnswer({
          duelId,
          answer: selectedOption,
        })
      );

      setFeedback(
        selectedOption === duel.correctAnswer
          ? "Correct!"
          : `Incorrect. La bonne réponse était : ${duel.correctAnswer}`
      );
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
