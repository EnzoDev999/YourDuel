const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

// Route pour l'inscription
router.post("/register", register);

// Route pour la connexion
router.post("/login", login);

module.exports = router;
