import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeDevise = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [devises, setDevises] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchDevises = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/devise/ecole/${ecole_id}/direction/${direction}`);
        setDevises(response.data.deviseAll);
      } catch (error) {
        setError("Erreur lors de la récupération des tranches");
      }
    };

    fetchDevises();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/devise/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Devise supprimée avec succès !");
        setDevises(devises.filter((devise) => devise.id !== id));
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
          <div className="table-responsive">
            <Link to='/primaire/ajouter_devise' className='btn btn-primary mb-2 mt-2'>Ajouter devise</Link>
            {successMessage && ( 
                <p> {successMessage} </p>
            )}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : devises.length > 0 ? (
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Devise</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {devises.map((devise) => (
                    <tr key={devise.id}>
                      <td>{devise.name}</td>
                      <td>
                          <Link onClick={() => handleDelete(devise.id)} className='btn btn-danger'>Supprimer</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune devise trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeDevise;
