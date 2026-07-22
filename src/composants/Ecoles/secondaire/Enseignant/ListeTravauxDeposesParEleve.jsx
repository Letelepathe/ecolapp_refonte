import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from  '../Users/Profil/NavbarTop';

const ListeTravauxDeposesParEleve = () => {
  const { id_travail } = useParams(); // Récupère l'id du travail depuis l'URL
  const [travaux, setTravaux] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTravaux = async () => {
      try {
        const response = await axios.get(
          `https://api.ecolapp.cd/api/travailEffectue/eleves/travail/${id_travail}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setTravaux(response.data.travaux);
        } else {
          setMessage(response.data.message || "Aucun travail trouvé.");
        }
        console.log(response.data);
      } catch (error) {
        setMessage("Erreur de connexion au serveur.");
      }
    };

    fetchTravaux();
  }, [id_travail]);

  const renderFile = (file) => {
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

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container mt-5">
          <h2 className="text-primary">Travaux Déposés pour le Travail #{id_travail}</h2>
          {message && <div className="alert alert-info">{message}</div>}
          <table className="table   mt-3">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Élève</th>
                <th>Description</th>
                <th>Fichier</th>
                <th>Date de Dépôt</th>
                <th>Télécharger</th>
              </tr>
            </thead>
            <tbody>
              {travaux.length > 0 ? (
                travaux.map((travail, index) => (
                  <tr key={travail.id}>
                    <td>{index + 1}</td>
                    <td>{travail.eleve.name} {travail.eleve.last_name} {travail.eleve.first_name}</td>
                    <td>{travail.description}</td>
                    <td>{renderFile(travail.fichier)}</td>
                    <td>{travail.date_depot}</td>
                    <td>
                      <a
                        className="btn  w-100 mb-2 mt-2"
                        href={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${travail.fichier}`}
                      >
                        <i className="bi bi-download"></i> Télécharger
                      </a>
                      <a
                        className="btn  text-white w-100 mb-2 mt-2"
                        href={`https://api.ecolapp.cd/public/Travaux/DepotByEleve/${travail.fichier}`}
                      >
                        Lire
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Aucun travail trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListeTravauxDeposesParEleve;
