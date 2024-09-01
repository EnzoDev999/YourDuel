import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const Profile = () => {
  const { isAuthenticated, userInfo, status, error } = useSelector(
    (state) => state.user
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      {userInfo ? (
        <div>
          <Navbar />
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email || "No email provided"}</p>
          {/* Ajoute d'autres informations utilisateur si disponibles */}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
