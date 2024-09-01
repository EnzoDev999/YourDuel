const Duel = require("../models/Duel");
const User = require("../models/User");

// Créer un nouveau duel
exports.createDuel = async (req, res, io) => {
  const { challenger, opponent, category } = req.body;

  try {
    console.log("Données reçues pour créer un duel :", req.body);

    const challengerUser = await User.findById(challenger);
    const opponentUser = await User.findById(opponent);

    if (!challengerUser || !opponentUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const duel = new Duel({
      challenger: challengerUser._id,
      challengerUsername: challengerUser.username,
      opponent: opponentUser._id,
      opponentUsername: opponentUser.username,
      category,
      status: "pending", // Le duel est créé en mode "pending"
    });

    await duel.save();

    // Ajout d'un console.log avant l'émission de l'événement
    console.log(
      `Émission de l'événement 'duelReceived' à l'utilisateur ${opponentUser._id}`
    );
    io.to(opponentUser._id.toString()).emit("duelReceived", duel);
    res.status(201).json(duel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du duel", error });
  }
};

// Accepter un duel (ajouter les questions)
exports.acceptDuel = async (req, res) => {
  try {
    const duel = await Duel.findById(req.params.id);
    if (!duel) {
      return res.status(404).json({ message: "Duel non trouvé" });
    }
    // Ajouter la question, les options et la réponse correcte lors de l'acceptation du duel
    duel.status = "accepted";
    duel.question =
      req.body.question || "Quelle est la capitale de la France ?";
    duel.options = req.body.options || ["Paris", "Lyon", "Marseille", "Nice"];
    duel.correctAnswer = req.body.correctAnswer || "Paris";
    await duel.save();
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
    const duels = await Duel.find({ opponent: userId, status: "pending" });
    res.status(200).json(duels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des duels", error });
  }
};

exports.deleteDuel = async (req, res) => {
  try {
    const duel = await Duel.findByIdAndDelete(req.params.id); // Utilisation de findByIdAndDelete
    if (!duel) {
      return res.status(404).json({ message: "Duel non trouvé" });
    }
    res.status(200).json({ message: "Duel supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du duel :", error);
    res.status(500).json({
      message: "Erreur lors de la suppression du duel",
      error: error.message || "Erreur inconnue",
    });
  }
};
