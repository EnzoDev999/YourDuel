import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import axios from "axios";

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
  </Provider>
);
