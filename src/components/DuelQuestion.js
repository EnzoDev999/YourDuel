import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswer, setQuestion } from "../redux/slices/duelSlice";
import { io } from "socket.io-client";

const DuelQuestion = ({ duelId }) => {
  console.log("DuelQuestion: duelId reçu :", duelId); // Ajoutez ce log pour vérifier le duelId dans DuelQuestion

  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");

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

    return () => {
      socket.off("duelAccepted");
    };
  }, [dispatch, duelId]);

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
              />
              {option}
            </label>
          </div>
        ))}
        <button onClick={handleSubmit} disabled={!selectedOption}>
          Soumettre la réponse
        </button>
        {feedback && <p>{feedback}</p>}
      </div>
    );
  }
};

export default DuelQuestion;
