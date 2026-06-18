import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from '../Users/Profil/NavbarTop';


const Travaux = ({userId}) =>{
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

  return(
    <div>
       <div className="container mt-4">
          <div className="justify-content-between align-items-center d-flex">
            <h5 className="text-center mb-4 text-primary">Liste des Travaux</h5>
            <Link className="btn btn-primary" to='/primaire/ajouter_travail_by_enseignant'>Ajouter travail</Link>
          </div>
          {successMessage && (
            <p>{successMessage}</p>
          )}
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
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
                {travaux.length > 0 ? (
                  travaux.map((travail, index) => (
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
                          className="btn btn-primary mt-2 mb-2 w-100"
                          href={`https://api.ecolapp.cd/public/Travaux/Questionnaires/${travail.fichier}`}
                        >
                          <i className="bi bi-download"></i> Télécharger
                        </a>
                        <Link to={`/primaire/liste_travaux_deposes/${travail.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-warning mt-2 mb-2 w-100 text-white">
                          Voir travaux déposés
                        </Link>
                        <Link onClick={() => handleDelete(travail.id)} className='btn btn-danger mt-2 mb-2 w-100'>Supprimer</Link>
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
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>
                Précédent
              </button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button className="btn btn-secondary" onClick={nextPage} disabled={currentPage === totalPages}>
                Suivant
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};


const ListeTravailByEnseignant = () => {
  const userId = localStorage.getItem("userId");

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <Travaux userId={userId}/>
      </div>
    </div>
  );
};

export default ListeTravailByEnseignant;
