const Duel = require("../models/Duel");
const User = require("../models/User");
const axios = require("axios");

// Créer un nouveau duel
// Créer un nouveau duel avec génération de la question
exports.createDuel = async (req, res, io) => {
  const { challenger, opponent, category } = req.body;

  try {
    const challengerUser = await User.findById(challenger);
    const opponentUser = await User.findById(opponent);

    if (!challengerUser || !opponentUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Appel à l'API pour obtenir une question aléatoire dès la création du duel
    const response = await axios.get(
      `${process.env.API_URL}/api/questions/random/${category}`
    );
    const questionData = response.data;

    const duel = new Duel({
      challenger: challengerUser._id,
      challengerUsername: challengerUser.username,
      opponent: opponentUser._id,
      opponentUsername: opponentUser.username,
      category,
      question: questionData.question, // Ajouter la question générée
      options: questionData.options, // Ajouter les options
      correctAnswer: questionData.correctAnswer, // Ajouter la réponse correcte
      status: "pending", // Le duel est en attente d'acceptation
    });

    await duel.save();

    // Notification via WebSocket au joueur qui reçoit le duel
    io.to(opponentUser._id.toString()).emit("duelReceived", duel);

    res.status(201).json(duel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du duel", error });
  }
};

exports.acceptDuel = async (req, res, io) => {
  try {
    const duel = await Duel.findById(req.params.id);
    if (!duel) {
      return res.status(404).json({ message: "Duel non trouvé" });
    }

    duel.status = "accepted"; // Marquer le duel comme accepté
    await duel.save();

    // Notifier les deux joueurs via WebSocket
    io.to(duel.challenger.toString()).emit("duelAccepted", duel);
    io.to(duel.opponent.toString()).emit("duelAccepted", duel);

    res.status(200).json(duel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'acceptation du duel", error });
  }
};

// Récupérer tous les duels
exports.getDuels = async (req, res) => {
  try {
    const duels = await Duel.find();
    res.status(200).json(duels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des duels", error });
  }
};

exports.getUserDuels = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupérer à la fois les duels envoyés et reçus par l'utilisateur avec les statuts "pending" ou "accepted"
    const receivedDuels = await Duel.find({
      opponent: userId,
      status: { $in: ["pending", "accepted"] }, // Inclure les duels "accepted"
    });
    const sentDuels = await Duel.find({
      challenger: userId,
      status: { $in: ["pending", "accepted"] }, // Inclure les duels "accepted"
    });

    // Combiner les duels envoyés et reçus
    const allDuels = [...receivedDuels, ...sentDuels];

    res.status(200).json(allDuels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des duels", error });
  }
};

exports.deleteDuel = async (req, res, io) => {
  try {
    const duel = await Duel.findById(req.params.id);
    if (!duel) {
      return res.status(404).json({ message: "Duel non trouvé" });
    }

    // Utilisation de deleteOne() pour supprimer le duel
    await duel.deleteOne();

    // Notification aux joueurs que le duel a été annulé
    io.to(duel.challenger.toString()).emit("duelCancelled", duel._id);
    io.to(duel.opponent.toString()).emit("duelCancelled", duel._id);

    res.status(200).json({ message: "Duel supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du duel :", error);
    res.status(500).json({
      message: "Erreur lors de la suppression du duel",
      error: error.message || "Erreur inconnue",
    });
  }
};
