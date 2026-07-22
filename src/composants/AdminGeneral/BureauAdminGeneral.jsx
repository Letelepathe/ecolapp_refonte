import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FiHome, FiLayers, FiMap, FiShield } from "react-icons/fi";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import Statistique from "./Statistique";
import BandeauDashboard from "../common/TableauDeBord/BandeauDashboard";
import CarteStat from "../common/TableauDeBord/CarteStat";
import PanneauDroit from "../common/TableauDeBord/PanneauDroit";

const rolesAdmin = [
  "Administrateur",
  "Administratrice",
  "Super Administrateur",
  "Super Administratrice",
];

const BureauAdminGeneral = () => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("userId");
  const [counts, setCounts] = useState({
    nombre_admins_generaux: 0,
    nombre_provinces: 0,
    nombre_provinces_educationnelles: 0,
    nombre_ecoles: 0,
  });

  useEffect(() => {
    const chargerUser = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);

        if (response.data.status === 200) {
          const userApi = response.data.user;
          setUser(userApi);

          if (!rolesAdmin.includes(userApi.fonction?.name) && !rolesAdmin.includes(userApi.role)) {
            navigate("/admin-general/profil_admin");
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

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const response = await axios.get(
          `https://api.ecolapp.cd/api/user/countAdminGeneral/ecole/${ecoleId}/direction/${direction}`
        );
        setCounts(response.data);
      } catch (erreur) {
        console.error("Erreur lors de la récupération des données :", erreur);
      }
    };

    chargerStats();
  }, [ecoleId, direction]);

  if (!user) return <div className="spinner"></div>;

  return (
    <div className="refonte-shell">
      <Helmet>
        <title>Administration générale</title>
      </Helmet>
      <div className="container-fluid position-relative d-flex p-0 refonte-shell">
        <SidebarLeft />
        <div className="content refonte-content">
          <NavbarTop />
          <main className="dashboard-page">
            <BandeauDashboard
              surtitre="Ecolapp · Administration centrale"
              titre="Administration générale"
              description="Suivez l'ensemble des écoles, provinces et administrateurs depuis une vue claire et centralisée."
              badge="Vue générale"
            />
            <div className="dashboard-hero">
              <div>
                <h1>Administration générale</h1>
                <p>Bienvenue, voici le résumé global de la plateforme.</p>
              </div>
              <span className="dashboard-pill">Vue générale</span>
            </div>

            <div className="dashboard-section-heading">
              <div>
                <span>Vue d'ensemble</span>
                <h2>Indicateurs principaux</h2>
              </div>
              <span className="dashboard-live-status">Données en direct</span>
            </div>

            <div className="dashboard-main-grid">
              <div>
                <div className="dashboard-stat-grid">
                  <CarteStat titre="Admins" valeur={counts.nombre_admins_generaux} lien="/admin-general/liste_admins_generaux" icone={FiShield} />
                  <CarteStat titre="Provinces" valeur={counts.nombre_provinces} lien="/admin-general/liste_province" icone={FiMap} ton="bleu" />
                  <CarteStat titre="Prov. éducationnelles" valeur={counts.nombre_provinces_educationnelles} lien="/admin-general/liste_province_educationnelle" icone={FiLayers} ton="jaune" />
                  <CarteStat titre="Écoles" valeur={counts.nombre_ecoles} lien="/admin-general/liste_ecole" icone={FiHome} ton="rouge" />
                </div>

                <section className="dashboard-card">
                  <Statistique />
                </section>
              </div>

              <PanneauDroit
                actions={[
                  { titre: "Créer une école", detail: "Ajouter une école et son super admin" },
                  { titre: "Suivre les provinces", detail: "Organisation administrative" },
                  { titre: "Contrôler les admins", detail: "Rôles et suspensions" },
                ]}
              />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default BureauAdminGeneral;
