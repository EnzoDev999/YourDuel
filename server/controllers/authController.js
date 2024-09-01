const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Inscription d'un utilisateur
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }
    const user = await User.create({ username, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ _id: user._id, username: user.username, token });
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
