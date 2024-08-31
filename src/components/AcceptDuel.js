import React from "react";
import { useDispatch } from "react-redux";
import {
  acceptDuel,
  setQuestion,
  setStatus,
  setError,
} from "../redux/slices/duelSlice";
import { fetchQuestions } from "../api";

const AcceptDuel = ({ duelId, category }) => {
  const dispatch = useDispatch();

  const handleAcceptDuel = async () => {
    console.log("Bouton cliqué, duel accepté");

    dispatch(setStatus("loading"));

    try {
      dispatch(acceptDuel(duelId));
      console.log("Duel accepté, génération des questions...");

      const questionData = await fetchQuestions(category);
      console.log("Questions générées:", questionData);

      dispatch(
        setQuestion({
          duelId,
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
        })
      );

      console.log("Dispatched setQuestion with:", {
        duelId,
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
      });

      dispatch(setStatus("succeeded"));
    } catch (error) {
      console.error("Erreur lors de la génération des questions:", error);
      dispatch(setError("Failed to generate question. Please try again."));
      dispatch(setStatus("failed"));
    }
  };

  return <button onClick={handleAcceptDuel}>Accepter le duel</button>;
};

export default AcceptDuel;
