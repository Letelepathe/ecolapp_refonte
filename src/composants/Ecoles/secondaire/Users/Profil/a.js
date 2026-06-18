import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import ImageEvent from './img/event.png';
import ImageFind from './img/find-friends.png';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const SidebarLeft = () => {
  const [user, setUser] = useState(null);
  const [infoClasseUser, setInfoClasseUser] = useState([]);
  const [eleveInfo, setEleveInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const errorList = [];

      try {
        const userResponse = await axios.get(`http://localhost:8000/api/user/${id}`);
        if (userResponse.status === 200) {
          const userData = userResponse.data.user;
          setUser(userData);

          // Fetch data specific to "Elève" if necessary
          if (userData.fonction.name === 'Elève') {
            try {
              const eleveResponse = await axios.get(`http://localhost:8000/api/user/eleve/${id}`);
              if (eleveResponse.status === 200) {
                setEleveInfo(eleveResponse.data.eleve_info);
              } else {
                errorList.push("Erreur: " + eleveResponse.data.message);
              }
            } catch (err) {
              errorList.push("Erreur lors de la récupération des informations de l'élève.");
            }
          }

          // Fetch classe data if applicable
          try {
            const classeResponse = await axios.get(`http://localhost:8000/api/titulaire/classe/${id}`);
            setInfoClasseUser(classeResponse.data?.classe || []);
          } catch (err) {
            errorList.push("Erreur lors de la récupération des informations de la classe.");
          }
        } else {
          errorList.push("Erreur: " + userResponse.data.message);
        }
      } catch (err) {
        errorList.push("Erreur lors de la récupération des informations utilisateur.");
      } finally {
        setErrors(errorList);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (errors.length > 0) {
    return (
      <div>
                {errors.map((error, index) =>
        <div key={index} className="u-style-1ba580b2">
                        {error}
                    </div>
        )}
            </div>);

  }

  return user ?
  <div>
            <div className="sidebar pe-0 pb-0">
                <nav className="navbar navbar-white u-style-92f685a5">
                    <Link to="#" className="navbar-brand mx-4 mb-3">
                        <h3 className="u-style-b3e00e00">
                            <i className="bi bi-mortarboard-fill me-2"></i>EcolApp
                        </h3>
                    </Link>
                    <div className="d-flex align-items-center ms-4 mb-4 w-100">
                        <div className="position-relative">
                            <Link to={`/secondaire/mon_profil/${user.id}`}>
                                <img
                src={`http://localhost:8000/imgUser/${user.file}`}
                alt="Profil"
                className="rounded-circle me-lg-2 u-style-582d54f9" />

              
                                <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                            </Link>
                        </div>
                        <div className="ms-3">
                            <h6 className="mb-0 text-white">{user.first_name} {user.name}</h6>
                            <span id="status"></span>
                        </div>
                    </div>
                    <div className="navbar-nav w-100">
                        <Link to="/secondaire/profil_user" className="nav-item nav-link active text-white">
                            <img src={ImageFind} alt="Mon compte" className="u-style-cd6e2805" /> Mon compte
                        </Link>
                        {user && ["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) &&
          <Link to="/secondaire/bureau_admin" className="nav-item nav-link text-white">
                                <img src={ImageEvent} alt="Bureau Admin" className="u-style-cd6e2805" /> Bureau Admin
                            </Link>
          }
                        {infoClasseUser.length > 0 &&
          <div className="nav-item container">
                                <Link to="#" className="text-white u-style-ffc037cc">
                                    <i className="bi bi-journal-text me-2"></i>Titularisation classe
                                </Link>
                                {infoClasseUser.map((classe) =>
            <Link
              to={`/secondaire/ma_classe/${classe.classe.id}/${classe.option.id}`}
              className="nav-item nav-link text-white"
              key={classe.id}>
              
                                        <i className='bi bi-table text-primary'></i> {classe.classe.name} {classe.option.name}
                                    </Link>
            )}
                            </div>
          }
                        {["Enseignant", "Enseignante", "Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) &&
          <>
                                                    <div className="nav-item container">
                                                        <Link to="#" className="text-white u-style-ffc037cc">
                                                            <i className="bi bi-journal-text me-2"></i>Cours
                                                        </Link>
                                                        <div className="">
                                                            <Link to="/secondaire/ajouter_cours_by_enseignant" className="dropdown-item text-white">
                                                                <i className="bi bi-plus-circle me-2"></i>Ajouter cours
                                                            </Link>
                                                            
                                                            <Link to="/secondaire/liste_cours_by_enseignant" className="dropdown-item text-white">
                                                                <i className="bi bi-folder me-2"></i>Mes cours
                                                            </Link>
                                                        </div>
                                                    </div>
                                              
                                                    <div className="nav-item container">
                                                        <Link to="#" className="text-white u-style-ffc037cc">
                                                            <i className="bi bi-pencil-square me-2"></i>Cotes élèves
                                                        </Link>
                                                        <div className="">
                                                            <Link to="/secondaire/select_classe_by_enseignant" className="dropdown-item text-white">
                                                                <i className="bi bi-upload me-2"></i>Déposer cote
                                                            </Link>
                                                            <Link to="/secondaire/select_classe_consulte_cote_by_enseignant" className="dropdown-item text-white">
                                                                <i className="bi bi-journal-check me-2"></i>Mes cotes
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    </>
          }  
                        <div className="nav-item container">
                                                    <Link to="#" className="text-white u-style-ffc037cc">
                                                        <i className="bi bi-card-checklist me-2"></i>Travail
                                                    </Link>
                                                    <div className="">
                                                    {user && ["Enseignant", "Enseignante", "Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) &&
              <Link to="/secondaire/ajouter_travail_by_enseignant" className="dropdown-item text-white">
                                                            <i className="bi bi-plus-circle me-2"></i>Ajouter travail
                                                        </Link>
              }
                                                    {user && ["Elève"].includes(user.fonction.name) &&
              <div>
                                                            <Link to="/secondaire/liste_travail_by_eleve" className="dropdown-item text-white">
                                                             <i className="bi bi-folder me-2"></i>Mes travaux
                                                            </Link>
                                                            
                                                            {user.fonction.name === 'Elève' && !isLoadingEleveInfo && eleveInfo &&
                <div>
                                                                    <Link to={`/secondaire/panel_eleve/${eleveInfo.classes_id}/${eleveInfo.options_id}`} target="_blank" rel="noopener noreferrer" className="dropdown-item text-white">
                                                                        <i className="bi bi-folder me-2"></i>Ma classe
                                                                    </Link>
                                                                    <Link to={`/secondaire/panel_eleve/${eleveInfo.id}`} target="_blank" rel="noopener noreferrer" className="dropdown-item text-white">
                                                                        <i className="bi bi-folder me-2"></i>Mon parcours scolaire
                                                                    </Link>
                                                                </div>
                }
                        
                                                        </div>
              }
                                                        
                                                    {user && ["Enseignant", "Enseignante", "Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) &&
              <Link to="/secondaire/liste_travail_by_enseignant" className="dropdown-item text-white">
                                                            <i className="bi bi-folder me-2"></i>Mes travaux
                                                        </Link>
              }
                                                    </div>
                        </div>
                                                
                        {user.fonction.name === 'Elève' && eleveInfo &&
          <div className="nav-item container">
                                <Link to="#" className="text-white u-style-ffc037cc">
                                    <i className="bi bi-card-checklist me-2"></i>Ma Classe
                                </Link>
                                <Link to={`/secondaire/ma_classe/${eleveInfo.classes_id}/${eleveInfo.options_id}`} className="dropdown-item text-white">
                                    <i className="bi bi-folder me-2"></i>Ma classe
                                </Link>
                                <Link to={`/secondaire/panel_eleve/${eleveInfo.id}`} className="dropdown-item text-white">
                                    <i className="bi bi-folder me-2"></i>Mon parcours scolaire
                                </Link> 
                            </div>
          }
                        <div className="nav-item container">
                                                    <Link to="#" className="text-white u-style-ffc037cc">
                                                        <i className="bi bi-globe me-2"></i>Références
                                                    </Link>
                                                    <div className="">
                                                        <Link to="/secondaire" className="dropdown-item text-white">
                                                            <i className="bi bi-house-door me-2"></i>Accueil
                                                        </Link>
                                                        <Link to="/secondaire" className="dropdown-item text-white">
                                                            <i className="bi bi-gear me-2"></i>Service
                                                        </Link>
                                                        <Link to="/secondaire" className="dropdown-item text-white">
                                                            <i className="bi bi-telephone me-2"></i>Contact
                                                        </Link>
                                                        <Link to="/secondaire" className="dropdown-item text-white">
                                                            <i className="bi bi-info-circle me-2"></i>A propos
                                                        </Link>
                                                    </div>
                        </div>
                        <Link to="/secondaire/deconnexion" className="nav-item nav-link text-white">
                            <i className="bi bi-box-arrow-right bg-warning text-white me-2"></i>Déconnexion
                        </Link>
                    </div>
                </nav>
            </div>
        </div> :

  <div>Utilisateur non trouvé.</div>;

};

export default SidebarLeft;
