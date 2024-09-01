const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app); // Créer un serveur HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Permettre toutes les origines (à restreindre en production)
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/duels", require("./routes/duelRoutes")(io));

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`L'utilisateur ${userId} a rejoint son propre room`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
);
