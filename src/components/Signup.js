import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatus, setError } from "../redux/slices/userSlice";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, nous devrions vérifier que les mots de passe correspondent et envoyer les données au backend
    if (password !== confirmPassword) {
      dispatch(setError("Les mots de passe ne correspondent pas"));
      return;
    }

    dispatch(setStatus("loading"));

    // Simuler une requête asynchrone
    setTimeout(() => {
      dispatch(setStatus("Succeeded"));
      console.log("User registered", { email });
    }, 1000);
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
