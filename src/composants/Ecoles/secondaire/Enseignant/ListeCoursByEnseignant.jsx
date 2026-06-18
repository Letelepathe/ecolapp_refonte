import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from '../Users/Profil/NavbarTop';

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

    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(fileExtension)) {
      return (
        <video src={`https://api.ecolapp.cd/public/Cours/${file}`} controls style={{ height: '200px', width: '200px', objectFit: 'cover' }}></video>
      );
    }

    if (['mp3'].includes(fileExtension)) {
      return (
        <audio src={`https://api.ecolapp.cd/public/Cours/${file}`} controls style={{ height: '200px', width: '200px', objectFit: 'cover' }}></audio>
      );
    }

    if (['docx', 'doc', 'pdf'].includes(fileExtension)) {
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
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <Link className="btn btn-primary" to='/secondaire/ajouter_cours_by_enseignant'>Ajouter cours</Link>
        <h2 className="text-center mb-4 text-primary">Liste des Cours</h2>
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
              <th className='text-white'>Cours</th>
              <th className='text-white'>Classe</th>
              <th className='text-white'>Option</th>
              <th className='text-white'>Enseignant</th>
              <th className='text-white'>Année</th>
              <th className='text-white'>Action</th>
            </tr>
          </thead>
          <tbody>
            {coursFichier.length > 0 ? (
              coursFichier.map((cf, index) => (
                <tr key={cf.id}>
                  <td>{index + 1}</td>
                  <td>{renderFileCours(cf.fichier)}</td>
                  <td>{cf.titre}</td>
                  <td>{cf.description}</td>
                  <td>{cf.cour.name}</td>
                  <td>{cf.classe.name}</td>
                  <td>{cf.option.name}</td>
                  <td>{cf.enseignant.name} {cf.enseignant.last_name} {cf.enseignant.first_name}</td>
                  <td>{cf.annee.name}</td>
                  <td>
                    <a
                      className="btn btn-primary mt-2 mb-2 w-100"
                      href={`https://api.ecolapp.cd/public/Cours/${cf.fichier}`}
                    >
                      <i className="bi bi-download"></i> Télécharger
                    </a>
                    <Link onClick={() => handleDelete(cf.id)} className='btn btn-danger mt-2 mb-2 w-100'>Supprimer</Link>
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
  );
};

const ListeCoursByEnseignant = () => {
  const userId = localStorage.getItem("userId");
  return (
    <div>
      <div className="container-fluid position-relative bg-white d-flex p-0">
        <SidebarLeft />
        <div className="content">
          <NavbarTop />
          <CoursFichiers userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default ListeCoursByEnseignant;
