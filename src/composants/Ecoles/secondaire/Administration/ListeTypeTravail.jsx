import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeTypeTravail = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [typetravails, setTypeTravails] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchTypeTravails = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/typeTravail/ecole/${ecole_id}/direction/${direction}`);
        setTypeTravails(response.data.typetravailAll);
      } catch (error) {
        setError("Erreur lors de la récupération des tranches");
      }
    };

    fetchTypeTravails();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/typeTravail/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Type de travail supprimé avec succès !");
        setTypeTravails(typetravails.filter((tp) => tp.id !== id));
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
          <div className="table-responsive">
            <Link to='/secondaire/ajouter_type_travail'>Ajouter type travail </Link>
            {successMessage && ( 
                <p> {successMessage} </p>
            )}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : typetravails.length > 0 ? (
              <table className="table text-start align-middle   mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Type travail</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {typetravails.map((tp) => (
                    <tr key={tp.id}>
                      <td>{tp.name}</td>
                      <td>
                          <Link onClick={() => handleDelete(tp.id)} className='btn '>Supprimer</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun type de travail trouvé.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeTypeTravail;
