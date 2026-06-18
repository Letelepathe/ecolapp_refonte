import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeCours = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [cours, setCours] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cours/ecole/${ecole_id}/direction/${direction}`);
        setCours(response.data.coursAll || []); 
        console.log("Données reçues :", response.data.coursAll || []);
      } catch (error) {
        console.error("Erreur API :", error.response || error.message || error);
        setError("Erreur lors de la récupération des données");
      }
    };

    fetchCours();
  }, [ecole_id, direction]);

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container-fluid pt-4 px-4">
          <div className="bg-white text-center rounded p-4">
            <div className='d-flex justify-content-between align-items-center'>
             <h6 className="mb-4">Liste des Cours</h6>
             <Link to="/secondaire/ajouter_cours" className='btn btn-warning text-white'>Ajouter cours</Link>
            </div>
            <div className="table-responsive">
              {error ? (
                <p className="text-danger">{error}</p>
              ) : cours.length > 0 ? (
                <table className="table text-start align-middle table-bordered table-hover mb-0">
                  <thead>
                    <tr className="text-dark">
                      <th>Nom</th>
                      <th>Pondération</th>
                      <th>Classe</th>
                      <th>Option</th>
                      <th>Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cours.map((cour) => (
                      <tr key={cour.id}>
                        <td>{cour.name || 'N/A'}</td>
                        <td>{cour.ponderation || 'N/A'}</td>
                        <td>{cour.classe?.name || 'Non spécifiée'}</td>
                        <td>{cour.option?.name || 'Non spécifiée'}</td>
                        <td>{cour.option?.section?.name || 'Non spécifiée'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucun cours trouvé.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeCours;
