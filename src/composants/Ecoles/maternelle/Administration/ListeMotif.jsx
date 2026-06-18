import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeMotif = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [motifs, setMotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchMotifs = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/motif/ecole/${ecole_id}/direction/${direction}`);
        setMotifs(response.data.motifAll);
      } catch (error) {
        setError("Erreur lors de la récupération des motifs");
      } finally {
        setLoading(false);
      }
    };

    fetchMotifs();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/motif/delete/${id}`);
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
        <div className="container">
          <div className="table-responsive">
            <div className="justify-content-between align-items-center d-flex">
              <h6>Motifs de paiement</h6>
              <Link to='/maternelle/ajouter_motif' className="btn btn-primary mb-2 mt-2">Ajouter motif</Link>
            </div>
            {successMessage && <p className="text-success">{successMessage}</p>}
            {error && <p className="text-danger">{error}</p>}

            {loading ? (
                <div className="spinner"></div>
            ) : motifs.length > 0 ? (
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Motif</th>
                    <th>Montant</th>
                    <th>Devise</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {motifs.map((motif) => (
                    <tr key={motif.id}>
                      <td>{motif.name}</td>
                      <td>{motif.montant}</td>
                      <td>{motif.devise.name}</td>
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
  );
};

export default ListeMotif;
