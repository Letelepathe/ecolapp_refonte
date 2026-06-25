import React, { useEffect, useState } from "react";
import axios from "axios";
import NavHautDashboard from "../common/TableauDeBord/NavHautDashboard";

const NavbarTop = () => {
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
      } catch (erreur) {
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
      accueil="/admin-general/bureau_admin"
      profil="/admin-general/profil_admin"
      deconnexion="/admin-general/deconnexion"
      titreCourt="Ecolapp"
    />
  );
};

export default NavbarTop;
