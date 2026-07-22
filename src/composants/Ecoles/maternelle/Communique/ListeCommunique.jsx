import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";

const ListeCommuniques = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [communiques, setCommuniques] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommunique, setSelectedCommunique] = useState(null);

  // Récupérer la liste des communiqués
  useEffect(() => {
    const fetchCommuniques = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/communique/ecole/${ecole_id}/direction/${direction}`);
        setCommuniques(response.data.communiqueAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des communiqués", error);
      }
    };

    fetchCommuniques();
  }, [ecole_id, direction]);

  // Affichage du fichier (image ou PDF)
  const renderFile = (file) => {
    if (!file) return <span>Aucun fichier</span>;

    const fileExtension = file.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={`https://api.ecolapp.cd/public/imgCommunique/${file}`} alt="Communiqué visuel" width={50} />;
    }
    if (fileExtension === 'pdf') {
      return <a href={`https://api.ecolapp.cd/public/imgCommunique/${file}`} target="_blank" rel="noopener noreferrer">Voir PDF</a>;
    }
    return <a href={`https://api.ecolapp.cd/public/imgCommunique/${file}`} target="_blank" rel="noopener noreferrer">Télécharger le fichier</a>;
  };

  // Gestion de la suppression d'un communiqué
  const handleDeleteConfirmation = (communique) => {
    setSelectedCommunique(communique);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (selectedCommunique) {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/communique/delete/${selectedCommunique.id}`);
        if (response.data.status === 200) {
          setCommuniques((prev) => prev.filter((c) => c.id !== selectedCommunique.id));
        } else {
          alert("Erreur : " + response.data.status_msg);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
        alert("Une erreur s'est produite lors de la suppression.");
      } finally {
        setShowModal(false);
        setSelectedCommunique(null);
      }
    }
  };


  return (
    <div className='container-fluid position-relative  d-flex p-0'>
      <SidebarLeft />
      <div className='content'>
        <NavbarTop />
        <div className="container mt-2">
          <div className='d-flex justify-content-between align-items-center'>
           <Link to='/maternelle/lancer_communique' className='btn  mb-2 mt-2'>Lancer communiqué</Link>
           <h6 className="text-center u-style-951c0e5f">Liste des Communiqués</h6>
          </div>
          <div classname='table-responsive'>
            <table className="table ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titre</th>
                  <th>Contenu</th>
                  <th>Fichier</th>
                  <th>Rédacteur</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {communiques.map((communique, index) =>
                <tr key={communique.id}>
                    <td>{index + 1}</td>
                    <td>{communique.title}</td>
                    <td>{communique.content}</td>
                    <td>{renderFile(communique.file)}</td> 
                    <td>{communique.user ? `${communique.user.name} ${communique.user.first_name}` : 'Utilisateur inconnu'}</td>
                    <td>
                    {new Date(communique.created_at).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    </td>
                    <td>
                  
                      <button className="btn   mt-2 mb-2 w-100" onClick={() => handleDeleteConfirmation(communique)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal de confirmation de suppression */}
          {showModal &&
          <div className="modal fade show d-block u-style-b3b7dcda">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirmation de suppression</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p>Voulez-vous vraiment supprimer le communiqué <strong>{selectedCommunique.title}</strong> ?</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn " onClick={() => setShowModal(false)}>
                      Annuler
                    </button>
                    <button type="button" className="btn " onClick={handleDelete}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

         
        </div>
      </div>
    </div>);

};

export default ListeCommuniques;
