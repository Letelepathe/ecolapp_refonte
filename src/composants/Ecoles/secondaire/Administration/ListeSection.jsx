import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeSection = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/section/ecole/${ecole_id}/direction/${direction}`);
        setSections(response.data.sectionsAll);
      } catch (error) {
        setError("Erreur lors de la récupération des sections");
      }
    };

    fetchSections();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/section/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Section supprimée avec succès !");
        setSections(sections.filter((section) => section.id !== id));
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
              <h6>Liste section</h6>
              <Link to='/secondaire/ajouter_section' className='btn  text-white'>Ajouter section</Link>
            </div>
            <div className="section d-flex flex-column align-items-center justify-content-center py-4">
              <div className="col-lg-6 col-md-8">
                <div className="card mb-3">
                  {successMessage && ( 
                      <p> {successMessage} </p>
                  )}
                  {error ? (
                    <p className="text-danger">{error}</p>
                  ) : sections.length > 0 ? (
                    <table className="table text-start align-middle   mb-0">
                      <thead>
                        <tr className="text-dark">
                          <th>Section</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sections.map((section) => (
                          <tr key={section.id}>
                            <td>{section.name}</td>
                            <td>
                                <Link onClick={() => handleDelete(section.id)} className='btn '>Supprimer</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Aucune section trouvée.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeSection;
