import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Logo_ecolapp from "../../../../static/images/logo_ecolapp.jpg";

const SidebarLeft = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();
  const menuRefs = useRef({}); // pour animer la hauteur dynamique

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);
        if (response.data.status === 200) {
          setUser(response.data.user);
          const allowed = [
            "Administrateur",
            "Administratrice",
            "Super Administrateur",
            "Super Administratrice",
          ];
          if (
            !allowed.includes(response.data.user.fonction?.name) &&
            !allowed.includes(response.data.user.role)
          ) {
            navigate("/admin-general/login");
          }
        } else console.error("Statut inattendu :", response.data.status);
      } catch (err) {
        console.error("Erreur lors de la récupération des informations utilisateur :", err);
      }
    };

    const checkSession = () => {
      if (!localStorage.getItem("userId")) navigate("/adminGeneral/login");
    };

    fetchUserInfo();
    checkSession();
  }, [id, navigate]);

  if (!user) return <div className="spinner"></div>;

  return (
    <div>
      <div className="sidebar pe-0 pb-0">
        <nav className="navbar navbar-white" style={{ background: "#1769ff" }}>
          <Link to="#" className="navbar-brand mx-4 mb-3">
            <h3 style={{ fontWeight: 900, color: "#fff" }}>
              <i className="bi bi-mortarboard-fill me-2"></i>ecolapp
            </h3>
          </Link>

          {/* Profil */}
          <div className="d-flex align-items-center ms-4 mb-4 w-100">
            <div className="position-relative">
              <Link to="/admin-general/bureau_admin">
                <img
                  src={Logo_ecolapp}
                  alt="Profil"
                  className="rounded-circle me-lg-2"
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
              </Link>
            </div>
            <Link to="/admin-general/bureau_admin">
              <div className="ms-3">
                <h6 className="mb-0 text-white">Administration</h6>
              </div>
            </Link>
          </div>

          <div className="navbar-nav w-100">

            {/* --- MENU 1 : Gestion Admin --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu1")}>
                <i className="bi bi-wallet-fill me-2"></i>Gestion Admin
                <span className={`arrow ${openMenus["menu1"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu1"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu1"]
                    ? `${menuRefs.current["menu1"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/creer_admin" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Créer admin
                </Link>
                <Link to="/primaire/creer_super_admin" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Créer super admin
                </Link>
                <Link to="/primaire/suspendre_admin" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Suspendre admin
                </Link>
              </div>
            </div>

            {/* --- MENU 2 : Cycle scolaire --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu2")}>
                <i className="bi bi-wallet-fill me-2"></i>Cycle scolaire
                <span className={`arrow ${openMenus["menu2"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu2"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu2"]
                    ? `${menuRefs.current["menu2"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/ajouter_annee_scolaire" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter une année
                </Link>
                <Link to="/primaire/liste_annee_scolaire" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Toutes les années
                </Link>
                <Link to="/primaire/ajouter_semestre" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter un semestre
                </Link>
                <Link to="/primaire/liste_semestre" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Tous les semestres
                </Link>
                <Link to="/primaire/ajouter_periode" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter une période
                </Link>
                <Link to="/primaire/liste_periode" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Toutes les périodes
                </Link>
              </div>
            </div>

            {/* --- MENU 3 : Communications --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu3")}>
                <i className="bi bi-megaphone-fill me-2"></i>Communications
                <span className={`arrow ${openMenus["menu3"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu3"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu3"]
                    ? `${menuRefs.current["menu3"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/liste_communique" className="dropdown-item">
                  <i className="bi bi-envelope-open me-2"></i>Listes communiqués
                </Link>
                <Link to="/primaire/lancer_communique" className="dropdown-item">
                  <i className="bi bi-send-fill me-2"></i>Lancer un communiqué
                </Link>
                <Link to="/primaire/liste_contact" className="dropdown-item">
                  <i className="bi bi-chat-left-text-fill me-2"></i>Messages
                </Link>
              </div>
            </div>

            {/* --- MENU 4 : Enseignants --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu4")}>
                <i className="bi bi-person-badge-fill me-2"></i>Enseignants
                <span className={`arrow ${openMenus["menu4"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu4"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu4"]
                    ? `${menuRefs.current["menu4"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/creationcompte" className="dropdown-item">
                  <i className="bi bi-person-plus-fill me-2"></i>Ajouter enseignant
                </Link>
                <Link to="/primaire/liste_enseignant" className="dropdown-item">
                  <i className="bi bi-people-fill me-2"></i>Tous les enseignants
                </Link>
                <Link to="/primaire/ajouter_titulaire" className="dropdown-item">
                  <i className="bi bi-person-plus-fill me-2"></i>Ajouter titulaire classe
                </Link>
                <Link to="/primaire/liste_titulaire" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Tous les titulaires
                </Link>
              </div>
            </div>

            {/* --- MENU 5 : Élèves --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu5")}>
                <i className="bi bi-person-fill me-2"></i>Élèves
                <span className={`arrow ${openMenus["menu5"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu5"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu5"]
                    ? `${menuRefs.current["menu5"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/ajouter_eleve" className="dropdown-item">
                  <i className="bi bi-person-plus-fill me-2"></i>Ajouter un élève
                </Link>
                <Link to="/primaire/liste_eleve" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Tous les élèves
                </Link>
                <Link to="/primaire/cartes_eleves" className="dropdown-item">
                  <i className="bi bi-credit-card-2-front-fill me-2"></i>Cartes élèves
                </Link>
                <Link to="/primaire/liste_eleve_inscrit_primaire" className="dropdown-item">
                  <i className="bi bi-journal-richtext me-2"></i>Élèves inscrits
                </Link>
                <Link to="/primaire/ajouter_motif_absence" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter motif paiement
                </Link>
                <Link to="/primaire/liste_motif_absence" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Listes motifs absence 
                </Link>
                <Link to="/primaire/ajouter_type_travail" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter type travail 
                </Link>
                <Link to="/primaire/liste_type_travail" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Listes type travail
                </Link>
              </div>
            </div>

            {/* --- MENU 6 : Cours --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu6")}>
                <i className="bi bi-eject-fill me-2"></i>Cours
                <span className={`arrow ${openMenus["menu6"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu6"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu6"]
                    ? `${menuRefs.current["menu6"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/ajouter_cours" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter un cours
                </Link>
                <Link to="/primaire/liste_cours" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Tous les cours
                </Link>
                <Link to="/primaire/liste_cours_enseigne" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Cours & titulaires
                </Link>
              </div>
            </div>

            {/* --- MENU 7 : Paiement --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu7")}>
                <i className="bi bi-wallet-fill me-2"></i>Paiement
                <span className={`arrow ${openMenus["menu7"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu7"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu7"]
                    ? `${menuRefs.current["menu7"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/ajouter_motif" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter motif paiement
                </Link>
                <Link to="/primaire/liste_motif" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Listes motif
                </Link>
                <Link to="/primaire/ajouter_tranche" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter tranche 
                </Link>
                <Link to="/primaire/liste_tranche" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Listes tranche
                </Link>
                <Link to="/primaire/ajouter_mode_paiement" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter un mode
                </Link>
                <Link to="/primaire/liste_mode_paiement" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Tous les modes
                </Link>
                <Link to="/primaire/ajouter_devise" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter une dévise
                </Link>
                <Link to="/primaire/liste_devise" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Listes dévise
                </Link>
                <Link to="/primaire/ajouter_paiement" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter un paiement
                </Link>
                <Link to="/primaire/liste_paiement" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Tous les paiements
                </Link>
                
              </div>
            </div>

            {/* --- MENU 8 : Structure scolaire --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu8")}>
                <i className="bi bi-check2-square me-2"></i>Structure scolaire
                <span className={`arrow ${openMenus["menu8"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu8"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu8"]
                    ? `${menuRefs.current["menu8"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/ajouter_classe" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter une Classe
                </Link>
                <Link to="/primaire/liste_classe" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Toutes les classes
                </Link>
                <Link to="/primaire/ajouter_section" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter une section
                </Link>
                <Link to="/primaire/liste_section" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Toutes les sections
                </Link>
                <Link to="/primaire/ajouter_option" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter une option
                </Link>
                <Link to="/primaire/liste_options" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Toutes les options
                </Link>
              </div>
            </div>

            {/* --- MENU 9 : Utilisateurs --- */}
            <div className="menu">
              <div className="menu-header" onClick={() => toggleMenu("menu9")}>
                <i className="bi bi-people-fill me-2"></i>Utilisateurs
                <span className={`arrow ${openMenus["menu9"] ? "open" : ""}`}>▼</span>
              </div>
              <div
                ref={(el) => (menuRefs.current["menu9"] = el)}
                className="dropdown-content"
                style={{
                  maxHeight: openMenus["menu9"]
                    ? `${menuRefs.current["menu9"]?.scrollHeight}px`
                    : "0px",
                }}
              >
                <Link to="/primaire/ajouter_fonction" className="dropdown-item">
                  <i className="bi bi-plus-circle-fill me-2"></i>Ajouter une fonction
                </Link>
                <Link to="/primaire/liste_fonction" className="dropdown-item">
                  <i className="bi bi-list-check me-2"></i>Toutes les fonctions
                </Link>
                <Link to="/primaire/creationcompte" className="dropdown-item">
                  <i className="bi bi-plus me-2"></i>Créer utilisateur
                </Link>
                <Link to="/primaire/membres_inscrits" className="dropdown-item">
                  <i className="bi bi-people-fill me-2"></i>Liste utilisateurs
                </Link>
              </div>
            </div>

          </div>
        </nav>
      </div>
    </div>
  );
};

export default SidebarLeft;
