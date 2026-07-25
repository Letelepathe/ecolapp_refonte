import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FiBookOpen, FiCreditCard, FiMessageSquare, FiUserPlus, FiUsers } from "react-icons/fi";
import BandeauDashboard from "./BandeauDashboard";
import CarteStat from "./CarteStat";
import PanneauDroit from "./PanneauDroit";
import EcranChargement from "../EcranChargement";

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

const BureauEcole = ({ cycle, titre, SidebarLeft, NavbarTop, Footer, Infos, Admins, ListeAbonne, Statistique }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chargementUser, setChargementUser] = useState(true);
  const [chargementStats, setChargementStats] = useState(true);
  const [erreurChargement, setErreurChargement] = useState("");
  const [tentative, setTentative] = useState(0);
  const id = localStorage.getItem("userId");
  const [counts, setCounts] = useState({
    nombre_utilisateurs: 0,
    nombre_enseignants: 0,
    nombre_eleves: 0,
    nombre_communiques: 0,
  });

  useEffect(() => {
    const chargerUser = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);

        if (response.data.status === 200) {
          const userApi = response.data.user;
          setUser(userApi);

          if (!rolesAdmin.includes(userApi.fonction?.name) && !rolesAdmin.includes(userApi.role)) {
            navigate(`/${cycle}/profil_user`);
          }
        }
      } catch (erreur) {
        setErreurChargement("Les informations de votre compte ne répondent pas pour le moment.");
      } finally {
        setChargementUser(false);
      }
    };

    if (!id) {
      navigate(`/${cycle}/login`);
      return;
    }

    chargerUser();
  }, [cycle, id, navigate, tentative]);

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const response = await axios.get(
          `https://api.ecolapp.cd/api/user/countAdmin/ecole/${ecoleId}/direction/${direction}`
        );
        setCounts(response.data);
      } catch (erreur) {
        setErreurChargement("Les données du tableau de bord n’ont pas pu être chargées.");
      } finally {
        setChargementStats(false);
      }
    };

    chargerStats();
  }, [ecoleId, direction, tentative]);

  if (chargementUser || chargementStats) return <EcranChargement />;
  if (erreurChargement || !user) return <EcranChargement erreur={erreurChargement || "Votre session utilisateur est introuvable."} onReessayer={() => { setErreurChargement(""); setChargementUser(true); setChargementStats(true); setTentative((valeur) => valeur + 1); }} />;

  return (
    <div className="refonte-shell">
      <Helmet>
        <title>{titre} | Admin</title>
      </Helmet>
      <div className="container-fluid position-relative d-flex p-0 refonte-shell">
        <SidebarLeft />
        <div className="content refonte-content">
          <NavbarTop />
          <main className="dashboard-page">
            <BandeauDashboard
              surtitre={`Ecolapp · Cycle ${titre}`}
              titre={`Administration ${titre}`}
              description="Pilotez les utilisateurs, les inscriptions, les paiements et les activités de votre école depuis un espace unique."
              badge={`Cycle ${titre}`}
            />
            <div className="dashboard-hero">
              <div>
                <h1>Administration {titre}</h1>
                <p>Bienvenue, voici ce qui se passe aujourd’hui dans votre école.</p>
              </div>
              <span className="dashboard-pill">Cycle {titre}</span>
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
                  <CarteStat titre="Utilisateurs" valeur={counts.nombre_utilisateurs} lien={`/${cycle}/membres_inscrits`} icone={FiUsers} />
                  <CarteStat titre="Enseignants" valeur={counts.nombre_enseignants} lien={`/${cycle}/liste_enseignant`} icone={FiUserPlus} ton="bleu" />
                  <CarteStat titre="Élèves" valeur={counts.nombre_eleves} lien={`/${cycle}/liste_eleve`} icone={FiBookOpen} ton="jaune" />
                  <CarteStat titre="Communiqués" valeur={counts.nombre_communiques} lien={`/${cycle}/liste_communique`} icone={FiMessageSquare} ton="rouge" />
                  <CarteStat titre="Cartes personnel" valeur="QR" lien={`/${cycle}/cartes_personnel`} icone={FiCreditCard} ton="bleu" detail="Aperçu et impression" />
                </div>

                <section className="dashboard-card">
                  <Statistique />
                </section>

                <Infos />

                <div className="row">
                  <div className="col-lg-6 col-12">
                    <section className="dashboard-card">
                      <Admins />
                    </section>
                  </div>
                  <div className="col-lg-6 col-12">
                    <section className="dashboard-card">
                      <ListeAbonne />
                    </section>
                  </div>
                </div>
              </div>

              <PanneauDroit
                actions={[
                  { titre: "Ajouter des élèves", detail: "Inscription rapide et cartes" },
                  { titre: "Suivre la présence", detail: "Classes, horaires et cotes" },
                  { titre: "Encaisser les frais", detail: "Paiements et reçus" },
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

export default BureauEcole;
