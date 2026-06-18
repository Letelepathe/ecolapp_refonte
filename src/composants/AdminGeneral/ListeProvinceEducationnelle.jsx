import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeProvinceEducationnelle = () => {
  const [provincesEducationnelles, setProvincesEducationnelles] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProvincesEducationnelles();
  }, []);

  const fetchProvincesEducationnelles = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/provinceEducationnelle?page=${page}`);
      setProvincesEducationnelles(response.data.provincesEducationnelles.data);
      setTotalPages(response.data.provincesEducationnelles.last_page);
      setCurrentPage(page);
    } catch (error) {
      setError("Erreur lors de la récupération des provinces éducationnelles");
    }
  };

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/provinceEducationnelle/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Province éducationnelle supprimée avec succès !");
        fetchProvincesEducationnelles(currentPage);
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
      fetchProvincesEducationnelles(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchProvincesEducationnelles(currentPage - 1);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Liste provinces éducationnelles</h6>
            <Link to='/admin-general/ajouter_province_educationnelle' className="btn btn-primary">Ajouter province éducationnelle</Link>
          </div>
          <div className="table-responsive">
            {successMessage && <p className="text-success">{successMessage}</p>}
            {error && <p className="text-danger">{error}</p>}
            {provincesEducationnelles.length > 0 ? (
              <>
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th>Province Éducationnelle</th>
                      <th>Province</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provincesEducationnelles.map((provinceEducationnelle) => (
                      <tr key={provinceEducationnelle.id}>
                        <td>{provinceEducationnelle.name}</td>
                        <td>{provinceEducationnelle.province?.name}</td>
                        <td>
                          <button onClick={() => handleDelete(provinceEducationnelle.id)} className='btn btn-danger'>Supprimer</button>
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
              <p>Aucune province éducationnelle trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeProvinceEducationnelle;