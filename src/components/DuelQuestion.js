import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswer, setQuestion } from "../redux/slices/duelSlice";
import { io } from "socket.io-client";

const DuelQuestion = ({ duelId }) => {
  console.log("DuelQuestion: duelId reçu :", duelId); // Ajoutez ce log pour vérifier le duelId dans DuelQuestion

  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Vérrouille la réponse après soumission

  // Sélection du duel à partir de l'état Redux
  const duel = useSelector((state) => {
    const foundDuel = state.duel.duels.find((duel) => duel._id === duelId);
    console.log("Duel trouvé dans Redux :", foundDuel); // Log pour vérifier si le duel est bien trouvé dans Redux
    return foundDuel;
  });

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);

    socket.emit("join", duelId);
    console.log(`Rejoint la room du duel ${duelId}`);

    // Evénement pour accepter le duel
    socket.on("duelAccepted", (updatedDuel) => {
      console.log("Duel accepté via WebSocket avec la question:", updatedDuel);
      dispatch(
        setQuestion({
          duelId: updatedDuel._id,
          question: updatedDuel.question,
          options: updatedDuel.options,
          correctAnswer: updatedDuel.correctAnswer,
        })
      );
    });

    // Réception de l'événement duelCompleted
    socket.on("duelCompleted", (updatedDuel) => {
      console.log("Duel terminé :", updatedDuel);
      dispatch(
        setQuestion({
          duelId: updatedDuel._id,
          question: updatedDuel.question,
          options: updatedDuel.options,
          correctAnswer: updatedDuel.correctAnswer,
          status: updatedDuel.status, // Ajout du statut ici
          winner: updatedDuel.winner, // Ajout du gagnant ici
        })
      );
    });

    return () => {
      socket.off("duelAccepted");
      socket.off("duelCompleted");
    };
  }, [dispatch, duelId]);

  const handleSubmit = () => {
    if (duel && selectedOption) {
      dispatch(
        submitAnswer({
          duelId,
          answer: selectedOption,
        })
      )
        .unwrap() // Utilisez unwrap() pour obtenir le résultat de la promesse
        .then(() => {
          console.log("Réponse soumise avec succès :", selectedOption);
          setIsSubmitted(true); // Verrouille la réponse après soumission
        })
        .catch((error) => {
          console.error("Erreur lors de la soumission de la réponse :", error);
        });

      setFeedback(
        selectedOption === duel.correctAnswer
          ? "Correct!"
          : `Incorrect. La bonne réponse était : ${duel.correctAnswer}`
      );
    }
  };

  if (!duel) {
    console.log("Le duel a disparu ou n'est pas disponible dans Redux.");
    return <p>Aucun duel en cours.</p>;
  }

  if (duel.status !== "accepted") {
    console.log("Le statut du duel n'est pas accepté :", duel);
    return <p>En attente de la génération de la question...</p>;
  }

  if (duel.status === "accepted") {
    return (
      <div>
        <h3>{duel.question}</h3>
        {duel.options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="quizOption"
                value={option}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={isSubmitted} // Désactiver la réponse après soumission
              />
              {option}
            </label>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || isSubmitted}
        >
          {isSubmitted ? "Réponse soumise" : "Soumettre la réponse"}
        </button>
        {feedback && <p>{feedback}</p>}
      </div>
    );
  }

  if (duel.status === "completed") {
    return (
      <div>
        <h3>Résultat du duel</h3>
        <p>Gagnant: {duel.winner === "draw" ? "Égalité" : duel.winner}</p>
        <p>
          Points du challenger ({duel.challengerUsername}):{" "}
          {duel.challengerPointsGained}
        </p>
        <p>
          Points de l'adversaire ({duel.opponentUsername}):{" "}
          {duel.opponentPointsGained}
        </p>
      </div>
    );
  }
};

export default DuelQuestion;
