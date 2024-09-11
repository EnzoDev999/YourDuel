module.exports = (io) => {
  const express = require("express");
  const {
    createDuel,
    getDuels,
    acceptDuel,
    getUserDuels,
    deleteDuel,
  } = require("../controllers/duelController");

  const router = express.Router();

  // Route pour créer un duel
  router.post("/", (req, res) => createDuel(req, res, io)); // Passer `io` ici

  // Route pour accepter un duel
  router.put("/:id/accept", (req, res) => acceptDuel(req, res, io));

  // Route pour récupérer tous les duels
  router.get("/", getDuels);

  // Route pour récupérer les duels d'un utilisateur spécifique
  router.get("/user/:userId", getUserDuels);

  // Route pour refuser (et donc supprimer) un duel
  router.delete("/:id/refuse", deleteDuel); // Utiliser la route DELETE pour refuser un duel

  return router;
};
