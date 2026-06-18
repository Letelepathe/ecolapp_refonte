import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeEcole = () => {
  const [ecoles, setEcoles] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEcoles();
  }, []);

  const fetchEcoles = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/ecole?page=${page}`);
      setEcoles(response.data.ecoles.data);
      setTotalPages(response.data.ecoles.last_page);
      setCurrentPage(page);
    } catch (error) {
      setError("Erreur lors de la récupération des écoles");
    }
  };

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/ecole/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("École supprimée avec succès !");
        fetchEcoles(currentPage);
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
      fetchEcoles(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchEcoles(currentPage - 1);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <h6>Liste des Écoles</h6>
            <Link to='/admin-general/ajouter_ecole' className="btn btn-primary">Ajouter école</Link>
          </div>
          <div className="table-responsive">
            {successMessage && <p className="text-success">{successMessage}</p>}
            {error && <p className="text-danger">{error}</p>}
            {ecoles.length > 0 ? (
              <>
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th>Id</th>
                      <th>Photo</th>
                      <th>École</th>
                      <th>Province</th>
                      <th>Province Éducationnelle</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ecoles.map((ecole, index) => (
                      <tr key={ecole.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="photo-container w-100">
                            <img
                              src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`}
                              alt={`${ecole.name}`}
                              className=""
                              style={{
                                objectFit: 'cover',
                                height:'80px',
                                width:'80px',
                                borderRadius:'50%',
                              }}
                            />
                          </div>
                        </td>
                        <td>{ecole.name}</td>
                        <td>{ecole.province_educationnelle?.province?.name}</td>
                        <td>{ecole.province_educationnelle?.name}</td>
                        <td className='d-flex justify-content-center align-ites-center'>
                          <Link className='btn btn-warning text-white mt-1 mb-1 me-2' to={`/admin-general/creer_super_admin_ecole/${ecole.id}`}> Créer admin</Link>
                          <Link className='btn btn-primary text-white mt-1 mb-1 me-2' to={`/ecole/choix_direction/${ecole.id}`} target='_blank' rel='noopener noreferrer'> Explorer</Link>
                          <button onClick={() => handleDelete(ecole.id)} className='btn btn-danger mt-1 mb-1'>Supprimer</button>
                        </td>
                      </tr>
                    ))}
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
              </>
            ) : (
              <p>Aucune école trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeEcole;