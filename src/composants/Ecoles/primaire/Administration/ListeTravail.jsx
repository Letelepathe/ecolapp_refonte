import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  {Link} from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeTravail = () => {
  const [travaux, setTravaux] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTravaux = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getTravail');
        setTravaux(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des travaux.");
      }
    };

    fetchTravaux();
  }, []);
  const renderFile = (file) => {
    const fileExtension = file.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`http://localhost/ecole-app/Travaux/Questionnaires/${file}`} alt="" width={50} />;
    }

    if (fileExtension === 'pdf') {
      return (
        <a
          href={`http://localhost/ecole-app/Travaux/Questionnaires/${file}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir PDF
        </a>
      );
    }

    return (
      <div>Aucun fichier trouvé</div>
    );
  };
  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
        <SidebarLeft/>
        <div className="content">
          <NavbarTop/>
          <div className="container mt-4">
            <Link className="btn btn-primary" to='/primaire/ajouter_travail'>Ajouter travail</Link>
            <h2 className="text-center mb-4 text-primary">Liste des Travaux</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className='text-white'>#</th>
                    <th className='text-white'>Fichier</th>
                    <th className='text-white'>Titre</th>
                    <th className='text-white'>Description</th>
                    <th className='text-white'>Date de remise</th>
                    <th className='text-white'>Cours</th>
                    <th className='text-white'>Classe</th>
                    <th className='text-white'>Enseignant</th>
                    <th className='text-white'>Type</th>
                    <th className='text-white'>Année</th>

                  </tr>
                </thead>
                <tbody>
                  {travaux.length > 0 ? (
                    travaux.map((travail, index) => (
                      <tr key={travail.id}>
                        <td>{index + 1}</td>
                        <td>{renderFile(travail.fichier)}</td>
                        <td>{travail.titre}</td>
                        <td>{travail.description}</td>
                        <td>{travail.date_remise}</td>
                        <td>{travail.nom}</td>
                        <td>{travail.nom_classe}</td>
                        <td>{travail.prenom_enseignant} {travail.nom_enseignant}</td>
                        <td>{travail.typeTravail}</td>
                        <td>{travail.annee}</td>
                        <td>
                         <a
                            className="btn btn-primary"
                            href={`http://localhost/ecole-app/apis/downloadTravail?file=${travail.fichier}`}
                          >
                            <i className="bi bi-download"></i> Télécharger
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
    </div>
  );
};

export default ListeTravail;
