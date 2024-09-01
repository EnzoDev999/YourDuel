const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Inscription d'un utilisateur
exports.register = async (req, res) => {
  const { username, email, password } = req.body; // Assurez-vous de récupérer l'email depuis le body
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }

    // Crée un nouvel utilisateur
    const user = await User.create({ username, email, password });

    // Génère le token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Envoie la réponse avec l'ID, le nom d'utilisateur, l'email et le token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email, // Ajoute l'email ici
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.json({ _id: user._id, username: user.username, token });
    } else {
      res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
};
