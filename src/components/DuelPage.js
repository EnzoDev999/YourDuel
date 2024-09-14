import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import CreateDuel from "./CreateDuel";
import PendingDuels from "./PendingDuels";
import DuelQuestion from "./DuelQuestion";
import ResetDuelsButton from "./ResetDuelsButton";

const Profile = () => {
  const { isAuthenticated, userInfo, status, error } = useSelector(
    (state) => state.user
  );

  const duels = useSelector((state) =>
    state.duel.duels.filter(
      (duel) =>
        (duel.challenger === userInfo._id || duel.opponent === userInfo._id) &&
        duel.status === "accepted"
    )
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

          <CreateDuel />

          <PendingDuels userId={userInfo._id} />

          {duels.length > 0 ? (
            duels.map((duel) => (
              <DuelQuestion key={duel._id} duelId={duel._id} />
            ))
          ) : (
            <p>Aucun duel en cours.</p>
          )}

          <ResetDuelsButton />
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
