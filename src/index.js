import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";

// Sélectionne l'élément DOM où l'application sera montée
const rootElement = document.getElementById("root");

// Crée un root React avec createRoot
const root = ReactDOM.createRoot(rootElement);

// Render l'application avec le store Redux intégré
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
