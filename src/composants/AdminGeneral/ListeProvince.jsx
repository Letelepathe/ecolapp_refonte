import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeProvince = () => {
  const [provinces, setProvinces] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/province?page=${page}`);
      setProvinces(response.data.provinces.data);
      setTotalPages(response.data.provinces.last_page);
      setCurrentPage(page);
    } catch (error) {
      setError("Erreur lors de la récupération des provinces");
    }
  };

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/province/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Province supprimée avec succès !");
        fetchProvinces(currentPage);
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
      fetchProvinces(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchProvinces(currentPage - 1);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Liste provinces</h6>
            <Link to='/admin-general/ajouter_province' className="btn btn-primary">Ajouter province</Link>
          </div>
          <div className="table-responsive">
            {successMessage && <p className="text-success">{successMessage}</p>}
            {error && <p className="text-danger">{error}</p>}
            {provinces.length > 0 ? (
              <>
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th>Id</th>
                      <th>Province</th>
                      <th>Provinces éducationnelles</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provinces.map((province, index) => (
                      <tr key={province.id}>
                        <td>{index + 1}</td>
                        <td>{province.name}</td>
                        <td>
                          {province.provinces_educationnelles.length > 0 ? (
                            <ul>
                              {province.provinces_educationnelles.map((pe) => (
                                <li>
                                  {pe.name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div>Aucune provinces éducationnelles</div>
                          )}
                        </td>
                        <td>
                          <button onClick={() => handleDelete(province.id)} className='btn btn-danger'>Supprimer</button>
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
              <p>Aucune province trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeProvince;