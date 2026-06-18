import React, { useEffect, useState } from "react";
import axios from "axios";
import  {Link} from 'react-router-dom';

import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from  '../Users/Profil/NavbarTop';

const ListeTravailByEleve = () => {
  const [travaux_eleve, setTravauxEleve] = useState([]);
  const [message, setMessage] = useState("");
  const users_id = localStorage.getItem('userId');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTravauxEleve = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/travailEffectue/user/eleve/${users_id}`);
        if (response.data.success) {
          setTravauxEleve(response.data.travaux);
        } else {
          setMessage("Aucun travail trouvé.");
        }
        console.log(response.data);
      } catch (error) {
        console.log("Erreur de connexion au serveur.");
      }
    };

    fetchTravauxEleve();
  }, [users_id]);

  const renderFileEleve = (file) => {
    const fileExtension = file.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${file}`} alt="" width={50} />;
    }

    if (fileExtension === 'pdf') {
      return (
        <a
          href={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${file}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir PDF
        </a>
      );
    }

    return <div>Aucun fichier trouvé</div>;
  };

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/travailEffectue/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Travail supprimé avec succès !");
        setTravauxEleve(travaux_eleve.filter((travail) => travail.id !== id));
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
        <div className="container mt-5">
          <h2 className="text-primary">Mes Travaux Déposés ({travaux_eleve.length})</h2>
          {successMessage && ( 
                <p> {successMessage} </p>
          )}
          {error && <p className="text-danger text-center">{error}</p>}
          {message && <div className="alert alert-info">{message}</div>}
          <table className="table table-bordered table-hover mt-3">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Cours</th>
                <th>Description du Travail</th>
                <th>Fichier</th>
                <th>Date de Dépôt</th>
                <th>Télécharger</th>
              </tr>
            </thead>
            <tbody>
              {travaux_eleve.map((travail_eleve, index) => (
                <tr key={travail_eleve.id}>
                  <td>{index + 1}</td>
                  <td>{travail_eleve.cour.name}</td>
                  <td>{travail_eleve.description}</td>
                  <td>{renderFileEleve(travail_eleve.fichier)}</td>
                  <td>{travail_eleve.date_depot}</td>
                  <td>
                    <a
                      className="btn btn-warning text-white w-100 mb-2 mt-2"
                      href={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${travail_eleve.fichier}`}
                    >
                      Lire
                    </a>
                    <Link onClick={() => handleDelete(travail_eleve.id)} className='btn btn-danger mt-2 mb-2 w-100'>Supprimer</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListeTravailByEleve;
