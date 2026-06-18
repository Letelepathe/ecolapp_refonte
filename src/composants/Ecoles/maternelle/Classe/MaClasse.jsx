import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import SidebarLeft from "../Users/Profil/SidebarLeft";
import NavbarTop from "../Users/Profil/NavbarTop";
import Footer from "../Users/Profil/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MaClasse = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const navigate = useNavigate();
  const [cours_fichier, setCoursFichier] = useState([]);

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { id_classe, id_option } = useParams();
  const [classe, setClasse] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [horaires, setHoraires] = useState([]);
  const [travaux, setTravaux] = useState([]);
  const [titulaire, setTitulaire] = useState(null);
  const [cours, setCours] = useState([]);
  const [periodes, setPeriodes] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [selectedCours, setSelectedCours] = useState('');
  const [cotes, setCotes] = useState([]);
  const id = localStorage.getItem("userId");
  const [selectedCoursVideo, setSelectedCoursVideo] = useState('');

  const [isCoursVideoModalOpen, setIsCoursVideoModalOpen] = useState(false);

  const handleCoursVideoSubmit = () => {
    if (selectedCoursVideo) {
      navigate(`/maternelle/cours_video/${id_classe}/${id_option}/${selectedCoursVideo}`);
    } else {
      setError('Veuillez sélectionner un cours de evalidr.');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("Erreur lors de la récupération des informations.");
      }
    };


    const fetchData = async () => {
      try {
        const classeResponse = await axios.get(`https://api.ecolapp.cd/api/classe/${id_classe}`);
        setClasse(classeResponse.data.classe);

        const eleveResponse = await axios.get(`https://api.ecolapp.cd/api/classes/eleves/ecole/${ecole_id}/direction/${direction}/classe/${id_classe}/option/${id_option}`);
        setEleves(eleveResponse.data.eleves);

        const horaireResponse = await axios.get(`https://api.ecolapp.cd/api/classes/horaires/ecole/${ecole_id}/direction/${direction}/classe/${id_classe}/option/${id_option}`);
        setHoraires(horaireResponse.data.horaires);

        const coursResponse = await axios.get(`https://api.ecolapp.cd/api/cours/classes/classe/${id_classe}/option/${id_option}`);
        setCours(coursResponse.data.cours);

        const travailResponse = await axios.get(`https://api.ecolapp.cd/api/travail/classes/classe/${id_classe}/option/${id_option}`);
        setTravaux(travailResponse.data.travaux);
        console.log(travailResponse.data.travaux);

        const coursFichierResponse = await axios.get(`https://api.ecolapp.cd/api/coursFichier/classes/classe/${id_classe}/option/${id_option}`);
        setCoursFichier(coursFichierResponse.data.cours);

        const titulaireResponse = await axios.get(`https://api.ecolapp.cd/api/titulaire/classes/classe/${id_classe}/option/${id_option}`);
        setTitulaire(titulaireResponse.data.titulaire);
        console.log(titulaireResponse.data.titulaire);

      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    const fetchPeriodes = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/periode/ecole/${ecole_id}/direction/${direction}`);
        setPeriodes(response.data.periodeAll);
        console.log(response.data.periodeAll);
      } catch (error) {
        console.error('Erreur lors de la récupération des périodes:', error);
      }
    };


    fetchPeriodes();

    fetchUser();

    fetchData();
  }, [id, id_classe, id_option, ecole_id, direction]);

  const handleFetchCotes = async () => {
    if (!selectedCours || !selectedPeriode) {
      alert("Veuillez sélectionner une période et un cours.");
      return;
    }

    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/cotegenerale/ecole/${ecole_id}/direction/${direction}`, {
        params: {
          classe_id: id_classe,
          periode_id: selectedPeriode,
          cours_id: selectedCours,
          option_id: id_option,
          ecole_id: ecole_id,
          direction: direction
        }
      });

      if (response.data.error) {
        console.log(response.data.error);
        setCotes([]);
      } else {
        setCotes(response.data.cotes);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des cotes :", error);
    }
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
          rel="noopener noreferrer">
          
          Voir PDF
        </a>);

    }

    return <div>Aucun fichier trouvé</div>;
  };

  const renderFileCours = (file) => {
    const fileExtension = file.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`https://api.ecolapp.cd/public/Cours/${file}`} alt="" width={50} />;
    }

    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(fileExtension)) {
      return (
        <video src={`https://api.ecolapp.cd/public/Cours/${file}`} controls className="u-style-5e4c2cf9"></video>);

    }

    if (['mp3'].includes(fileExtension)) {
      return (
        <audio src={`https://api.ecolapp.cd/public/Cours/${file}`} controls className="u-style-5e4c2cf9"></audio>);

    }

    if (['dox', 'doc', 'pdf'].includes(fileExtension)) {
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>ecolapp | Classe  </title>
      </Helmet>
      <div className="container-fluid position-relative bg-white d-flex p-0"> 
        <SidebarLeft />
        <div className="content">
          <NavbarTop />
          <div className="container-fluid ">
            <div>
              {user &&
              <h4 className="text-center">Salut {user.first_name} {user.name} </h4>
              }
            </div>
            <div className="bg-white py-3 shadow mt-2 u-style-59f7bcd2">
              {classe &&
              <h1 className="text-center text-primary">Classe : {classe.name}</h1>
              }
              
            
              <h3 className="mb-4 text-primary text-center">Informations de la Classe</h3>
              
              {titulaire &&
              <h3 className="mb-4 text-primary text-center">
                  Titulaire : {titulaire.user.name} {titulaire.user.last_name} {titulaire.user.first_name} ({titulaire.user.sexe})
                </h3>
              }
              {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
              <div className="bg-white py-3 shadow mt-2 mb-2 u-style-59f7bcd2">
                  <div className="container">
                    <h3 className="text-center">Gestion Présence élèves</h3>
                    <div className="justify-content-center aling-items-center d-flex">
                      <Link to={`/maternelle/ajouter_presence_eleve/${id_classe}/${id_option}`} className="btn btn-primary w-50 u-style-9761b3f7">Ajouter</Link>
                      <Link to={`/maternelle/historique_presence_eleve/${id_classe}/${id_option}`} className="btn btn-warning text-white w-50">Historique</Link>
                    </div>
                  </div>
                </div>
              }
            </div>

            <Swiper
              modules={[Navigation]}
              spaceBetween={10} //  Espace général entre les éléments
              navigation
              slidesPerView={2} //  Ajustement pour les petits écrans
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 15 }, //  Plus d'espace sur mobile
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 25 }
              }}
              className="nav nav-pills mb-3 mt-3 u-style-b1670753"
              id="pills-tab"
              role="tablist">

              
              <div className="container">
                <SwiperSlide key="1" className="nav-item" role="presentation">
                  <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#cours_classe" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Cours de la classe</button>
                </SwiperSlide>
                <SwiperSlide key="2" className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#horaires_classe" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Horaires des cours</button>
                </SwiperSlide>
                <SwiperSlide key="3" className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#cours_fichier" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Cours en fichier</button>
                </SwiperSlide>
                <SwiperSlide key="4" className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#travaux_eleve" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Travaux Elève </button>
                </SwiperSlide>
                
                <SwiperSlide key="5" className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#eleves_classe" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Elèves</button>
                </SwiperSlide>
                {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                <SwiperSlide key="6" className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#cotes_eleves" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Notes élèves </button>
                </SwiperSlide>
                }
              </div>
            </Swiper>
            <div className="tab-content" id="pills-tabContent">        
              <div className="tab-pane fade show active" id="cours_classe" role="tabpanel" aria-labelledby="pills-home-tab">
                <div className="bg-white py-3 shadow mt-2 u-style-59f7bcd2">
                  <div className="table-responsive container">
                    <h3 className="mb-4 text-primary">Cours de la Classe ({cours.length}) </h3>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nom du cours</th>
                          <th>Pondération</th>
                          <th>Quiz</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cours.map((cour, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{cour.name}</td>
                            <td>{cour.ponderation}</td>
                            <td>
                              <Link to={`/quiz/cours/${cour.id}/${c.name.replace(/ /g, '+')}`} target='_blank' rel='noopener noreferrer' className="btn btn-primary btn-sm me-2">Liste Quiz</Link>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade show" id="horaires_classe" role="tabpanel" aria-labelledby="pills-home-tab">
                <div className="bg-white py-3 shadow mt-2 u-style-59f7bcd2">
                    <div id="recent-blog-posts" className="recent-blog-posts container">
                      <h3 className="mb-4 text-primary">Horaires</h3>
                      <div className="row">
                          {horaires.map((horaire) =>
                      <div className="col-lg-4 col-md-6 col-12" key={horaire.id}>
                                  <div className="post-box"> 
                                      <div className="post-img">
                                          <img src={`https://api.ecolapp.cd/public/imgHoraire/${horaire.image}`} className="img-fluid w-100 u-style-a38c38cd" alt="" />
                                      </div>
                                          <span className="post-date">{horaire.title}</span>
                                  </div>
                              </div>
                      )}
                      </div>
                    </div>
                </div> 
              </div>
              <div className="tab-pane fade show" id="cours_fichier" role="tabpanel" aria-labelledby="pills-home-tab">
                <div className="bg-white py-3 shadow mt-2 u-style-59f7bcd2">
                  <div className="justify-content-between align-items-center d-flex">
                    <h6 className="text-center mb-4 text-primary">Cours en fichier ({cours_fichier.length}) </h6>
                    <button
                      className="btn btn-warning text-white"
                      onClick={() => {
                        setIsCoursVideoModalOpen(true);
                        setError(null);
                      }}>
                      
                      <i className='bi bi-camera-video'></i> Cours vidéos
                    </button>
                  </div>
                  {error && <p className="text-danger text-center">{error}</p>}
                  <div className="table-responsive container">
                    <table className="table table-bordered table-hover">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th className='text-white'>#</th>
                          <th className='text-white'>Fichier</th>
                          <th className='text-white'>Titre</th>
                          <th className='text-white'>Description</th>
                          <th className='text-white'>Cours</th>
                          <th className='text-white'>Classe</th>
                          <th className='text-white'>Enseignant</th>
                          <th className='text-white'>Année</th>
                          <th className='text-white'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                       {cours_fichier.length > 0 ?
                        cours_fichier.
                        filter((cf) => {
                          const fileExtension = cf.fichier.split('.').pop().toLowerCase();
                          return !['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(fileExtension);
                        }).
                        map((cf, index) =>
                        <tr key={cf.id}>
                                <td>{index + 1}</td>
                                <td>{renderFileCours(cf.fichier)}</td>
                                <td>{cf.titre}</td>
                                <td>{cf.description}</td>
                                <td>{cf.cour.name}</td>
                                <td>{cf.classe.name}</td>
                                <td>{cf.enseignant.name} {cf.enseignant.last_name} {cf.enseignant.first_name}</td>
                                <td>{cf.annee.name}</td>
                                <td>
                                  <a
                              className="btn btn-primary"
                              href={`https://api.ecolapp.cd/public/Cours/${cf.fichier}`}>
                              
                                    <i className="bi bi-download"></i> Télécharger
                                  </a>
                                </td>
                              </tr>
                        ) :

                        <tr>
                            <td colSpan="6" className="text-center">Aucun cours en fichier trouvé</td>
                          </tr>
                        }

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade show" id="travaux_eleve" role="tabpanel" aria-labelledby="pills-home-tab">
                <div className="bg-white py-3 shadow mt-2 u-style-59f7bcd2">
                  <div className="table-responsive container">
                    <h2 className="mb-4 text-primary">Liste des Travaux ({travaux.length})</h2>
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
                          {user && user.fonction.name === 'Elève' &&
                          <th className="text-white">Action</th>
                          }
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
                              <td>{travail.enseignant.name} {travail.enseignant.last_name} {travail.enseignant.first_name}</td>
                              <td>{travail.type_travail.name}</td>
                              <td>{travail.annee.name}</td>
                              {user && user.fonction.name === 'Elève' &&
                          <td>
                              <a href={`https://api.ecolapp.cd/public/Travaux/Questionnaires/${travail.fichier}`} className="btn btn-primary w-100 mb-2 mt-2">
                                <i className="bi bi-downolad"></i> Télécharger
                              </a>
                              <Link to={`/maternelle/deposer_travail_by_eleve/${travail.id_cours}/${travail.id}`} className="btn btn-success w-100 mb-2 mt-2">
                                Déposer mon travail
                              </Link>
                              </td>
                          }
                              {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                          <td>
                                  <Link to={`/maternelle/liste_travaux_deposes/${travail.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-warning text-white">
                                    Voir travaux déposés
                                  </Link>
                                </td>
                          }

                            </tr>
                        ) :

                        <tr>
                            <td colSpan="6" className="text-center">Aucun travail trouvé</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade show" id="eleves_classe" role="tabpanel" aria-labelledby="pills-home-tab">
                <div className="bg-white py-3 shadow mt-2 mb-2 u-style-59f7bcd2">
                  <div className="table-responsive container">
                    <h3 className="mb-4 text-primary">Liste des Élèves ({eleves.length})</h3>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Id</th>
                          {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                          <th>Matricule</th>
                          }
                          <th>Nom</th>
                          <th>Postnom</th>
                          <th>Prénom</th>
                          <th>Sexe</th>
                          {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                          <th>Action</th>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {eleves.map((eleve, index) =>
                        <tr key={eleve.id}>
                          <td>{index + 1}</td>
                            {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                          <td>{eleve.matricule}</td>
                          }
                            <td>{eleve.name}</td>
                            <td>{eleve.last_name}</td>
                            <td>{eleve.first_name}</td>
                            <td>{eleve.sexe}</td>
                            {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                          <td>
                                <Link target="_blank" rel="noopener noreferrer" to={`/maternelle/consulter_resultat/${eleve.id}`} className="btn btn-primary">Résultats</Link>
                              </td>
                          }
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade show" id="cotes_eleves" role="tabpanel" aria-labelledby="pills-home-tab">
              {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                <div className="bg-white py-3 shadow mt-2 mb-2 u-style-59f7bcd2">
                    <div className="container">
                    {user && (user.fonction.name === 'Enseignant' || user.fonction.name === 'Enseignante' || user.fonction.name === 'Administrateur' || user.fonction.name === 'Super Administrateur' || user.fonction.name === 'Administratrice' || user.fonction.name === 'Super Administratrice') &&
                    <div className="mb-4">
                          <h3 className="mb-4 text-primary">Afficher les cotes des élèves</h3>
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="periode">Période :</label>
                              <select
                            id="periode"
                            className="form-control"
                            value={selectedPeriode}
                            onChange={(e) => setSelectedPeriode(e.target.value)}>
                            
                                <option value="">-- Sélectionner une période --</option>
                                {periodes.map((periode) =>
                            <option key={periode.id} value={periode.id}>
                                    {periode.name}
                                  </option>
                            )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="cours">Cours :</label>
                              <select
                            id="cours"
                            className="form-control"
                            value={selectedCours}
                            onChange={(e) => setSelectedCours(e.target.value)}>
                            
                                <option value="">-- Sélectionner un cours --</option>
                                {cours.map((cour) =>
                            <option key={cour.id} value={cour.id}>
                                    {cour.name}
                                  </option>
                            )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <button className="btn btn-primary mt-4" onClick={handleFetchCotes}>
                                Voir les cotes
                              </button>
                            </div>
                          </div>
                      </div>
                    }

                      {cotes.length > 0 && cotes[0].total_general &&
                    <div className="mb-3 text-center">

                          <p><strong>Cotes des élèves de : </strong>{cotes[0].classe.name || 'Non précisée'}</p>
                          <p><strong>Cours : </strong>{cotes[0].cour.name}</p>
                          <p><strong>Période : </strong>{cotes[0].periode.name}</p>
                          <p><strong>Année scolaire : </strong>{cotes[0].annee.name}</p>
                          <p><strong>Total général : </strong>{cotes[0].total_general}</p>
                        </div>
                    }

                    {cotes.length > 0 &&
                    <div className="table-responsive mb-4">
                        <h3 className="text-primary">Cotes des élèves</h3>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Élève</th>
                              <th>Note obtenue / {cotes.length > 0 ? cotes[0].total_general : 'N/A'}</th>

                            </tr>
                          </thead>
                          <tbody>
                            {cotes.length > 0 ?
                          cotes.map((cote, index) =>
                          <tr key={cote.id}>
                                  <td>{index + 1}</td>
                                  <td>{cote.eleve.name} {cote.eleve.last_name} {cote.eleve.first_name}</td>
                                  <td>{cote.total_obtenu}</td>
                                
                                </tr>
                          ) :

                          <tr>
                                <td colSpan="4" className="text-center">Aucune cote disponible</td>
                              </tr>
                          }
                          </tbody>
                        </table>
                      </div>
                    } 
                    </div>
                  </div>
                }
              </div>
            </div>
            
            
        
          
          </div>
        </div>
      </div>
      <Footer />
      {isCoursVideoModalOpen &&
      <div className="custom-modal">
          <div className="modal-content">
            <h5 className="modal-title">Cours en vidéo</h5>
            <div className="mb-3">
              <label className="form-label">Sélectionnez un cours</label>
              <select
              className="form-control"
              value={selectedCoursVideo}
              onChange={(e) => setSelectedCoursVideo(e.target.value)}>
              
                <option value="">-- Choisir un cours --</option>
                {cours.map((c) =>
              <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
              )}
              </select>
            </div>
            <div className="modal-footer justify-content-between align-items-center d-flex">
              <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCoursVideoModalOpen(false)}>
              
                Annuler
              </button>
              <button
              className="btn btn-primary"
              onClick={handleCoursVideoSubmit}>
              
                Valider
              </button>
            </div>
          </div>
        </div>
      }
      <style jsx>{`
        .custom-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
        }
        .error-message {
          color: red;
          font-size: 14px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>);

};

export default MaClasse;
