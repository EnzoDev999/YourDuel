import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import axios from "axios";
import { io } from "socket.io-client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const socket = io("https://yourduel.onrender.com/", {
  transports: ["websocket", "polling"], // Assurez-vous d'utiliser WebSocket
});

socket.on("connect", () => {
  console.log("WebSocket connecté avec succès :", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Erreur de connexion WebSocket :", error);
});

socket.onAny((event, data) => {
  console.log(`Événement WebSocket reçu: ${event}`, data);
});

// Sélectionne l'élément DOM où l'application sera montée
const rootElement = document.getElementById("root");

// Crée un root React avec createRoot
const root = ReactDOM.createRoot(rootElement);

// Interceptor pour loguer les requêtes avant de les envoyer
axios.interceptors.request.use((request) => {
  console.log("Requête envoyée via axios :", request);
  return request;
});

// Render l'application avec le store Redux intégré
root.render(
  <Provider store={store}>
    <App />
    <SpeedInsights />
    <Analytics />
  </Provider>
);
