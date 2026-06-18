import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

import ImageEvent from '../../../../../static/images/event.png';
import ImageFind from '../../../../../static/images/find-friends.png';

const SidebarLeft = () => {

    const [openMenus, setOpenMenus] = useState({});
    const toggleMenu = (menu) => {
        setOpenMenus((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    const [user, setUser] = useState(null);
    const [eleveInfo, setEleveInfo] = useState(null);
    const [infoClasseUser, setInfoClasseUser] = useState([]);
    const [isLoadingEleveInfo, setIsLoadingEleveInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const id = localStorage.getItem("userId");

    const ROLES_ADMIN = [
        "Administrateur", "Administratrice",
        "Super Administrateur", "Super Administratrice"
    ];

    const ROLES_TEACHER = [
        ...ROLES_ADMIN,
        "Enseignant", "Enseignante"
    ];

    useEffect(() => {
        if (!id) {
            setError("Aucun ID utilisateur trouvé.");
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const userResponse = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);
                const userData = userResponse.data.user;
                setUser(userData);

                const fonctionName = userData?.fonction?.name || null;

                if (fonctionName === "Elève") {
                    setIsLoadingEleveInfo(true);
                    try {
                        const eleveResponse = await axios.get(`https://api.ecolapp.cd/api/user/eleve/${id}`);
                        setEleveInfo(eleveResponse.data.eleve_info);
                    } catch {
                        setError("");
                    } finally {
                        setIsLoadingEleveInfo(false);
                    }
                }

                if (ROLES_TEACHER.includes(fonctionName)) {
                    try {
                        const classeResponse = await axios.get(`https://api.ecolapp.cd/api/titulaire/classe/${id}`);
                        setInfoClasseUser(classeResponse.data?.classe || []);
                    } catch {
                        setError("Impossible de récupérer les informations des classes.");
                    }
                }

            } catch {
                setError("");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

    }, [id]);


    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!user) return <div className="spinner"></div>;


    return (
        <div className="sidebar pe-0 pb-0">
            <nav className="navbar navbar-white" style={{ background: '#1769ff', color: '#fff' }}>

                <Link to="#" className="navbar-brand mx-4 mb-3">
                    <h3 style={{ fontWeight: 900, color: '#fff' }}>
                        <i className="bi bi-mortarboard-fill me-2"></i>ecolapp
                    </h3>
                </Link>

                <div className="d-flex align-items-center ms-4 mb-4 w-100">
                    <div className="position-relative">
                        <Link to={`/secondaire/mon_profil/${user.id}`}>
                            <img
                                src={`https://api.ecolapp.cd/public/imgUser/${user.file}`}
                                alt="Profil"
                                className="rounded-circle me-lg-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                        </Link>
                    </div>
                    <div className="ms-3">
                        <h6 className="mb-0 text-white">
                            {user.first_name} {user.name}
                        </h6>
                    </div>
                </div>

                {isLoading ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        <div className="navbar-nav w-100">

                            <Link to="/secondaire/profil_user" className="nav-item nav-link active text-white">
                                <img src={ImageFind} style={{ height: '30px', width: '30px', marginRight: '10px' }} alt="Mon compte" />
                                Mon compte
                            </Link>

                            {/* ADMIN AREA */}
                            {(ROLES_ADMIN.includes(user?.fonction?.name) || ROLES_ADMIN.includes(user?.role)) && (
                                <Link to="/secondaire/bureau_admin" className="nav-item nav-link text-white">
                                    <img src={ImageEvent}
                                        style={{ height: '30px', width: '30px', marginRight: '10px' }}
                                        alt="Bureau Admin"
                                    />
                                    Bureau Admin
                                </Link>
                            )}

                            {/* TITULAIRE CLASSE */}
                            {infoClasseUser?.length > 0 && (
                                <div className="menu">
                                    <div className="menu-header" onClick={() => toggleMenu('menu1')}>
                                        <i className="bi bi-journal-text text-white me-2"></i>Titularisation classe
                                        <span className={`arrow ${openMenus['menu1'] ? 'open' : ''}`}>▼</span>
                                    </div>

                                    <div className={`dropdown-content ${openMenus['menu1'] ? 'open' : ''}`}>
                                        {infoClasseUser?.map(classe => (
                                            <Link
                                                to={`/secondaire/ma_classe/${classe?.classe?.id}/${classe?.option?.id}`}
                                                className="dropdown-item"
                                                key={classe?.id}
                                            >
                                                <i className="bi bi-table"></i>
                                                {classe?.classe?.name} {classe?.option?.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* MENUS ENSEIGNANTS & ADMIN */}
                            {ROLES_TEACHER.includes(user?.fonction?.name) && (
                                <>
                                    {/* Cours */}
                                    <div className="menu">
                                        <div className="menu-header" onClick={() => toggleMenu('menu2')}>
                                            <i className="bi bi-journal-text me-2 text-white"></i>Cours
                                            <span className={`arrow ${openMenus['menu2'] ? 'open' : ''}`}>▼</span>
                                        </div>
                                        <div className={`dropdown-content ${openMenus['menu2'] ? 'open' : ''}`}>
                                            <Link to="/secondaire/ajouter_cours_by_enseignant" className="dropdown-item">
                                                <i className="bi bi-plus-circle me-2"></i>Ajouter cours
                                            </Link>
                                            <Link to="/secondaire/liste_cours_by_enseignant" className="dropdown-item">
                                                <i className="bi bi-folder me-2"></i>Mes cours fichiers
                                            </Link>
                                            <Link to="/secondaire/liste_cours_titulaire_by_enseignant" className="dropdown-item">
                                                <i className="bi bi-folder me-2"></i>Mes cours titulaires
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Cotes */}
                                    <div className="menu">
                                        <div className="menu-header" onClick={() => toggleMenu('menu3')}>
                                            <i className="bi bi-pencil-square me-2"></i>Cotes élèves
                                            <span className={`arrow ${openMenus['menu3'] ? 'open' : ''}`}>▼</span>
                                        </div>
                                        <div className={`dropdown-content ${openMenus['menu3'] ? 'open' : ''}`}>
                                            <Link to="/secondaire/select_classe_by_enseignant" className="dropdown-item">
                                                <i className="bi bi-upload me-2"></i>Déposer cote
                                            </Link>
                                            <Link to="/secondaire/select_classe_consulte_cote_by_enseignant" className="dropdown-item">
                                                <i className="bi bi-journal-check me-2"></i>Mes cotes
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TRAVAUX */}
                            <div className="menu">
                                <div className="menu-header" onClick={() => toggleMenu('menu4')}>
                                    <i className="bi bi-card-checklist me-2"></i>Travail
                                    <span className={`arrow ${openMenus['menu4'] ? 'open' : ''}`}>▼</span>
                                </div>

                                <div className={`dropdown-content ${openMenus['menu4'] ? 'open' : ''}`}>


                                    {ROLES_TEACHER.includes(user?.fonction?.name) && (
                                        <Link to="/secondaire/ajouter_travail_by_enseignant" className="dropdown-item">
                                            <i className="bi bi-plus-circle me-2"></i>Ajouter travail
                                        </Link>
                                    )}

                                    {(user?.fonction?.name === "Elève" || user?.role === "Elève") && (
                                        <Link to="/secondaire/liste_travail_by_eleve" className="dropdown-item">
                                            <i className="bi bi-folder me-2"></i>Mes travaux
                                        </Link>
                                    )}

                                    {ROLES_TEACHER.includes(user?.fonction?.name) && (
                                        <Link to="/secondaire/liste_travail_by_enseignant" className="dropdown-item">
                                            <i className="bi bi-folder me-2"></i>Mes travaux
                                        </Link>
                                    )}

                                </div>
                            </div>

                            {/* Activités Elèves */}
                            {(user?.fonction?.name === "Elève" || user?.role === "Elève") && (
                                <div className="menu">
                                    <div className="menu-header" onClick={() => toggleMenu('menu5')}>
                                        <i className="bi bi-card-checklist me-2"></i>Mes activités
                                        <span className={`arrow ${openMenus['menu5'] ? 'open' : ''}`}>▼</span>
                                    </div>

                                    <div className={`dropdown-content ${openMenus['menu5'] ? 'open' : ''}`}>
                                        <Link to="/secondaire/liste_travail_by_eleve" className="dropdown-item">
                                            <i className="bi bi-folder me-2"></i>Mes travaux
                                        </Link>

                                        {!isLoadingEleveInfo && eleveInfo && (
                                            <>
                                                <Link to={`/secondaire/ma_classe/${eleveInfo?.classes_id}/${eleveInfo?.options_id}`} className="dropdown-item">
                                                    <i className="bi bi-folder me-2"></i>Ma classe
                                                </Link>

                                                <Link to={`/secondaire/panel_eleve/${eleveInfo?.id}/${eleveInfo?.ecole_id}/${eleveInfo?.direction}`} className="dropdown-item">
                                                    <i className="bi bi-folder me-2"></i>Mon parcours scolaire
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Link to="/jeux/quiz" className="nav-item nav-link text-white">
                                <i className="bi bi-controller text-warning me-2"></i>Jeux quiz
                            </Link>

                            <Link to="/secondaire/deconnexion" className="nav-item nav-link text-white">
                                <i className="bi bi-box-arrow-right bg-warning text-white me-2"></i>Déconnexion
                            </Link>

                        </div>
                    </>
                )}

            </nav>
        </div>
    );
};

export default SidebarLeft;
