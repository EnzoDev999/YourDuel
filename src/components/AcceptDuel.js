import React from "react";
import { useDispatch } from "react-redux";
import {
  acceptDuel,
  setQuestion,
  setStatus,
  setError,
} from "../redux/slices/duelSlice";
import questionsData from "../data/questions.json"; // Importation des questions locales

const AcceptDuel = ({ duelId, category }) => {
  const dispatch = useDispatch();

  const getRandomQuestion = (category) => {
    const filteredQuestions = category
      ? questionsData.questions.filter((q) => q.category === category)
      : questionsData.questions;

    return filteredQuestions[
      Math.floor(Math.random() * filteredQuestions.length)
    ];
  };

  const handleAcceptDuel = async () => {
    console.log("Bouton cliqué, duel accepté");

    dispatch(setStatus("loading"));

    try {
      dispatch(acceptDuel(duelId));
      console.log("Duel accepté, sélection d'une question...");

      const questionData = getRandomQuestion(category); // Sélectionne une question aléatoire
      console.log("Question sélectionnée:", questionData);

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
      console.error("Erreur lors de la sélection des questions:", error);
      dispatch(setError("Failed to select question. Please try again."));
      dispatch(setStatus("failed"));
    }
  };

  return <button onClick={handleAcceptDuel}>Accepter le duel</button>;
};

export default AcceptDuel;
