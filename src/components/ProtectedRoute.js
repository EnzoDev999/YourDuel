import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Utilisation de useSelector pour récupérer l'état de l'utilisateur
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Sinon, affiche les enfants (les composants enfants de la route)
  return children;
};

export default ProtectedRoute;
