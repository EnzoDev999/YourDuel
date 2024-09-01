import React from "react";
import { useSelector } from "react-redux";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import DuelPage from "./components/DuelPage";

function App() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div>
      {!currentUser ? (
        <>
          <Register />
          <Login />
        </>
      ) : (
        <>
          <p>Bienvenue, {currentUser.username}!</p>
          <Logout />
          <DuelPage userId={currentUser.username} />{" "}
          {/* Passer l'ID utilisateur à DuelPage */}
        </>
      )}
    </div>
  );
}

export default App;
