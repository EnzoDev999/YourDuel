const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// Autoriser le frontend à se connecter via CORS
app.use(
  cors({
    origin: "http://localhost:3000", // URL du frontend local
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // URL du frontend local
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("socketio", io); // Attache l'objet io à l'application

// Middleware pour parser les requêtes en JSON
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/duels", require("./routes/duelRoutes")(io));
app.use("/api/questions", require("./routes/questionRoutes")); // Ajoute cette ligne pour la route des questions

// Connexion à Socket.IO
io.on("connection", (socket) => {
  console.log(`Nouvelle connexion : ${socket.id}`);

  socket.on("join", (userId) => {
    console.log(`L'utilisateur ${userId} a rejoint son room`);
    socket.join(userId);
  });

  socket.on("duelReceived", (data) => {
    console.log("Duel reçu :", data);
  });

  socket.on("duelAccepted", (data) => {
    console.log("Duel accepté :", data);
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
