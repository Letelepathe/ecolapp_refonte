import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeModePaiement = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [modes, setModes] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchModes = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/mode_paiement/ecole/${ecole_id}/direction/${direction}`);
        setModes(response.data.modePaiementAll);
      } catch (error) {
        setError("Erreur lors de la récupération des modes");
      }
    };

    fetchModes();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/mode_paiement/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Mode supprimé avec succès !");
        setModes(modes.filter((mode) => mode.id !== id));
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
          <div className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8 col-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="justify-content-between align-items-center d-flex">
                    <h6>Liste mode paiement</h6>
                    <Link to='/primaire/ajouter_mode_paiement' className='btn btn-primary mb-2 mt-2'>Ajouter</Link>
                  </div>
                </div>
                <div className="table-responsive">
                    <Link to='/primaire/ajouter_mode_paiement' className="btn btn-primary mb-2 mt-2">Ajouter mode</Link>
                    {successMessage && ( 
                        <p> {successMessage} </p>
                    )}
                    {error ? (
                      <p className="text-danger">{error}</p>
                    ) : modes.length > 0 ? (
                      <table className="table text-start align-middle table-bordered table-hover mb-0">
                        <thead>
                          <tr className="text-dark">
                            <th>Mode</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modes.map((mode) => (
                            <tr key={mode.id}>
                              <td>{mode.name}</td>
                              <td>
                                <Link onClick={() => handleDelete(mode.id)} className='btn btn-danger'>Supprimer</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Aucun mode trouvé.</p>
                    )}
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ListeModePaiement;
