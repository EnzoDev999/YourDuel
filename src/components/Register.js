import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/slices/userSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(registerUser({ username }));
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
