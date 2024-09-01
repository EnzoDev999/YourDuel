const mongoose = require("mongoose");

const duelSchema = new mongoose.Schema({
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  // Réponses des joueurs
  challengerAnswer: {
    type: String,
  },
  opponentAnswer: {
    type: String,
  },
  // Résultats du duel
  challengerPointsGained: {
    type: Number,
    default: 0,
  },
  opponentPointsGained: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending",
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Duel = mongoose.model("Duel", duelSchema);

module.exports = Duel;
