import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitAnswer,
  setQuestion,
  removeDuel,
} from "../redux/slices/duelSlice";
import { io } from "socket.io-client";

const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL_NETWORK;

const DuelQuestion = ({ duelId }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userInfo._id); // Ajoutez cette ligne pour récupérer userId
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sélection du duel à partir de l'état Redux
  const duel = useSelector((state) => {
    const foundDuel = state.duel.duels.find((duel) => duel._id === duelId);
    return foundDuel;
  });

  useEffect(() => {
    console.log("Composant DuelQuestion monté pour le duel:", duelId);
    const socket = io(API_URL);

    // Rejoins à la fois la room de l'utilisateur et du duel
    socket.emit("joinRooms", { userId, duelId });
    console.log(
      `Tentative de rejoindre les rooms pour user ${userId} et duel ${duelId}`
    );

    // Événement pour accepter le duel
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

    // Événement pour compléter le duel
    socket.on("duelCompleted", (updatedDuel) => {
      console.log(
        "Événement duelCompleted reçu pour le duel:",
        updatedDuel._id
      );
      dispatch(
        setQuestion({
          duelId: updatedDuel._id,
          question: updatedDuel.question,
          options: updatedDuel.options,
          correctAnswer: updatedDuel.correctAnswer,
          status: updatedDuel.status,
          winner: updatedDuel.winner,
        })
      );
      if (updatedDuel.status === "completed") {
        console.log("Duel terminé et suppression en cours :", updatedDuel._id);
        dispatch(removeDuel(updatedDuel._id));
      }
    });

    return () => {
      socket.off("duelAccepted");
      socket.off("duelCompleted");
    };
  }, [dispatch, duelId, userId]);

  const handleSubmit = () => {
    if (duel && selectedOption && userId) {
      dispatch(
        submitAnswer({
          duelId, // Assurez-vous que duelId est bien défini
          userId, // Envoyez aussi userId pour identifier l'utilisateur qui soumet
          answer: selectedOption,
        })
      )
        .unwrap()
        .then(() => {
          setIsSubmitted(true);
        })
        .catch((error) => {
          console.error("Erreur lors de la soumission de la réponse :", error);
        });

      setFeedback(
        selectedOption === duel.correctAnswer
          ? "Correct!"
          : `Incorrect. La bonne réponse était : ${duel.correctAnswer}`
      );
    } else {
      console.log("Tous les paramètres requis ne sont pas présents.");
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
                disabled={isSubmitted}
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
