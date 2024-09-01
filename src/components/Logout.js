import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/userSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <button onClick={handleLogout}>Se déconnecter</button>;
};

export default Logout;
