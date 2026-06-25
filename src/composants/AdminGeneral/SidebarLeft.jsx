import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoEcolapp from "../../static/images/logo_ecolapp.jpg";
import BarreLaterale from "../common/TableauDeBord/BarreLaterale";
import { menusAdminGeneral } from "../common/TableauDeBord/menusTableauBord";

const rolesAdmin = [
  "Administrateur",
  "Administratrice",
  "Super Administrateur",
  "Super Administratrice",
];

const SidebarLeft = () => {
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const chargerUser = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);

        if (response.data.status === 200) {
          const userApi = response.data.user;
          setUser(userApi);

          if (!rolesAdmin.includes(userApi.fonction?.name) && !rolesAdmin.includes(userApi.role)) {
            navigate("/admin-general/login");
          }
        }
      } catch (erreur) {
        console.error("Erreur lors de la récupération des informations utilisateur :", erreur);
      }
    };

    if (!id) {
      navigate("/admin-general/login");
      return;
    }

    chargerUser();
  }, [id, navigate]);

  if (!user) return <div className="spinner"></div>;

  const peutGererAdmins = rolesAdmin.includes(user.fonction?.name) || rolesAdmin.includes(user.role);

  return (
    <BarreLaterale
      accueil="/admin-general/bureau_admin"
      titre="Ecolapp"
      sousTitre="Admin Général"
      menus={menusAdminGeneral(peutGererAdmins)}
      user={user}
      logo={LogoEcolapp}
    />
  );
};

export default SidebarLeft;
