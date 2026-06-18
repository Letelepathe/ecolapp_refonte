import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeTranche = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [tranches, setTranches] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchTranches = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/tranche/ecole/${ecole_id}/direction/${direction}`);
        setTranches(response.data.trancheAll);
      } catch (error) {
        setError("Erreur lors de la récupération des tranches");
      }
    };

    fetchTranches();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/tranche/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Tranche supprimée avec succès !");
        setTranches(tranches.filter((tranche) => tranche.id !== id));
      } else {
        setError(response.data.status_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container">
          <div className="justify-content-between align-items-center d-flex">
            <h3 className='text-primary'>Les tranches</h3>
            <Link to='/secondaire/ajouter_tranche' className='btn btn-primary'><i className='bi bi-plus'></i> Ajouter tranche</Link>
          </div>
          <div className="table-responsive">
            
            {successMessage && ( 
                <p> {successMessage} </p>
            )}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : tranches.length > 0 ? (
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Tranche</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tranches.map((tranche) => (
                    <tr key={tranche.id}>
                      <td>{tranche.name}</td>
                      <td>
                          <Link onClick={() => handleDelete(tranche.id)} className='btn btn-danger'>Supprimer</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune tranche trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeTranche;
