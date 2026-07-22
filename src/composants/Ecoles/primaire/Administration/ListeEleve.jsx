import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import ConfirmModal from "./ConfirmModal";

const ListeEleve = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [eleves, setEleves] = useState([]);
  const [filteredEleves, setFilteredEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [eleveToDelete, setEleveToDelete] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEleves = async (page = 1) => {
    try {
      const elevesResponse = await axios.get(
        `https://api.ecolapp.cd/api/eleve/ecole/${ecole_id}/direction/${direction}?page=${page}`
      );

      setEleves(elevesResponse.data.eleve.data);
      setFilteredEleves(elevesResponse.data.eleve.data);
      setTotalPages(elevesResponse.data.eleve.last_page);
    } catch (error) {
      setError("Erreur lors de la récupération des élèves.");
    }
  };

  const fetchClassesAndOptions = async () => {
    try {
      const [classesResponse, optionsResponse] = await Promise.all([
        axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`),
        axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`),
      ]);

      setClasses(classesResponse.data.classesAll);
      setOptions(optionsResponse.data.optionAll);
    } catch (error) {
      setError("Erreur lors de la récupération des classes ou options.");
    }
  };

  useEffect(() => {
    fetchEleves(currentPage);
    fetchClassesAndOptions();
  }, [currentPage, ecole_id, direction]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterEleves(e.target.value, selectedClasse, selectedOption);
  };

  const handleClasseChange = (e) => {
    setSelectedClasse(e.target.value);
    filterEleves(searchQuery, e.target.value, selectedOption);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    filterEleves(searchQuery, selectedClasse, e.target.value);
  };

  const filterEleves = (query, classe, option) => {
    const filtered = eleves.filter((eleve) => {
      const matchesQuery =
        query === "" ||
        (eleve.name && eleve.name.toLowerCase().includes(query.toLowerCase())) ||
        (eleve.first_name && eleve.first_name.toLowerCase().includes(query.toLowerCase())) ||
        (eleve.last_name && eleve.last_name.toLowerCase().includes(query.toLowerCase()));

      const matchesClasse = classe === "" || eleve.classe?.id === parseInt(classe);
      const matchesOption = option === "" || eleve.option?.id === parseInt(option);

      return matchesQuery && matchesClasse && matchesOption;
    });

    setFilteredEleves(filtered);
  };

  const handleDelete = (id) => {
    setEleveToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (eleveToDelete) {
      try {
        await axios.delete(`https://api.ecolapp.cd/api/eleve/delete/${eleveToDelete}`);
        setEleves(eleves.filter((eleve) => eleve.id !== eleveToDelete));
        setFilteredEleves(filteredEleves.filter((eleve) => eleve.id !== eleveToDelete));
        setMessage("L'élève a été supprimé avec succès.");
      } catch (error) {
        setError("Erreur lors de la suppression de l'élève.");
      } finally {
        setShowModal(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <div className="container-fluid position-relative  d-flex p-0">
        <SidebarLeft />
        <div className="content">
          <NavbarTop />
          <div className="container-fluid pt-4 px-4">
            <div className=" text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                <h6 className="mb-0">Liste des élèves</h6>
                <Link to="/primaire/ajouter_eleve" className="btn">
                  Ajouter élève
                </Link>
                <div className="d-flex gap-3 flex-wrap">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher par nom, prénom ou postnom..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <select
                    className="form-select"
                    value={selectedClasse}
                    onChange={handleClasseChange}
                  >
                    <option value="">Toutes les classes</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={selectedOption}
                    onChange={handleOptionChange}
                  >
                    <option value="">Toutes les options</option>
                    {options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {message && <div className="alert alert-info">{message}</div>}

              <div className="table-responsive">
                {error ? (
                  <p className="text-danger">{error}</p>
                ) : filteredEleves.length > 0 ? (
                  <>
                    <table className="table  mt-4   mb-0">
                      <thead>
                        <tr className="text-dark">
                          <th>ID</th>
                          <th>Matricule</th>
                          <th>Nom</th>
                          <th>Postnom</th>
                          <th>Prénom</th>
                          <th>Description</th>
                          <th>Classe</th>
                          <th>Option</th>
                          <th>Année Scolaire</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEleves.map((eleve) => (
                          <tr key={eleve.id}>
                            <td>{eleve.id}</td>
                            <td>{eleve.matricule}</td>
                            <td>{eleve.name}</td>
                            <td>{eleve.last_name}</td>
                            <td>{eleve.first_name}</td>
                            <td>{eleve.description}</td>
                            <td>{eleve.classe.name}</td>
                            <td>{eleve.option.name}</td>
                            <td>{eleve.annee.name}</td>
                            <td>
                              <button
                                className="btn "
                                onClick={() => handleDelete(eleve.id)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <button
                        className="btn "
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </button>
                      <span className="align-self-center">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <button
                        className="btn "
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Aucun élève trouvé.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Êtes-vous sûr de vouloir supprimer cet élève ?"
      />
    </div>
  );
};

export default ListeEleve;
