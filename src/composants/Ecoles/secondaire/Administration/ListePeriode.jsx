import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListePeriode = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [periodes, setPeriodes] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/periode/ecole/${ecole_id}/direction/${direction}`);
        setPeriodes(response.data.periodeAll);
      } catch (error) {
        setError("Erreur lors de la récupération des périodes");
      }
    };

    fetchSections();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/periode/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Période supprimée avec succès !");
        setPeriodes(periodes.filter((periode) => periode.id !== id));
      } else {
        setError(response.data.status_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Liste périodes</h6>
            <Link to='/secondaire/ajouter_periode' className="btn ">Ajouter Période</Link>
          </div>
          <div className="table-responsive">
            
            {successMessage && ( 
                <p> {successMessage} </p>
            )}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : periodes.length > 0 ? (
              <table className="table text-start align-middle   mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Période</th>
                    <th>Semestre</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {periodes.map((periode) => (
                    <tr key={periode.id}>
                      <td>{periode.name}</td>
                      <td>{periode.semestre.name}</td>
                      <td>
                          <Link onClick={() => handleDelete(periode.id)} className='btn '>Supprimer</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune période trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListePeriode;
