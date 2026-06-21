import React, { useEffect, useState } from "react";
import axios from "axios";
import NavHautDashboard from "./NavHautDashboard";

const NavHautUtilisateurEcole = ({ cycle }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const chargerUser = async () => {
      try {
        const response = await axios.get("https://api.ecolapp.cd/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (response.status === 200) setUser(response.data);
      } catch {
        console.log("Erreur lors de la récupération des informations.");
      }
    };

    chargerUser();
  }, []);

  if (!user) {
    return (
      <div className="dashboard-full-loader">
        <p className="spinner"></p>
      </div>
    );
  }

  return (
    <NavHautDashboard
      user={user}
      accueil={`/${cycle}/profil_user`}
      profil={`/${cycle}/mon_profil/${user.id || ""}`}
      deconnexion={`/${cycle}/deconnexion`}
      titreCourt="GLearn"
    />
  );
};

export default NavHautUtilisateurEcole;
