import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeTrimestre = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [semestres, setSemestres] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchSemestres = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/semestre/ecole/${ecole_id}/direction/${direction}`);
        setSemestres(response.data.semestreAll);
      } catch (error) {
        setError("Erreur lors de la récupération des semestres");
      }
    };

    fetchSemestres();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/semestre/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Semestre supprimé avec succès !");
        setSemestres(semestres.filter((semestre) => semestre.id !== id));
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
            <div className='d-flex justify-content-between align-items-center'>
              <h6>Liste trimestres</h6>
              <Link to='/primaire/ajouter_trimestre' className='btn '>Ajouter trimestre</Link>
            </div>
            {successMessage && ( 
                <p> {successMessage} </p>
            )}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : semestres.length > 0 ? (
              <table className="table text-start align-middle   mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Semestre</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {semestres.map((semestre) => (
                    <tr key={semestre.id}>
                      <td>{semestre.name}</td>
                      <td>
                          <Link onClick={() => handleDelete(semestre.id)} className='btn '>Supprimer</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun trimestre trouvé.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeTrimestre;
