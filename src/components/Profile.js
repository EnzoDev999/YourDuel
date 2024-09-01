import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import CreateDuel from "./CreateDuel";
import PendingDuels from "./PendingDuels";

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
      <Navbar />
      <h2>Profile</h2>
      {userInfo ? (
        <div>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email || "No email provided"}</p>

          {/* Ajouter ici la création de duel */}
          <CreateDuel />

          {/* Ajouter ici les invitations en attente */}
          <PendingDuels userId={userInfo.username} />
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
