import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeClasse = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`);
        setClasses(response.data.classesAll);
      } catch (error) {
        setError("Erreur lors de la récupération des classes");
      }
    };

    fetchClasses();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/classe/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Classe supprimée avec succès !");
        setClasses(classes.filter((classe) => classe.id !== id));
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
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container">
          <section className="section">
            <div className='d-flex justify-content-between align-items-center'>
             <h6 className='mb-4'>Liste classes</h6>
             <Link to='/primaire/ajouter_classe' className='btn btn-primary mb-2 mt-2'>Ajouter classe</Link>
            </div>
            <div className="table-responsive">
              {error && (
                <p className="text-danger">{error}</p>
              )}
              {successMessage && ( 
                <p> {successMessage} </p>
              )}
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th>Id</th>
                      <th>Classe</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classe) => (
                      <tr key={classe.id}>
                        <td>{classe.id}</td>
                        <td>{classe.name}</td>
                        <td>
                          <Link onClick={() => handleDelete(classe.id)} className='btn btn-danger'>Supprimer</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ListeClasse;
