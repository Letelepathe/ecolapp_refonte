import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeHoraire = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [horaires, setHoraires] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchHoraires = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/horaire/ecole/${ecole_id}/direction/${direction}`);
        setHoraires(response.data.horaireAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires", error);
      }
    };

    fetchHoraires();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/horaire/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Horaire supprimé avec succès !");
        setHoraires(horaires.filter((horaire) => horaire.id !== id));
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
    <SidebarLeft />
    <div className='content'>
      <NavbarTop />
      <div className="container mt-4">
        <Link to='/primaire/ajouter_horaire' className='btn mb-2'>Ajouter horaire</Link>
        <h3 className="text-center u-style-951c0e5f">Liste des Horaires</h3>
        {successMessage &&
          <p> {successMessage} </p>
          }
        {error &&
          <p> {error} </p>
          }
        <table className="table ">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Image</th>
              <th>Classe</th>
              <th>Option</th>
              <th>Année</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {horaires.map((horaire) => {
                return (
                  <tr key={horaire.id}>
                  <td>{horaire.title}</td>
                  <td>
                    <img
                        src={`https://api.ecolapp.cd/public/imgHoraire/${horaire.image}`}
                        alt={horaire.title}
                        width={50}
                        onError={(e) => e.target.style.display = 'none'} />
                      
                  </td>
                  <td>{horaire.classe.name}</td>
                  <td>{horaire.option.name}</td>
                  <td>{horaire.annee.name}</td>
                  <td>
                    <Link onClick={() => handleDelete(horaire.id)} className='btn '>Supprimer</Link>
                  </td>
                </tr>);

              })}
          </tbody>
        </table>
      </div>
    </div>
   </div>);

};

export default ListeHoraire;
