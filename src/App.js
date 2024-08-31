import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import DuelPage from "./components/DuelPage"; // Page dédiée aux duels
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/duels" element={<DuelPage />} />
          <Route path="/profile" element={<Profile />} />
          {/* Ajoute d'autres routes si nécessaire */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
