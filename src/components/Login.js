import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/userSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser({ username }));
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
