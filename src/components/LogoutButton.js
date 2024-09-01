import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirige vers la page de connexion après la déconnexion
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
