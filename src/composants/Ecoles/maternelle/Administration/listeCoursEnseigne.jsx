import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeCoursEnseigne = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [titulaires, setTitulaires] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchDevises = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/coursens/ecole/${ecole_id}/direction/${direction}`);
        setTitulaires(response.data.courEns);
        console.log(response.data.courEns);
        setError('');
      } catch (error) {
        setError("Erreur lors de la récupération des tranches");
      }
    };

    fetchDevises();
  }, [ecole_id, direction]);

  useEffect(() => {
    const fetchTitulaires = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/coursens/ecole/${ecole_id}/direction/${direction}`);
        setTitulaires(response.data.courEns);
        console.log(response.data.courEns);
        setError('');
      } catch (error) {
        setError("Erreur lors de la récupération des données");
        setTitulaires([]);
      }
    };
    fetchTitulaires();
  }, [ecole_id, direction]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/coursens/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage(response.data.status_msg);
        setTitulaires(titulaires.filter((titulaire) => titulaire.id !== id));
      } else {
        console.log(response.data);
        setError(response.data.message);
      }
    } catch (error) {
      setError("Erreur lors de la suppression du titulaire");
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className=" text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0 text-primary text-center">Titulaires cours</h6>
            <Link to='/maternelle/ajouter_cours_enseigne' className='btn '>Ajouter titulaire</Link>
          </div>
          <div className="table-responsive">
           {error && <p className="text-danger">{error}</p>}
           {successMessage && <p className="text-success">{successMessage}</p>}
            
            <table className="table text-start align-middle   mb-0">
              <thead>
                <tr className="text-dark">
                  <th>Id</th>
                  <th>Cours</th>
                  <th>Photo titulaire</th>
                  <th>Titulaire</th>
                  <th>Sexe</th>
                  <th>Classe</th>
                  <th>Option</th>
                  <th>Année</th>
                  <th>Action</th>
            
                </tr>
              </thead>
              <tbody>
                {titulaires.map((titulaire, index) =>
                <tr key={titulaire.id}>
                    <td>{titulaire.id}</td>
                    <td>{titulaire.cour.name}</td>
                    <td>
                      <img
                      src={`https://api.ecolapp.cd/public/imgUser/${titulaire.user.file}`}
                      className="rounded-circle flex-shrink-0 u-style-31bd8151"
                      alt="Profil" />

                    
                    </td>
                    <td>{titulaire.user.name} {titulaire.user.last_name} {titulaire.user.first_name}</td>
                    <td>{titulaire.user.sexe}</td>
                    <td>{titulaire.cour.classe.name}</td>
                    <td>{titulaire.cour.option.name}</td>
                    <td>{titulaire.annee.name}</td>
                    <td>
                     <button
                      className="btn  "
                      onClick={(e) => handleDelete(titulaire.id, e)}>
                      
                        Supprimer
                      </button>
                    </td>
                    
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);

};

export default ListeCoursEnseigne;
