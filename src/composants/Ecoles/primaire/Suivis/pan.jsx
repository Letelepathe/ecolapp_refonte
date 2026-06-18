import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./PanelEleve.css";
import './style_recu.css';
import LogoEcoleApp from '../Images/logo-ecole-app.webp';
import '../Users/Profil/spinner.css';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

 
const PanelEleve = () => {
  const navigate = useNavigate();
 
  const { id } = useParams(); 

  const [cours_fichier, setCoursFichier] = useState([]);
  const [error, setError] = useState('');
  const [details, setDetails] = useState([]);
  const [filter, setFilter] = useState({ type: "mois", value: "" });
  
  const [eleve, setEleve] = useState(null);
  const [cours, setCours] = useState([]);
  const [cotes, setCotes] = useState([]);
  const [cotesGenerales, setCotesGenerales] = useState([]);
  const [travaux_eleve, setTravauxEleve] = useState([]);
  const [message, setMessage] = useState("");

  // const [cours, setCours] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const receiptRef = useRef(null);
  const [horaires, setHoraires] = useState([]);
  const [travaux, setTravaux] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const fetchEleveById = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/eleve/${id}`);
        setEleve(response.data.eleve);
        console.log(response.data.eleve);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'élève :", error);
      }
    };


      const fetchCotesByEleve = async () => {
        try {
          const response = await axios.get(`https://api.ecolapp.cd/api/cotes/eleve/${id}`);
          setCotes(response.data.cotes);
          console.log(response.data.cotes);
        } catch (error) {
          console.error("Erreur lors de la récupération des cotes :", error);
        }
      };

      const fetchCotesGeneralesByEleve = async () => {
        try {
          const response = await axios.get(`https://api.ecolapp.cd/api/cotegenerale/eleve/${id}`);
          setCotesGenerales(response.data.cotes);
        } catch (error) {
          console.error("Erreur lors de la récupération des cotes :", error);
        }
      };

      const fetchTravauxEleve = async () => {
        try {
          const response = await axios.get(`https://api.ecolapp.cd/api/travailEffectue/eleve/${id}`)
          if (response.data.success) {
            setTravauxEleve(response.data.travaux);
            console.log(response.data);
          } else {
            setMessage("");
            console.log(response.data);
          }
        } catch (error) {
          console.log("Erreur de connexion au serveur.");
        }
      };
  
      

   

     const fetchTravauxByClasse = async () => {
      if (!eleve?.classes_id) return;
      const id_classe = eleve.classes_id;
      const id_option = eleve.options_id;
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/travail/classe/${id_classe}/${id_option}`);
        setTravaux(response.data.travaux);
      } catch (error) {
        console.error("Erreur lors de la récupération des travaux :", error);
      }
    };

    const fetchCoursByClasse = async () => {
      if (!eleve?.classes_id) return;
      const id_classe = eleve.classes_id;
      const id_option = eleve.options_id;
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cours/classe/${id_classe}/${id_option}`);
        setCours(response.data.cours);
        console.log('cours :', response.data.cours);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
      }
   };

    const fetchCoursFichier = async () => {
      if (!eleve?.classes_id) return;
      const id_classe = eleve.classes_id;
      const id_option = eleve.options_id;
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/coursFichier/classe/${id_classe}/option/${id_option}`);
        setCoursFichier(response.data.cours);
      } catch (error) {
        console.log("Erreur lors de la récupération des cours en fichier :", error);
      }
    };

    const fetchHorairesByClasse = async () => {
      if (!eleve?.classes_id) return;
      const id_classe = eleve.classes_id;
      const id_option = eleve.options_id;
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/classes/horaires/${id_classe}/${id_option}`);
        setHoraires(response.data.horaires);
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires :", error);
      }
    };

    const fetchPaiements = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/paiement/eleve/${id}`);
        setPaiements(response.data.paiements || []);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
      }
    };

    const fetchDetails = async () => {
      try {
          const response = await axios.get(`https://api.ecolapp.cd/api/presences/eleve/${id}?filter=${JSON.stringify(filter)}`)
          if (response.data.status === 200) {
              setDetails(response.data);  // Mettre à jour les détails des présences
          } else {
              setError(response.data.error_msg); 
          }
      } catch (error) { 
         console.log("Erreur lors de la récupération des détails de l'élève.");
      }
    };

    const checkSession = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
          setAuthenticated(true);
      } else {
          setAuthenticated(false);
      }
    };

    const checkEleveSession = () => {
          const eleveId = localStorage.getItem('eleveId');
          if (!eleveId) {
              navigate('/secondaire/suivi_scolaire');
          }
    };
  
    fetchDetails();
    checkSession();
    fetchCoursFichier();
    fetchEleveById();
    fetchCotesByEleve();
    fetchCotesGeneralesByEleve();
    fetchTravauxEleve();
    fetchPaiements();
    fetchTravauxByClasse();
    fetchHorairesByClasse();
    fetchCoursByClasse();
    checkEleveSession();

  }, [id, eleve, filter, navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };
  
  const generateProof = (paiement) => {
    setSelectedReceipt(paiement);
  };

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
          rel="noopener noreferrer"
        >
          Voir PDF
        </a>
      );
    }

    return (
      <div>Aucun fichier trouvé</div>
    );
  };

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
          rel="noopener noreferrer"
        >
          Voir PDF
        </a>
      );
    }

    return (
      <div>Aucun fichier trouvé</div>
    );
  };

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
          rel="noopener noreferrer"
        >
          Voir PDF
        </a>
      );
    }

    return <div>Aucun fichier trouvé</div>;
  };

  const printReceipt = () => {
    window.print();
  };

  if (!eleve) {
    return <div className="spinner"></div>;
  }

  

  return (
    <div> 
      <Helmet>
        <title>ecolapp | Panel élève </title>
        <meta name="description" content="Panel élève" />
      </Helmet>
      <nav className="navbar navbar-light py-2 fixed-top container-fluid" style={{background: '#1769ff'}}>
        <h2 className="navbar-brand font-weight-bold" style={{fontWeight: 900, color: '#fff', fontSize:'20px'}}>ecolapp</h2>
        <div className="text-center">
          <div className="hide-on-print">
          {authenticated ? (
          <Link className="btn btn-warning text-white btn-sm" style={{borderRadius:'10px'}} to="/secondaire/profil_user">
            Retour
          </Link>
          ) : (
            <Link className="btn btn-warning text-white btn-sm" style={{borderRadius:'10px'}} to="/secondaire">Quitter</Link>
          )}
          </div>
        </div>
      </nav>
      
      <div className="container-fluid panel-eleve">
        <div className="row g-4">
          
          <div className="col-lg-4 col-12 hide-on-print bg-white py-3 shadow mt-2 d-none d-lg-block" style={{borderRadius:'20px'}}>
            <h3 className="section-title text-center hide-on-print" style={{color: '#1769ff'}}>Informations de l'élève</h3>
             <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
              <ul className="info-list container hide-on-print">
                <li><strong>Nom:</strong> {eleve.name}</li>
                <li><strong>Postnom:</strong> {eleve.last_name}</li>
                <li><strong>Prénom:</strong> {eleve.first_name}</li>
                <li><strong>Sexe:</strong> {eleve.sexe}</li>
                <li><strong>Classe:</strong> {eleve.classe.name}</li>
                <li><strong>Matricule:</strong> {eleve.matricule}</li>
              </ul>
             </div>
            <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
              <div id="recent-blog-posts" className="recent-blog-posts container">
                    <h3 className="mb-4 text-primary">Horaires</h3>
                    <div className="row">
                        {horaires.map((horaire) => (
                            <div className="col-12" key={horaire.id}>
                                <div className="post-box"> 
                                    <div className="post-img">
                                        <img src={`https://api.ecolapp.cd/public/imgHoraire/${horaire.image}`}  className="img-fluid w-100" style={{height:'200px', objectFit: 'cover'}} alt=""/>
                                    </div>
                                        <span className="post-date">{horaire.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12 hide-on-print bg-white py-3 shadow mt-2 d-block d-lg-none" style={{borderRadius:'20px'}}>
            <h3 className="section-title text-center hide-on-print" style={{color: '#1769ff'}}>Informations de l'élève</h3>
            <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
              <ul className="info-list container hide-on-print">
                <li><strong>Nom:</strong> {eleve.name}</li>
                <li><strong>Postnom:</strong> {eleve.last_name}</li>
                <li><strong>Prénom:</strong> {eleve.first_name}</li>
                <li><strong>Sexe:</strong> {eleve.sexe}</li>
                <li><strong>Classe:</strong> {eleve.classe.name}</li>
                <li><strong>Matricule:</strong> {eleve.matricule}</li>
              </ul>
             </div>
            
          </div>
          <div className="col-lg-8 col-12 hide-on-print content">
            
            <div className="container-fluid">
            <Swiper
              modules={[Navigation]}
              spaceBetween={10} //  Espace général entre les éléments
              navigation
              slidesPerView={2} //  Ajustement pour les petits écrans
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 15 }, //  Plus d'espace sur mobile
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 25 },
              }}
              className="nav nav-pills mb-3 mt-3"
              id="pills-tab"
              role="tablist"
              style={{ padding: '0 15px' }} //  Marge gauche/droite
            >
              <SwiperSlide className="nav-item">
                <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#cours_classe" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Cours de la classe</button>
              </SwiperSlide>
              <SwiperSlide className="nav-item d-block d-lg-none">
                <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#horaires" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Horaires des cours</button>
              </SwiperSlide>
              <SwiperSlide className="nav-item">
                <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#cours_fichier" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Cours en fichier</button>
              </SwiperSlide>
              <SwiperSlide className="nav-item">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#travaux_eleve" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Travaux Elève</button>
              </SwiperSlide>
              <SwiperSlide className="nav-item">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#travaux_deposes" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Travaux déposés</button>
              </SwiperSlide>
              <SwiperSlide className="nav-item">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#notes" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Notes</button>
              </SwiperSlide>
              <SwiperSlide className="nav-item">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#paiements" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Paiements</button>
              </SwiperSlide>
              <SwiperSlide className="nav-item">
                <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#presence" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Présence</button>
              </SwiperSlide>
            </Swiper>



                <div className="tab-content" id="pills-tabContent">
                
                  <div className="tab-pane fade show active" id="cours_classe" role="tabpanel" aria-labelledby="pills-home-tab">
                      <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
                        <h3 className="section-title container">Cours de la Classe ({cours.length}) </h3>
                        <div className="table-responsive container">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Nom du cours</th>
                                <th>Pondération</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cours.map((cour, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{cour.name}</td>
                                  <td>{cour.ponderation}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>                 
                    </div>
                    <div className="tab-pane fade" id="horaires" role="tabpanel" aria-labelledby="pills-home-tab">
                      <div className="bg-white py-3 shadow mt-2 d-block d-lg-none" style={{borderRadius:'20px'}}>
                        <div id="recent-blog-posts" className="recent-blog-posts container">
                              <h3 className="mb-4 text-primary">Horaires</h3>
                              <div className="row">
                                  {horaires.map((horaire) => (
                                      <div className="col-12" key={horaire.id}>
                                          <div className="post-box"> 
                                              <div className="post-img">
                                                  <img src={`https://api.ecolapp.cd/public/imgHoraire/${horaire.image}`}  className="img-fluid w-100" style={{height:'200px', objectFit: 'cover'}} alt=""/>
                                              </div>
                                                  <span className="post-date">{horaire.title}</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                        </div>
                      </div>
                    </div>
                   <div className="text-center mt-2 mb-2">
                     <Link to={`/secondaire/consulter_resultat/${id}`} className="btn btn-primary">Consulter résultat</Link>
                   </div>
                   <div className="tab-pane fade" id="cours_fichier" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <div className="bg-white shadow py-3 container">
                          <div className="bg-white py-3 shadow mt-2 hide-on-print" style={{borderRadius:'20px'}}>
                            <h2 className="text-center mb-4 text-primary">Cours en fichier ({cours_fichier.length})</h2>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <div className="table-responsive hide-on-print container">
                              <table className="table table-bordered table-hover">
                                <thead className="bg-primary text-white">
                                  <tr>
                                    <th className='text-white'>#</th>
                                    <th className='text-white'>Fichier</th>
                                    <th className='text-white'>Titre</th>
                                    <th className='text-white'>Description</th>
                                    <th className='text-white'>Cours</th>
                                    <th className='text-white'>Enseignant</th>
                                    <th className='text-white'>Année</th>
                                    <th className='text-white'>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cours_fichier.length > 0 ? (
                                    cours_fichier.map((cf, index) => (
                                      <tr key={cf.id}>
                                        <td>{index + 1}</td>
                                        <td>{renderFileCours(cf.fichier)}</td>
                                        <td>{cf.titre}</td>
                                        <td>{cf.description}</td>
                                        <td>{cf.cour.name}</td>
                                        <td>{cf.enseignant.name} {cf.enseignant.last_name} {cf.enseignant.first_name}</td>
                                        <td>{cf.annee.name}</td>
                                        <td>
                                        <a
                                            className="btn btn-primary"
                                            href={`https://api.ecolapp.cd/public/Cours/${cf.fichier}`}
                                          >
                                            <i className="bi bi-download"></i> Télécharger
                                          </a>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="6" className="text-center">Aucun travail trouvé</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="travaux_eleve" role="tabpanel" aria-labelledby="pills-contact-tab">
                      <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
                        <h2 className="mb-4 text-primary hide-on-print container">Liste des Travaux ({travaux.length}) </h2>
                        <div className="table-responsive container">
                          <table className="table table-bordered table-hover">
                            <thead className="bg-primary text-white">
                              <tr>
                                <th className='text-white'>#</th>
                                <th className='text-white'>Fichier</th>
                                <th className='text-white'>Titre</th>
                                <th className='text-white'>Description</th>
                                <th className='text-white'>Date de remise</th>
                                <th className='text-white'>Cours</th>
                                <th className='text-white'>Enseignant</th>
                                <th className='text-white'>Type</th>
                                <th className='text-white'>Année</th>
                                <th className='text-white'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {travaux.length > 0 ? (
                                travaux.map((travail, index) => (
                                  <tr key={travail.id}>
                                    <td>{index + 1}</td>
                                    <td>{renderFile(travail.fichier)}</td>
                                    <td>{travail.titre}</td>
                                    <td>{travail.description}</td>
                                      <td>{travail.date_remise}</td>
                                      <td>{travail.cour.name}</td>
                                      <td>{travail.enseignant.name} {travail.enseignant.last_name} {travail.enseignant.first_name}</td>
                                      <td>{travail.type_travail.name}</td>
                                      <td>{travail.annee.name}</td>
                                    <td>
                                    <a
                                      className="btn btn-primary"
                                      href={`https://api.ecolapp.cd/public/Travaux/Questionnaires/${travail.fichier}`}
                                    >
                                      <i className="bi bi-download"></i> Télécharger
                                    </a>
                                    </td>
                                  </tr>
                                )) 
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">Aucun travail trouvé</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="travaux_deposes" role="tabpanel" aria-labelledby="pills-contact-tab">
                      <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
                        <div className="container table-responsive mt-5">
                          <h2 className="text-primary">Travaux Déposés ({travaux_eleve.length})</h2>
                          {message && <div className="alert alert-info">{message}</div>}
                          <table className="table table-bordered table-hover mt-3">
                            <thead className="bg-primary text-white">
                              <tr>
                                <th>#</th>
                                <th>Cours</th>
                                <th>Description du Travail</th>
                                <th>Fichier</th>
                                <th>Date de Dépôt</th>
                                <th>Télécharger</th>
                              </tr>
                            </thead>
                            <tbody>
                              {travaux_eleve.map((travail_eleve, index) => (
                                <tr key={travail_eleve.id}>
                                  <td>{index + 1}</td>
                                  <td>{travail_eleve.cour.name}</td>
                                  <td>{travail_eleve.description}</td>
                                  <td>{renderFileEleve(travail_eleve.fichier)}</td>
                                  <td>{travail_eleve.date_depot}</td>
                                  <td>
                                   <a
                                      className="btn btn-primary"
                                      download
                                      href={`https://api.ecolapp.cd/public/Travaux/Questionnaires/${travail_eleve.fichier}`}
                                    >
                                      <i className="bi bi-download"></i> Télécharger
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="notes" role="tabpanel" aria-labelledby="pills-contact-tab">
                      <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
                          <div className="table-responsive hide-on-print container">
                            <h3 className="section-title container">Résultats/Notes</h3>
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Cours</th>
                                  <th>Epreuve</th>
                                  <th>Total général</th>
                                  <th>Note obtenue</th>
                                  <th>Periode</th>
                                  <th>Année</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cotes.map((cote, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{cote.cour.name}</td>
                                    <td>{cote.type_epreuve}</td>
                                    <td>{cote.total_general}</td>
                                    <td>{cote.note}</td>
                                    <td>{cote.periode.name}</td>
                                    <td>{cote.annee.name}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                      </div>
                      <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
                          <div className="table-responsive hide-on-print container">
                            <h3 className="section-title container">Notes générales</h3>
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Cours</th>
                                  <th>Total général</th>
                                  <th>Note obtenue</th>
                                  <th>Periode</th>
                                  <th>Année</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cotesGenerales.map((cg, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{cg.cour.name}</td>
                                    <td>{cg.total_general}</td>
                                    <td>{cg.total_obtenu}</td>
                                    <td>{cg.periode.name}</td>
                                    <td>{cg.annee.name}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="paiements" role="tabpanel" aria-labelledby="pills-contact-tab">
                      <div className="bg-white py-3 shadow mt-2" style={{borderRadius:'20px'}}>
                        <h3 className="section-title container">Paiements ({paiements.length}) </h3>
                        <div className="table-responsive container">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Montant</th>
                                <th>Devise</th>
                                <th>Tranche</th>
                                <th>Motif</th>
                                <th>Année</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paiements.map((paiement, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{paiement.montant}</td>
                                  <td>{paiement.devise.name}</td>
                                  <td>{paiement.tranche.name}</td>
                                  <td>{paiement.motif.name}</td>
                                  <td>{paiement.annee.name}</td>
                                  <td>
                                    <button
                                      className="btn btn-secondary"
                                      onClick={() => generateProof(paiement)}
                                    >
                                      Générer Preuve
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="presence" role="tabpanel" aria-labelledby="pills-contact-tab">
                            <div className="container">
                              {/* Filtrage */}
                              <div className="row mb-3">
                                  <div className="col-md-6">
                                      <label>Filtrer par :</label>
                                      <select
                                          className="form-control"
                                          name="type"
                                          value={filter.type}
                                          onChange={handleFilterChange}
                                      >
                                          <option value="mois">Mois</option>
                                          <option value="semaine">Semaine</option>
                                      </select>
                                  </div>
                                  <div className="col-md-6">
                                      <label>{filter.type === "mois" ? "Sélectionnez le mois" : "Sélectionnez la semaine"} :</label>
                                      <input
                                          type="text"
                                          className="form-control"
                                          name="value"
                                          value={filter.value}
                                          onChange={handleFilterChange}
                                          placeholder={`Entrez ${filter.type === "mois" ? "le mois (YYYY-MM)" : "les dates (YYYY-MM-DD à YYYY-MM-DD)"}`}
                                      />
                                  </div>
                              </div>

                              {/* Statistiques */}
                              <h3>Statistiques :</h3>
                              <div className='table-responsive'>
                                  <table className="table table-bordered">
                                      <thead>
                                          <tr>
                                              <th>Présences</th>
                                              <th>Absences</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                              <td>{details?.stats?.presences}</td>
                                              <td>{details?.stats?.absences}</td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>

                              {/* Historique */}
                              <h3>Historique :</h3>
                              <div className='table-responsive'>
                                  <table className="table table-bordered">
                                      <thead>
                                          <tr>
                                              <th>Date</th>
                                              <th>Présent</th>
                                              <th>Motif d'Absence</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {details?.historique && Object.entries(details.historique).map(([date, entries]) => (
                                              entries.map((entry, index) => (
                                                  <tr key={index}>
                                                      <td>{entry.date_presence}</td>
                                                      <td>{entry.present ? "Oui" : "Non"}</td>
                                                      <td>{entry.motif_absence ? entry.motif_absence.name : ""}</td>
                                                  </tr>
                                              ))
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>

 
           
          </div>
        
         
       </div>
      </div> 
      <div className="row">
        <div className="col-lg-4 col-12"></div>
        <div className="col-lg-8">
          {/* Reçu pour paiement sélectionné */}
          {selectedReceipt && (
            <div ref={receiptRef} className="mt-4">
              <div className="receipt-container">
                <div className="bloc_header">
                  <h5>ecolapp</h5>
                  <img src={LogoEcoleApp} alt="Logo de l'école" className="logo_paiement" />
                </div>
                <div className="receipt-header">Reçu de Paiement N° {selectedReceipt.id}</div>

                <div className="receipt-section">
                  <div>
                    <span className="label_paiement">Nom :</span> <span className="info">{selectedReceipt.eleve.name} </span><br />
                    <span className="label_paiement">Postnom :</span> <span className="info">{selectedReceipt.eleve.last_name} </span><br />
                    <span className="label_paiement">Prénom :</span> <span className="info">{selectedReceipt.eleve.first_name} </span>
                  </div>
                  <div>
                    <span className="label_paiement">Sexe :</span> <span className="info">{selectedReceipt.eleve.sexe} </span><br />
                    <span className="label_paiement">Classe :</span> <span className="info">{selectedReceipt.classe.name} </span><br />
                    <span className="label_paiement">Matricule :</span> <span className="info">{selectedReceipt.eleve.matricule} </span>
                  </div>
                </div>

                <div className="receipt-section">
                  <div>
                    <span className="label_paiement">Année scolaire :</span> <span className="info">{selectedReceipt.annee.name} </span><br />
                    <span className="label_paiement">Motif :</span> <span className="info">{selectedReceipt.motif.name}</span>
                  </div>
                  <div>
                    <span className="label_paiement">Devise :</span> <span className="info">{selectedReceipt.devise.name} </span><br />
                    <span className="label_paiement">Montant :</span> <span className="info">{selectedReceipt.montant} </span><br />
                    <span className="label_paiement">Tranche :</span> <span className="info">{selectedReceipt.tranche.name} </span>
                  </div>
                </div>

                <div className="signature">
                  <span>{new Date(selectedReceipt.created_at).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                  </span>
                </div>
                <button className="btn btn-primary hide-on-print" onClick={printReceipt}>
                  Imprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelEleve;
