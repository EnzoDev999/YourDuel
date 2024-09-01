// import React from "react";
// import { useDispatch } from "react-redux";
// import { createDuel } from "../redux/slices/duelSlice";

// const InitiateDuel = ({ userId, onDuelStart }) => {
//   const dispatch = useDispatch();

//   const handleInitiateDuel = (category) => {
//     const newDuelId = Date.now().toString();

//     // Création d'un duel sans question
//     dispatch(
//       createDuel({
//         id: newDuelId,
//         challenger: userId,
//         opponent: userId, // Remplacez par le vrai adversaire
//         category: category,
//         question: null, // Pas de question au début
//         options: [],
//         correctAnswer: null,
//         status: "pending",
//       })
//     );

//     if (onDuelStart) {
//       onDuelStart(newDuelId);
//     }
//   };

//   return (
//     <div>
//       <button onClick={() => handleInitiateDuel("Culture Générale")}>
//         Lancer un duel en culture générale
//       </button>
//       {/* Ajoute d'autres catégories si nécessaire */}
//     </div>
//   );
// };

// export default InitiateDuel;
