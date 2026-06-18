import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeAnnee = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [annees, setAnnees] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchAnnees = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/annee/ecole/${ecole_id}/direction/${direction}`);
        setAnnees(response.data.anneeAll);
      } catch (error) {
        setError("Erreur lors de la récupération des tranches");
      }
    };

    fetchAnnees();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/annee/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Année supprimée avec succès !");
      } else {
        setError(response.data.status_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur de connexion au serveur.");
    }
  };

  const handleActiver = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/annee/activer/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Année activée avec succès !");
      } else {
        setError(response.data.status_msg || "Erreur lors de l'activation.");
      }
    } catch (error) {
      console.error("Erreur lors de l'activation :", error);
      setError("Erreur de connexion au serveur.");
    }
  };


  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="section d-flex flex-column align-items-center justify-content-center py-4">
          <div className="col-lg-6 col-md-8 col-12">
            <div className="card mb-3">
              <div className="card-body">
                <div className="justify-content-between align-items-center d-flex">
                  <h6>Liste années</h6>
                  <Link to='/secondaire/ajouter_annee_scolaire' className='btn btn-primary mb-2 mt-2'>Ajouter année</Link>
                </div>
              </div>
              <div className="table-responsive">
                
                {successMessage && ( 
                    <p> {successMessage} </p>
                )}
                {error && (
                  <p className="text-danger">{error}</p>
                )} 
                {annees.length > 0 ? (
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead>
                      <tr className="text-dark">
                        <th>Année scolaire</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annees.map((annee) => (
                        <tr key={annee.id}>
                          <td>{annee.name}</td>
                          <td>
                            <div className='justify-content-between align-itmes-center d-flex'>
                              {annee.status !== undefined && Number(annee.status) === 0 && (
                                <Link onClick={() => handleActiver(annee.id)} className='btn btn-primary w-100'>Activer</Link>
                              )}
                              {annee.status !== undefined && Number(annee.status) === 1 && (
                                <Link onClick={() => handleDelete(annee.id)} className='btn btn-danger w-100'>Désactiver</Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune année trouvée.</p>
                )}
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeAnnee;
