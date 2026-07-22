import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeTitulaire = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [titulaires, setTitulaires] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchTitulaires = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/titulaire/ecole/${ecole_id}/direction/${direction}`);
        setTitulaires(response.data.titulaires);
        console.log(response.data.titulaires);
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
      const response = await axios.get(`https://api.ecolapp.cd/api/titulaire/delete/${id}`);
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
            <h3 className="mb-0 text-primary text-center">Titulaires</h3>
            <Link to='/secondaire/ajouter_titulaire' className='btn '>Ajouter titulaire</Link>
          </div>
          <div className="table-responsive">
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <table className="table text-start align-middle   mb-0">
              <thead>
                <tr className="text-dark">
                  <th>Id</th>
                  <th>Photo</th>
                  <th>Nom</th>
                  <th>Postnom</th>
                  <th>Prénom</th>
                  <th>Sexe</th>
                  <th>Classe</th>
                  <th>Option</th>
                  <th>Année</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {titulaires.map((titulaire, index) =>
                <tr key={titulaire.id}>
                    <td>{titulaire.id}</td>
                    <td>
                      <img
                      src={`https://api.ecolapp.cd/public/imgUser/${titulaire.user.file}`}
                      className="rounded-circle flex-shrink-0 u-style-31bd8151"
                      alt="Profil" />

                    
                    </td>
                    <td>{titulaire.user.name}</td>
                    <td>{titulaire.user.last_name}</td>
                    <td>{titulaire.user.first_name}</td>
                    <td>{titulaire.user.sexe}</td>
                    <td>{titulaire.classe.name}</td>
                    <td>{titulaire.option.name}</td>
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

export default ListeTitulaire;
