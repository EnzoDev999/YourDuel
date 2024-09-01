const mongoose = require("mongoose");

const duelSchema = new mongoose.Schema({
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challengerUsername: {
    type: String,
    required: true,
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  opponentUsername: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: false, // Rendre optionnel
  },
  options: {
    type: [String],
    required: false, // Rendre optionnel
  },
  correctAnswer: {
    type: String,
    required: false, // Rendre optionnel
  },
  challengerAnswer: {
    type: String,
  },
  opponentAnswer: {
    type: String,
  },
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
