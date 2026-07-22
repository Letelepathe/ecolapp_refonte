import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeContact = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages

  // Fonction pour récupérer les contacts avec pagination
  const fetchContacts = useCallback(async (page = 1) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/contact/ecole/${ecole_id}/direction/${direction}?page=${page}`);
      setContacts(response.data.contact.data); // Les données paginées
      setTotalPages(response.data.contact.last_page); // Nombre total de pages
      setCurrentPage(page); // Met à jour la page actuelle
    } catch (error) {
      setError("Erreur lors de la récupération des données");
    }
  }, [ecole_id, direction]);

  useEffect(() => {
    fetchContacts(); // Charger les contacts lors du montage
  }, [ecole_id, direction, fetchContacts]);

  // Fonction pour passer à la page suivante
  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchContacts(currentPage + 1);
    }
  };

  // Fonction pour revenir à la page précédente
  const prevPage = () => {
    if (currentPage > 1) {
      fetchContacts(currentPage - 1);
    }
  };

  // Fonction pour marquer un message comme lu
  const markAsRead = async (id) => {
    try {
      await axios.put(`https://api.ecolapp.cd/api/contact/confirme/${id}`);
      setContacts((prevContacts) =>
      prevContacts.map((contact) =>
      contact.id === id ? { ...contact, lu: 1 } : contact
      )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut lu :", error);
    }
  };

  // Fonction pour supprimer un contact
  const deleteContact = async (id) => {
    try {
      await axios.post(`https://api.ecolapp.cd/api/contact/delete/${id}`);
      fetchContacts(currentPage); // Recharge les données après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du message :", error);
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="bg-light text-center rounded p-4  mt-3">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">Liste des Contacts</h6>
          </div>

          <div className="table-responsive">
            {error ?
            <p className="text-danger">{error}</p> :

            <>
                <table className="table text-start align-middle   mb-0">
                  <thead>
                    <tr className="text-white u-style-77fdd8b0">
                      <th className="text-white">ID</th>
                      <th className="text-white">Nom</th>
                      <th className="text-white">Prénom</th>
                      <th className="text-white">Email</th>
                      <th className="text-white">Sujet</th>
                      <th className="text-white">Message</th>
                      <th className="text-white">Date</th>
                      <th className="text-white">Statut</th>
                      <th className="text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact, index) =>
                  <tr key={contact.id}>
                        <td>{index + 1 + (currentPage - 1) * 10}</td>
                        <td>{contact.nom}</td>
                        <td>{contact.prenom}</td>
                        <td>
                          <Link to={`mailto:${contact.mail}`} target="_blank" rel="noopener noreferrer">
                            {contact.mail}
                          </Link>
                        </td>
                        <td>{contact.sujet}</td>
                        <td>{contact.message}</td>
                        <td>{contact.created_at}</td>
                        <td>{contact.lu === 0 ? 'Non répondu' : 'Répondu'}</td>
                        <td className="d-flex gap-2">
                          {contact.lu === 0 &&
                      <button
                        className="btn  "
                        onClick={() => {
                          markAsRead(contact.id);
                          window.open(`mailto:${contact.mail}`, '_blank');
                        }}>
                        
                              Répondre
                            </button>
                      }
                          <button
                        className="btn  "
                        onClick={() => deleteContact(contact.id)}>
                        
                            Supprimer
                          </button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button
                  className="btn "
                  onClick={prevPage}
                  disabled={currentPage === 1}>
                  
                    Précédent
                  </button>
                  <span>Page {currentPage} sur {totalPages}</span>
                  <button
                  className="btn "
                  onClick={nextPage}
                  disabled={currentPage === totalPages}>
                  
                    Suivant
                  </button>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default ListeContact;
