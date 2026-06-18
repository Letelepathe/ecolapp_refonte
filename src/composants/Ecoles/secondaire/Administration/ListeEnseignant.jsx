import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeEnseignant = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [enseignants, setEnseignants] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/all/ecole/${ecole_id}/direction/${direction}`);
        setEnseignants(response.data.enseignants);
        setError('');
      } catch (error) {
        setError("Erreur lors de la récupération des données");
        setEnseignants([]);
      }
    };
    fetchEnseignants();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/user/edit/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage(response.data.status_msg);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError("Erreur lors de la suppression de l'enseignant");
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container mt-4">
          <Link className="btn btn-primary mb-2" to='/secondaire/creationcompte'>Ajouter enseignant</Link>
          <h3 className="mb-0 text-primary text-center">Enseigants du secondaire</h3>
      
          <div className="table-responsive">
            {error ?
            <p className="text-danger">{error}</p> :
            successMessage ?
            <p className="text-success">{successMessage}</p> :
            null}
            
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th>Id</th>
                  <th>Photo</th>
                  <th>Nom</th>
                  <th>Postnom</th>
                  <th>Prénom</th>
                  <th>Sexe</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enseignants.map((enseignant, index) =>
                <tr key={enseignant.id}>
                    <td>{index + 1}</td>
                    <td>
                       <img
                      src={`https://api.ecolapp.cd/public/imgUser/${enseignant.file}`}
                      className="rounded-circle flex-shrink-0 u-style-31bd8151"
                      alt="Profil" />

                    
                    </td>
                    <td>{enseignant.name}</td>
                    <td>{enseignant.last_name}</td>
                    <td>{enseignant.first_name}</td>
                    <td>{enseignant.sexe}</td>
                    <td>
                      <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(enseignant.id)}>
                      
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

export default ListeEnseignant;
