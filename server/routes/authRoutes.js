const express = require("express");
const {
  register,
  login,
  getUserProfile,
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

module.exports = router;
