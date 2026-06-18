import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';


import Logo_ecolapp from "../../../../static/images/logo_ecolapp.jpg";


const SidebarLeft = () => {

      const [openMenus, setOpenMenus] = useState({});
            
              const toggleMenu = (menu) => {
                setOpenMenus((prevState) => ({
                  ...prevState,
                  [menu]: !prevState[menu],
                }));
              };
            
              
    const [user, setUser] = useState(null);
    const id = localStorage.getItem("userId");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);
                if (response.data.status === 200) {
                    setUser(response.data.user);
    
                    // Vérifie la fonction et le rôle après la mise à jour de l'état
                    const allowedFunctions = [
                        "Administrateur",
                        "Administratrice",
                        "Super Administrateur",
                        "Super Administratrice"
                    ];
    
                    if (
                        !allowedFunctions.includes(response.data.user.fonction?.name) &&
                        !allowedFunctions.includes(response.data.user.role)
                    ) {
                        navigate('/secondaire/profil_user');
                    }
                } else {
                    console.error("Statut inattendu :", response.data.status);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
            }
        };

        const checkSession = () => {
            const id = localStorage.getItem("userId");
            if (!id) {
                navigate('/secondaire/login');
            }
      };
    
        fetchUserInfo();
        checkSession();
    }, [id, navigate]); 

    if (!user) return <div className="spinner"></div>;
    
    return (
        <div>
            <div className="sidebar pe-0 pb-0">
                <nav className="navbar navbar-white" style={{background: '#1769ff'}}>
                    <Link to="#" className="navbar-brand mx-4 mb-3">
                        <h3 className="" style={{ fontWeight: 900, color: '#fff' }}>
                            <i className="bi bi-mortarboard-fill me-2"></i>ecolapp
                        </h3>
                    </Link>
                    <div className="d-flex align-items-center ms-4 mb-4 w-100">
                        <div className="position-relative">
                            <Link to='/secondaire/bureau_admin'>
                                <img 
                                    src={Logo_ecolapp} 
                                    alt="Profil" 
                                    className="rounded-circle me-lg-2" 
                                    style={{ width: '40px', height: '40px' }} 
                                />
                                <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                            </Link>
                        </div>
                        <Link to='/secondaire/bureau_admin'>
                            <div className="ms-3">
                                <h6 className="mb-0 text-white">Administration</h6>
                                <span id="status"></span>
                            </div>
                        </Link> 
                    </div>
                    <div className="navbar-nav w-100">
                        {user && (["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) || ["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.role)) && (
                            <Dropdown className="nav-item dropdown mb-2 mt-2">
                                <Dropdown.Toggle className="nav-link"
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 900,
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'inline-block',
                                        color:'#fff'
                                    }}
                                    >
                                    <i className="bi bi-wallet-fill text-primary me-2 icon-blue"></i>Gestion Admin
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Link to="/secondaire/creer_admin" className="dropdown-item">
                                        <i className="bi bi-list-check me-2 icon-blue"></i>Créer admin
                                    </Link>
                                    <Link to="/secondaire/creer_super_admin" className="dropdown-item">
                                        <i className="bi bi-list-check me-2 icon-blue"></i>Créer super admin
                                    </Link>
                                    <Link to="/secondaire/suspendre_admin" className="dropdown-item">
                                        <i className="bi bi-list-check me-2 icon-blue"></i>Suspendre admin
                                    </Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                     
                        {/* Années scolaires */}
                        <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-wallet-fill me-2 text-primary icon-blue"></i>Cycle scolaire
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="text-white">
                                <Link to="/secondaire/ajouter_annee_scolaire" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter une année
                                </Link>
                                <Link to="/secondaire/liste_annee_scolaire" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Toutes les années
                                </Link>
                                <Link to="/secondaire/ajouter_semestre" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter un semestre
                                </Link>
                                <Link to="/secondaire/liste_semestre" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les semestres
                                </Link>
                                <Link to="/secondaire/ajouter_periode" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter une Période
                                </Link>
                                <Link to="/secondaire/liste_periode" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Toutes les périodes
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>


                        {/* Gestion Communiqués */}
                        <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-megaphone-fill text-primary me-2 icon-blue"></i>Communications
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link to="/secondaire/liste_communique" className="dropdown-item">
                                    <i className="bi bi-envelope-open me-2 icon-blue"></i>Listes communiqués
                                </Link>
                                <Link to="/secondaire/lancer_communique" className="dropdown-item">
                                    <i className="bi bi-send-fill me-2 icon-blue"></i>Lancer un communiqué
                                </Link>
                                <Link to="/secondaire/liste_contact" className="dropdown-item">
                                    <i className="bi bi-chat-left-dots-fill me-2 icon-blue"></i>Messages
                                </Link>
                                <Link to="/secondaire/liste_contact" className="dropdown-item">
                                    <i className="bi bi-chat-left-quote-fill me-2 icon-blue"></i>Messages parents
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Enseignangts */}
                        <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-person-badge-fill text-primary me-2 icon-blue"></i>Enseignants
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link to="/secondaire/creationcompte" className="dropdown-item">
                                    <i className="bi bi-person-plus-fill me-2 icon-blue"></i>Ajouter enseignant
                                </Link>
                                <Link to="/secondaire/liste_enseignant" className="dropdown-item">
                                    <i className="bi bi-people-fill me-2 icon-blue"></i>Tous les enseignants
                                </Link>
                                <Link to="/secondaire/ajouter_titulaire" className="dropdown-item">
                                    <i className="bi bi-person-plus-fill me-2 icon-blue"></i>Ajouter titulaire classe
                                </Link>
                                <Link to="/secondaire/liste_titulaire" className="dropdown-item">
                                    <i className="bi bi-people-fill me-2 icon-blue"></i>Tous les titulaires
                                </Link>
                                <Link to="/secondaire/ajouter_cours_enseigne" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter titulaire cours
                                </Link>
                                <Link to="/secondaire/liste_cours_enseigne" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Liste cours et titulaires
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                      
                       

                        {/* Elèves */}
                        <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-person-fill text-primary me-2 icon-blue"></i>Elèves
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link to="/secondaire/ajouter_eleve" className="dropdown-item">
                                    <i className="bi bi-person-plus-fill me-2 icon-blue"></i>Ajouter un élève
                                </Link>
                                <Link to="/secondaire/liste_eleve" className="dropdown-item">
                                    <i className="bi bi-person-lines-fill me-2 icon-blue"></i>Tous les élèves
                                </Link>
                                <Link to="/secondaire/liste_eleve_inscrit_secondaire" className="dropdown-item">
                                    <i className="bi bi-journal-richtext me-2 icon-blue"></i>Elèves inscrits
                                </Link>
                                <Link to="/secondaire/inscription_en_attente" className="dropdown-item">
                                    <i className="bi bi-journal-richtext me-2 icon-blue"></i>Inscriptions en attente
                                </Link>
                                <Link to="/secondaire/ajouter_motif_absence" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter motif 
                                </Link>
                                <Link to="/secondaire/liste_motif_absence" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les motifs
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                         {/* Cours */}
                         <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-eject-fill me-2 text-primary icon-blue"></i>Cours
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link to="/secondaire/ajouter_cours" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter un cours
                                </Link>
                                <Link to="/secondaire/liste_cours" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les cours
                                </Link>
                              
                                <Link to="/secondaire/ajouter_horaire" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter horaire
                                </Link>
                                <Link to="/secondaire/liste_horaire" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les horaires
                                </Link>
                                <Link to="/secondaire/ajouter_type_travail" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter un Type de Travail
                                </Link>
                                <Link to="/secondaire/liste_type_travail" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les types de travail
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                       
                      
                        
                       
                       
                        {/* Paiement */}
                        <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-wallet-fill text-primary me-2 icon-blue"></i>Paiement
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link to="/secondaire/ajouter_paiement" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter un Paiement
                                </Link>
                                <Link to="/secondaire/liste_paiement" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les paiements
                                </Link>
                                <Link to="/secondaire/ajouter_tranche" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter tranche
                                </Link>
                                <Link to="/secondaire/liste_tranche" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Les tranches
                                </Link>
                                <Link to="/secondaire/ajouter_mode_paiement" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter un mode
                                </Link>
                                <Link to="/secondaire/liste_mode_paiement" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les modes
                                </Link>
                                <Link to="/secondaire/ajouter_motif" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter un motif
                                </Link>
                                <Link to="/secondaire/liste_motif" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Tous les motifs
                                </Link>
                                <Link to="/secondaire/ajouter_devise" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter une Devise
                                </Link>
                                <Link to="/secondaire/liste_devise" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Toutes les devises
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>

                       
                        <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-check2-square me-2 text-primary icon-blue"></i>Structure scolaire
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                               <Link to="/secondaire/ajouter_classe" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter une Classe
                                </Link>
                                <Link to="/secondaire/liste_classe" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Toutes les classes
                                </Link>
                               <Link to="/secondaire/ajouter_section" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter une section
                                </Link>
                                <Link to="/secondaire/liste_section" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Toutes les sections
                                </Link>
                                <Link to="/secondaire/ajouter_option" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter une Option
                                </Link>
                                <Link to="/secondaire/liste_options" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Toutes les options
                                </Link>
                            </Dropdown.Menu>
                        </Dropdown>
                        

                      

                        {/* Gestion des Membres */}
                        <Dropdown className="nav-item dropdown mb-2 mt-2">
                            <Dropdown.Toggle className="nav-link"
                                 style={{
                                    fontSize: '15px',
                                    fontWeight: 900,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'inline-block',
                                    color:'#fff'
                                  }}
                                >
                                <i className="bi bi-people-fill me-2 text-primary icon-blue"></i>Utilisateurs
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                
                                <Link to="/secondaire/ajouter_fonction" className="dropdown-item">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter une Fonction
                                </Link>
                                <Link to="/secondaire/liste_fonction" className="dropdown-item">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Toutes les fonctions
                                </Link>
                                <Link to="/secondaire/creationcompte" className="dropdown-item">
                                    <i className="bi bi-plus me-2 icon-blue"></i>Créer utilisateur
                                </Link>
                                <Link to="/secondaire/membres_inscrits" className="dropdown-item">
                                    <i className="bi bi-people-fill me-2 icon-blue"></i> Liste utilisateurs
                                </Link>
                                
                                
                            </Dropdown.Menu>
                        </Dropdown>

                       

                        
                    </div>
                   
                </nav>
            </div>
        </div>
   
);
}; 


export default SidebarLeft;
