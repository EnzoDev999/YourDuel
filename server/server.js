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
    origin: "https://turbo-space-capybara-qjgjjxrp6q529xxr-3000.app.github.dev", // URL de ton frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Autoriser les cookies et autres informations d'identification
  })
);

const io = new Server(server, {
  cors: {
    origin: "https://turbo-space-capybara-qjgjjxrp6q529xxr-3000.app.github.dev", // URL de ton frontend
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io); // Attache l'objet io à l'application

// Tes routes et middlewares ici
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/duels", require("./routes/duelRoutes")(io));

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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
);
