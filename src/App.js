import React from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";

function App() {
  return (
    <div>
      <h1>Your Duel</h1>
      <Login />
      <Signup />
      <Profile />
    </div>
  );
}

export default App;
