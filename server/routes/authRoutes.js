const express = require("express");
const {
  register,
  login,
  getUserProfile,
  getLeaderboard,
  resetAllUserStats,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // Utilisation du middleware protect
const User = require("../models/User");
const router = express.Router();

// Route pour l'inscription
router.post("/register", register);

// Route pour la connexion
router.post("/login", login);

// Route pour récupérer le profil de l'utilisateur connecté
router.get("/profile", protect, getUserProfile);

// Route pour récupérer un utilisateur par son nom d'utilisateur
router.get("/users/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    });
  }
});

// Route pour obtenir l'historique des duels de l'utilisateur
router.get("/duelHistory/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "duelsHistory.duelId"
    );
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user.duelsHistory);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'historique des duels :",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique des duels",
      error,
    });
  }
});

router.get("/leaderboard", getLeaderboard); // Route pour obtenir le classement des utilisateurs

router.put("/resetStats", resetAllUserStats); // Route pour réinitialiser les stats des utilisateurs

module.exports = router;
