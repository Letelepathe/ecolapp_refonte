import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoEcolapp from "../../../static/images/logo_ecolapp.jpg";
import BarreLaterale from "./BarreLaterale";
import { menusEcole } from "./menusTableauBord";

const rolesAdmin = [
  "Administrateur",
  "Administratrice",
  "Super Administrateur",
  "Super Administratrice",
  "Secrétaire",
  "Secretaire",
  "Secrétariat",
  "Secretariat",
  "secrétaire",
  "secretaire",
  "secretariat",
];

const SidebarEcole = ({ cycle, titreCycle }) => {
  const utilisateurEnCache = (() => {
    try { return JSON.parse(sessionStorage.getItem("ecolapp_dashboard_user") || "null"); } catch { return null; }
  })();
  const [user, setUser] = useState(utilisateurEnCache);
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const chargerUser = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);

        if (response.data.status === 200) {
          const userApi = response.data.user;
          setUser(userApi);
          sessionStorage.setItem("ecolapp_dashboard_user", JSON.stringify(userApi));

          if (!rolesAdmin.includes(userApi.fonction?.name) && !rolesAdmin.includes(userApi.role)) {
            navigate(`/${cycle}/login`);
          }
        }
      } catch (erreur) {
        console.error("Erreur lors de la récupération des informations utilisateur :", erreur);
      }
    };

    if (!id) {
      navigate(`/${cycle}/login`);
      return;
    }

    chargerUser();
  }, [cycle, id, navigate]);

  if (!user) return <div className="spinner"></div>;

  return (
    <BarreLaterale
      accueil={`/${cycle}/bureau_admin`}
      titre="Ecolapp"
      sousTitre={titreCycle}
      menus={menusEcole(cycle)}
      user={user}
      logo={LogoEcolapp}
    />
  );
};

export default SidebarEcole;
