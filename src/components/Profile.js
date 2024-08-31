import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { isAuthenticated, userInfo, status } = useSelector(
    (state) => state.user
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <p> You are not logged in. </p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      {userInfo && (
        <div>
          <p> Email: {userInfo.email}</p>
          {/* Affiche d'autres informations utilisateur si disponibles*/}
        </div>
      )}
    </div>
  );
};

export default Profile;
