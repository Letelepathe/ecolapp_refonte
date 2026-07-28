import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmationInscriptionModal from "../TypesEleves/ConfirmationInscriptionModal";
import { attribuerTypeEleve } from "../../../../services/typesEleves/typesElevesService";
import { SOURCE_TYPES_ELEVES } from "../../../../services/typesEleves/typesElevesRepository";

const URL_API = "https://api.ecolapp.cd/api";

const InscriptionsEnAttente = ({
  cycle,
  titreCycle,
  BarreGauche,
  NavHaut,
}) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const utilisateurId = localStorage.getItem("userId");
  const [inscriptions, setInscriptions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");
  const [classeId, setClasseId] = useState("");
  const [optionId, setOptionId] = useState("");
  const [inscriptionAConfirmer, setInscriptionAConfirmer] = useState(null);

  const chargerInscriptions = useCallback(async () => {
    try {
      const reponse = await axios.get(
        `${URL_API}/inscription/ecole/${ecoleId}/direction/${direction}`,
        {
          params: {
            search: recherche,
            filterClasse: classeId,
            filterOption: optionId,
          },
        }
      );
      setInscriptions(
        reponse.data.status === 200
          ? reponse.data.inscriptionEnAttente || []
          : []
      );
      setErreur("");
    } catch {
      setErreur("Erreur lors de la récupération des inscriptions.");
    }
  }, [classeId, direction, ecoleId, optionId, recherche]);

  useEffect(() => {
    const chargerReferences = async () => {
      try {
        const [reponseClasses, reponseOptions] =
          await Promise.all([
            axios.get(`${URL_API}/classe/ecole/${ecoleId}/direction/${direction}`),
            axios.get(`${URL_API}/option/ecole/${ecoleId}/direction/${direction}`),
          ]);
        setClasses(reponseClasses.data.classesAll || []);
        setOptions(reponseOptions.data.optionAll || []);
      } catch {
        setErreur("Erreur lors de la récupération des classes ou options.");
      }
    };
    chargerReferences();
  }, [direction, ecoleId]);

  useEffect(() => {
    chargerInscriptions();
  }, [chargerInscriptions]);

  const confirmerInscription = async ({ inscription, typeEleve }) => {
    try {
      const attribution = {
        inscriptionId: inscription.id,
        eleveId: inscription.eleve_id || inscription.eleves_id || null,
        anneeId: inscription.annee?.id || inscription.annee_id || null,
        typeEleveId: typeEleve.id,
        typeEleveNom: typeEleve.nom,
        attribuePar: utilisateurId,
        source: "confirmation_inscription",
        statut: "confirmee",
      };
      if (SOURCE_TYPES_ELEVES === "api") {
        await attribuerTypeEleve({ ecoleId, direction }, attribution);
      }
      const reponse = await axios.get(
        `${URL_API}/inscription/valide/${inscription.id}/${utilisateurId}`
      );
      if (Number(reponse.data.status) !== 200) {
        throw new Error(reponse.data.status_msg || "Confirmation refusée.");
      }
      if (SOURCE_TYPES_ELEVES === "browser") {
        const eleve = reponse.data.eleve || null;
        await attribuerTypeEleve(
          { ecoleId, direction },
          {
            ...attribution,
            eleveId:
              eleve?.id ||
              reponse.data.eleve_id ||
              inscription.eleve_id ||
              inscription.eleves_id ||
              null,
          }
        );
      }
      await chargerInscriptions();
      return reponse.data;
    } catch (cause) {
      setErreur("Erreur lors de la confirmation de l'inscription.");
      throw cause;
    }
  };

  const supprimerInscription = async (inscriptionId) => {
    try {
      await axios.get(`${URL_API}/inscription/delete/${inscriptionId}`);
      await chargerInscriptions();
    } catch {
      setErreur("Erreur lors de la suppression de l'inscription.");
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0">
      <BarreGauche />
      <main className="content">
        <NavHaut />
        <div className="container mt-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <Link to={`/${cycle}/liste_eleve`} className="btn text-white">
              Liste des élèves
            </Link>
            <Link
              to={`/${cycle}/liste_eleve_inscrit_${cycle}`}
              className="btn text-white"
            >
              Inscriptions confirmées
            </Link>
            <Link
              to="/bulletin/checking"
              className="btn btn-white u-style-92f685a5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vérifier un bulletin
            </Link>
          </div>

          <h1 className="h3 text-center u-style-43ef163a">
            Inscriptions {titreCycle.toLowerCase()} en attente
          </h1>

          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <input
              type="search"
              className="form-control flex-grow-1"
              placeholder="Rechercher par nom, prénom, classe ou matricule"
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
            />
            <select
              className="form-select u-style-ee3d55bf"
              value={classeId}
              onChange={(event) => setClasseId(event.target.value)}
            >
              <option value="">Toutes les classes</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>{classe.name}</option>
              ))}
            </select>
            <select
              className="form-select u-style-ee3d55bf"
              value={optionId}
              onChange={(event) => setOptionId(event.target.value)}
            >
              <option value="">Toutes les options</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          {erreur && <div className="alert alert-danger">{erreur}</div>}

          {inscriptions.length === 0 ? (
            <p className="text-center mt-3">Aucune inscription trouvée.</p>
          ) : (
            <div className="table-responsive">
              <table className="table mt-4">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Postnom</th>
                    <th>Prénom</th>
                    <th>École de provenance</th>
                    <th>Pourcentage</th>
                    <th>Option</th>
                    <th>Classe</th>
                    <th>Année</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map((inscription, index) => (
                    <tr key={inscription.id}>
                      <td>{index + 1}</td>
                      <td>{inscription.name}</td>
                      <td>{inscription.last_name}</td>
                      <td>{inscription.first_name}</td>
                      <td>{inscription.ecole_provenance}</td>
                      <td>{inscription.percent}%</td>
                      <td>{inscription.option?.name || "N/A"}</td>
                      <td>{inscription.classe?.name || "N/A"}</td>
                      <td>{inscription.annee?.name || "N/A"}</td>
                      <td>{Number(inscription.status) ? "Confirmé" : "Non confirmé"}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn"
                            onClick={() => setInscriptionAConfirmer(inscription)}
                          >
                            Confirmer
                          </button>
                          <button
                            type="button"
                            className="btn"
                            onClick={() => supprimerInscription(inscription.id)}
                          >
                            Supprimer
                          </button>
                          <Link
                            to={`/${cycle}/details_info_eleve_inscrit/${inscription.id}`}
                            className="btn text-white"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Détails
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {inscriptionAConfirmer && (
        <ConfirmationInscriptionModal
          inscription={inscriptionAConfirmer}
          onAnnuler={() => setInscriptionAConfirmer(null)}
          onConfirmer={confirmerInscription}
        />
      )}
    </div>
  );
};

export default InscriptionsEnAttente;
