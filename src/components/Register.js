import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { error, status, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirige vers la page de profil ou de l'accueil si l'utilisateur est authentifié
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Créer un objet sans l'email si l'email est vide
    const userData = {
      username,
      password,
    };

    if (email) {
      userData.email = email; // Ajouter l'email si présent
    }

    console.log(userData);
    dispatch(registerUser(userData));
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {status === "loading" && <p>Registering...</p>}
      {/* Vérifiez si l'erreur est un objet ou une chaîne et affichez correctement */}
      {error && (
        <p>
          {typeof error === "string"
            ? error
            : error.message || "Erreur lors de l'inscription"}
        </p>
      )}
    </div>
  );
};

export default Register;
