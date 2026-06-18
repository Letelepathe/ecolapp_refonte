import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeFonction = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [fonctions, setFonctions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchFonctions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/fonction/ecole/${ecole_id}/direction/${direction}`);
        setFonctions(response.data.fonctionAll);
      } catch (error) {
        setError("Erreur lors de la récupération des fonctions");
      }
    };

    fetchFonctions();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/fonction/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Fonction supprimée avec succès !");
        setFonctions(fonctions.filter((fonction) => fonction.id !== id));
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
            <Link to='/primaire/ajouter_fonction' className='btn btn-primary mb-2 mt-2'>Ajouter fonction</Link>
            {successMessage && ( 
                <p> {successMessage} </p>
            )}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : fonctions.length > 0 ? (
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Fonction</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fonctions.map((fonction) => (
                    <tr key={fonction.id}>
                      <td>{fonction.name}</td>
                      <td>
                          <Link onClick={() => handleDelete(fonction.id)} className='btn btn-danger'>Supprimer</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune fonction trouvée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeFonction;
