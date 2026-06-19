import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { Helmet } from "react-helmet";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import FooterUser from "./Footer";

import Communiques from "./Communiques";
import Admins from "./Admins";
import StatEleve from '../../Suivis/StatEleve';
import StatEnseignant from "../../Enseignant/StatEnseignant";


const CoursFichiers = ({ userId }) => {
  const [coursFichier, setCoursFichier] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCours = useCallback(async (page = 1) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/coursFichier/enseignant/${userId}?page=${page}`);
      setCoursFichier(response.data.coursFichier.data);
      setTotalPages(response.data.coursFichier.last_page);
      setCurrentPage(page);
    } catch (error) {
      setError("Erreur lors de la récupération des cours.");
    }
  }, [userId]);

  useEffect(() => {
    fetchCours(currentPage);
  }, [fetchCours, currentPage]);

  const renderFileCours = (file) => {
    const fileExtension = file.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`https://api.ecolapp.cd/public/Cours/${file}`} alt="" width={50} />;
    }

    if (fileExtension === 'pdf') {
      return (
        <a
          href={`https://api.ecolapp.cd/public/Cours/${file}`}
          target="_blank"
          rel="noopener noreferrer">
          
          Voir PDF
        </a>);

    }

    return (
      <div>Aucun fichier trouvé</div>);

  };



  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/coursFichier/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Cours supprimé avec succès !");
        fetchCours(currentPage);
      } else {
        setError(response.data.status_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur de connexion au serveur.");
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchCours(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchCours(currentPage - 1);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="text-center mb-4 text-primary">Vos ours</h5>
        <Link className="btn " to='/maternelle/ajouter_cours_by_enseignant'> <i className="bi bi-plus"></i> Ajouter cours</Link>
      </div>
      {successMessage &&
      <p>{successMessage}</p>
      }
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="table-responsive">
        <table className="table  ">
          <thead className="bg-primary text-white">
            <tr>
              <th className='text-white'>#</th>
              <th className='text-white'>Fichier</th>
              <th className='text-white'>Titre</th>
              <th className='text-white'>Description</th>
              <th className='text-white'>Cours</th>
              <th className='text-white'>Classe</th>
              <th className='text-white'>Option</th>
              <th className='text-white'>Enseignant</th>
              <th className='text-white'>Année</th>
              <th className='text-white'>Action</th>
            </tr>
          </thead>
          <tbody>
            {coursFichier.length > 0 ?
            coursFichier.
            filter((cf) => {
              const fileExtension = cf.fichier?.split('.').pop().toLowerCase();
              return !['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(fileExtension);
            }).
            map((cf, index) =>
            <tr key={cf.id}>
                    <td>{index + 1}</td>
                    <td>{renderFileCours(cf.fichier)}</td>
                    <td>{cf.titre}</td>
                    <td>{cf.description}</td>
                    <td>{cf.cour?.name || '-'}</td>
                    <td>{cf.classe?.name || '-'}</td>
                    <td>{cf.option?.name || '-'}</td>
                    <td>
                      {cf.enseignant?.name} {cf.enseignant?.last_name} {cf.enseignant?.first_name}
                    </td>
                    <td>{cf.annee?.name || '-'}</td>
                    <td>
                      <a
                  className="btn  mt-2 mb-2 w-100"
                  href={`https://api.ecolapp.cd/public/Cours/${cf.fichier}`}>
                  
                        <i className="bi bi-download"></i> Télécharger
                      </a>
                      <Link onClick={() => handleDelete(cf.id)} className='btn  mt-2 mb-2 w-100'>Supprimer</Link>
                    </td>
                  </tr>
            ) :

            <tr>
                <td colSpan="10" className="text-center">Aucun cours trouvé</td>
              </tr>
            }
          </tbody>

        </table>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn " onClick={prevPage} disabled={currentPage === 1}>
            Précédent
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button className="btn " onClick={nextPage} disabled={currentPage === totalPages}>
            Suivant
          </button>
        </div>
      </div>
    </div>);

};

const TravauxEnseignant = ({ userId }) => {
  const [travaux, setTravaux] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTravaux = useCallback(async (page = 1) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/travail/enseignant/${userId}?page=${page}`);
      setTravaux(response.data.travaux.data);
      setTotalPages(response.data.travaux.last_page);
      setCurrentPage(page);
    } catch (error) {
      setError("Erreur lors de la récupération des travaux.");
    }
  }, [userId]);

  useEffect(() => {
    fetchTravaux(currentPage);
  }, [fetchTravaux, currentPage]);

  const renderFile = (file) => {
    const fileExtension = file.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`https://api.ecolapp.cd/public/Travaux/Questionnaires/${file}`} alt="" width={50} />;
    }

    if (fileExtension === 'pdf') {
      return (
        <a
          href={`https://api.ecolapp.cd/public/Travaux/Questionnaires/${file}`}
          target="_blank"
          rel="noopener noreferrer">
          
          Voir PDF
        </a>);

    }

    return (
      <div>Aucun fichier trouvé</div>);

  };

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/travail/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Travail supprimé avec succès !");
        fetchTravaux(currentPage);
      } else {
        setError(response.data.status_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur de connexion au serveur.");
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchTravaux(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchTravaux(currentPage - 1);
    }
  };

  return (
    <div>
       <div className="mt-4 mb-4">
          <div className="justify-content-between align-items-center d-flex">
            <h5 className="text-center mb-4 text-primary">Vos Travaux</h5>
            <Link className="btn " to='/maternelle/ajouter_travail_by_enseignant'> <i className="bi bi-plus"></i> Ajouter travail</Link>
          </div>
          {successMessage &&
        <p>{successMessage}</p>
        }
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="table-responsive">
            <table className="table  ">
              <thead className="bg-primary text-white">
                <tr>
                  <th className='text-white'>#</th>
                  <th className='text-white'>Fichier</th>
                  <th className='text-white'>Titre</th>
                  <th className='text-white'>Description</th>
                  <th className='text-white'>Date de remise</th>
                  <th className='text-white'>Cours</th>
                  <th className='text-white'>Classe</th>
                  <th className='text-white'>Option</th>
                  <th className='text-white'>Enseignant</th>
                  <th className='text-white'>Type</th>
                  <th className='text-white'>Année</th>
                  <th className='text-white'>Action</th>
                </tr>
              </thead>
              <tbody>
                {travaux.length > 0 ?
              travaux.map((travail, index) =>
              <tr key={travail.id}>
                      <td>{index + 1}</td>
                      <td>{renderFile(travail.fichier)}</td>
                      <td>{travail.titre}</td>
                      <td>{travail.description}</td>
                      <td>{travail.date_remise}</td>
                      <td>{travail.cour.name}</td>
                      <td>{travail.classe.name}</td>
                      <td>{travail.option.name}</td>
                      <td>{travail.enseignant.first_name} {travail.enseignant.name}</td>
                      <td>{travail.type_travail.name}</td>
                      <td>{travail.annee.name}</td>
                      <td>
                        <a
                    className="btn  mt-2 mb-2 w-100"
                    href={`https://api.ecolapp.cd/public/Travaux/Questionnaires/${travail.fichier}`}>
                    
                          <i className="bi bi-download"></i> Télécharger
                        </a>
                        <Link to={`/maternelle/liste_travaux_deposes/${travail.id}`} target="_blank" rel="noopener noreferrer" className="btn  mt-2 mb-2 w-100 text-white">
                          Voir travaux déposés
                        </Link>
                        <Link onClick={() => handleDelete(travail.id)} className='btn  mt-2 mb-2 w-100'>Supprimer</Link>
                      </td>
                    </tr>
              ) :

              <tr>
                    <td colSpan="6" className="text-center">Aucun travail trouvé</td>
                  </tr>
              }
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn " onClick={prevPage} disabled={currentPage === 1}>
                Précédent
              </button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button className="btn " onClick={nextPage} disabled={currentPage === totalPages}>
                Suivant
              </button>
            </div>
          </div>
        </div>
    </div>);

};

const ProfilUser = () => {
  const id = localStorage.getItem("userId");
  const [eleveInfo, setEleveInfo] = useState(null);
  const [isLoadingEleveInfo, setIsLoadingEleveInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({
    travaux_enseignant: 0,
    travaux_eleve: 0,
    cours_enseignant: 0,
    cours_fichier_enseignant: 0,
    cours_classe_eleve: 0,
    paiements: 0,
    communiques: 0
  });

  const navigate = useNavigate();

  const [error, setError] = useState('');
  const userId = localStorage.getItem("userId");
  const [successMessage, setSuccessMessage] = useState('');
  const [travaux_eleve, setTravauxEleve] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTravauxEleve = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/travailEffectue/user/eleve/${userId}`);
        if (response.data.success) {
          setTravauxEleve(response.data.travaux);
        } else {
          setMessage("Aucun travail trouvé.");
        }
        console.log(response.data);
      } catch (error) {
        console.log("Erreur de connexion au serveur.");
      }
    };

    fetchTravauxEleve();
  }, [userId]);

  const renderFileEleve = (file) => {
    const fileExtension = file.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${file}`} alt="" width={50} />;
    }

    if (fileExtension === 'pdf') {
      return (
        <a
          href={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${file}`}
          target="_blank"
          rel="noopener noreferrer">
          
            Voir PDF
          </a>);

    }

    return <div>Aucun fichier trouvé</div>;
  };

  const handleDeleteTravailEleve = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/travailEffectue/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Travail supprimé avec succès !");
        setTravauxEleve(travaux_eleve.filter((travail) => travail.id !== id));
      } else {
        setError(response.data.status_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur de connexion au serveur.");
    }
  };






  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user info
        const userResponse = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);
        const userData = userResponse.data.user;
        setUser(userData);

        // If user is 'Elève', fetch additional info
        if (userData.fonction.name === "Elève") {
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

      } catch {
        setError("");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCounts = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/count/${id}`);
        setCounts(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
    fetchCounts();
  }, [id, navigate]);

  if (isLoading) return <div className='spinner'></div>;

  return (
    <div className="profil-user-page refonte-shell">
            <Helmet>
                <title>maternelle | Profil utilisateur</title>

            </Helmet>
            <div className="container-fluid position-relative d-flex p-0 refonte-shell">
           
                <SidebarLeft />
                <div className="content refonte-content">
                    <NavbarTop />
                    <div className="container-fluid pt-4 px-4 profil-dashboard-section">
                        <div className="row g-4">
                            {/* Bloc pour les enseignants */}
                            {user && (["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) || ["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.role)) &&
              <>
                                    <div className="col-sm-6 col-md-6 col-xl-3">
                                        <Link to="/maternelle/liste_travail_by_enseignant">
                                        <DashboardCard title="Mes travaux" count={counts.travaux_enseignant} icon="bi-pencil-square" />
                                        </Link>
                                    </div>                                   
                                    <div className="col-sm-6 col-md-6 col-xl-3">
                                        <Link to="/maternelle/liste_cours_titulaire_by_enseignant">
                                        <DashboardCard title="Mes cours/Titulaire" count={counts.cours_enseignant} icon="bi-book-half" />
                                        </Link>
                                    </div>                                   
                                    <div className="col-sm-6 col-md-6 col-xl-3">
                                        <Link to="/maternelle/liste_cours_by_enseignant">
                                        <DashboardCard title="Mes cours/Fichier" count={counts.cours_fichier_enseignant} icon="bi-folder" />
                                        </Link>
                                    </div>
                                </>
              }
                            {/* Bloc pour les élèves */}
                            {user && user.fonction.name === "Elève" &&
              <>
                                    <div className="col-sm-6 col-md-6 col-xl-3">
                                        <Link to="/maternelle/liste_travail_by_eleve">
                                        <DashboardCard title="Mes travaux" count={counts.travaux_eleve} icon="bi-pencil-square" />
                                        </Link>
                                    </div>                                    
                                    <div className="col-sm-6 col-md-6 col-xl-3">
                                     <DashboardCard title="Cours/Classe" count={counts.cours_classe_eleve} icon="bi-book-half" />
                                    </div>                                   
                                    <div className="col-sm-6 col-md-6 col-xl-3">
                                     <DashboardCard title="Mes paiements" count={counts.paiements} icon="bi-credit-card" />
                                    </div>                                   
                                </>
              }
                            <div className="col-sm-6 col-md-6 col-xl-3">
                              <Link to='/maternelle/communiques' target="_blank" rel="noopener noreferrer">
                                <DashboardCard title="Communiqués" count={counts.communiques} icon="bi-megaphone" />
                              </Link>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid pt-4 px-4 profil-dashboard-section">
                        <div className="row g-4">
                          {user && (["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) || ["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.role)) &&
              <div className='col-12'>
                              <StatEnseignant id={user.id} />
                            </div>
              }
                          {user && (user.fonction.name === "Elève" || user.role === "Elève") &&
              <div className='col-12'>
                              {!isLoadingEleveInfo && eleveInfo &&
                <StatEleve id={`${eleveInfo.id}`} />
                }
                            </div>
              }
                          <div className="col-lg-12 col-12">

                            {user && (["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) || ["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.role)) &&
                <>
                                 <CoursFichiers userId={user.id} />
                                 <TravauxEnseignant userId={user.id} />
                              </>
                }
                            {user && (user.fonction.name === "Elève" || user.role === "Elève") &&
                <>
                                
                                <div className="col-12 mb-1 mt-1">
                                  <div className="  rounded align-items-center justify-content-center p-4">
                                      <p className="text-primary text-center">Mes Travaux Déposés ({travaux_eleve.length})</p>
                                      {successMessage &&
                      <p> {successMessage} </p>
                      }
                                      {error && <p className="text-danger text-center">{error}</p>}
                                      {message && <div className="alert alert-info">{message}</div>}
                                      <div className="table-responsive">
                                        <table className="table   mt-3">
                                          <thead className="u-style-77fdd8b0">
                                            <tr className="text-white">
                                              <th>#</th>
                                              <th>Cours</th>
                                              <th>Description du Travail</th>
                                              <th>Fichier</th>
                                              <th>Date de Dépôt</th>
                                              <th>Action</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {travaux_eleve.map((travail_eleve, index) =>
                            <tr key={travail_eleve.id}>
                                                <td>{index + 1}</td>
                                                <td>{travail_eleve.cour.name}</td>
                                                <td>{travail_eleve.description}</td>
                                                <td>{renderFileEleve(travail_eleve.fichier)}</td>
                                                <td>{travail_eleve.date_depot}</td>
                                                <td>
                                                  <a
                                  className="btn  text-white w-100 mb-2 mt-2"
                                  href={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${travail_eleve.fichier}`}>
                                  
                                                    Lire
                                                  </a>
                                                  <Link onClick={() => handleDeleteTravailEleve(travail_eleve.id)} className='btn  mt-2 mb-2 w-100'>Supprimer</Link>
                                                </td>
                                              </tr>
                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                  </div>
                                </div>
                               
                              </>
                }
                          </div>
                          <div className="col-lg-12 col-12 mt-4">
                            <div className="mb-3">
                            
                              <Communiques />
                            </div>
                            <Admins />
                          </div>
                        </div>
                    </div>
                    <FooterUser />
                </div>
            </div>
        </div>);

};

const DashboardCard = ({ title, count, icon }) => (
  <article className="dashboard-stat bleu profil-stat-card">
    <div className="dashboard-stat-top">
      <span className="dashboard-stat-icon">
        <i className={`bi ${icon}`} />
      </span>
      <span className="dashboard-stat-badge" />
    </div>
    <h3>{count}</h3>
    <p>{title}</p>
  </article>
);

export default ProfilUser;
