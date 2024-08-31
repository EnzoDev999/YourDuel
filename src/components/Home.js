import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Bienvenue sur Your Duel</h1>
      <nav>
        <ul>
          <li>
            <Link to="/duels">Aller aux duels</Link>
          </li>
          <li>
            <Link to="/profile">Voir le profil</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
