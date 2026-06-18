import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeMotifAbsence = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [motifs, setMotifs] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchMotifs = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/motif_absence/ecole/${ecole_id}/direction/${direction}`);
        setMotifs(response.data.motifAll);
      } catch (error) {
        setError("Erreur lors de la récupération des motifs");
      }
    };

    fetchMotifs();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/motif_absence/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Motif supprimé avec succès !");
        setMotifs(motifs.filter((motif) => motif.id !== id));
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
                <div className='align-items-center justify-content-between d-flex'>
                  <h6>Liste motifs absence</h6>
                  <Link to='/primaire/ajouter_motif_absence' className="btn btn-primary mb-2 mt-2">Ajouter motif</Link>
                </div>
              </div>
              <div className="table-responsive">
                
                {successMessage && ( 
                    <p> {successMessage} </p>
                )}
                {error ? (
                  <p className="text-danger">{error}</p>
                ) : motifs.length > 0 ? (
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead>
                      <tr className="text-dark">
                        <th>Motif</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {motifs.map((motif) => (
                        <tr key={motif.id}>
                          <td>{motif.name}</td>
                          <td>
                            <Link onClick={() => handleDelete(motif.id)} className='btn btn-danger'>Supprimer</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucun motif trouvé.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeMotifAbsence;
