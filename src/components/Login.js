import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setStatus, setError } from "../redux/slices/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setStatus("loading"));

    // Simuler une requête asynchrone pour vérifier si l'utilisateur existe
    setTimeout(() => {
      if (email === "user@example.com" && password === "password123") {
        dispatch(login({ email }));
        dispatch(setStatus("succeeded"));
      } else {
        dispatch(setError("Invalid email or password"));
        dispatch(setStatus("failed"));
      }
    }, 1000); // Simuler un temps de chargement d'une seconde
  };

  return (
    <div>
      <h2>Login</h2>
      {status === "loading" && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
