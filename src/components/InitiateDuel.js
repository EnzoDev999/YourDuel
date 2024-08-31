import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createDuel, setStatus } from "../redux/slices/duelSlice";

const InitiateDuel = ({ userId }) => {
  const [category, setCategory] = useState("Général"); // Catégorie par défaut
  const dispatch = useDispatch();

  const handleCreateDuel = () => {
    const duelId = Date.now(); // Génération de l'ID
    console.log("Duel ID généré :", duelId);

    const newDuel = {
      id: duelId,
      challenger: userId,
      opponent: userId, // L'utilisateur se défie lui-même
      category,
      status: "pending",
      question: null,
      options: [],
      correctAnswer: null,
    };

    dispatch(createDuel(newDuel));
    dispatch(
      setStatus("Duel envoyé à vous-même dans la catégorie " + category)
    );
  };

  return (
    <div>
      <h2>Initiate a Duel</h2>
      <label>
        Catégorie :
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Général">Général</option>
          <option value="Science">Science</option>
          <option value="Histoire">Histoire</option>
          <option value="Sport">Sport</option>
        </select>
      </label>
      <button onClick={handleCreateDuel}>Send Duel to Yourself</button>
    </div>
  );
};

export default InitiateDuel;
