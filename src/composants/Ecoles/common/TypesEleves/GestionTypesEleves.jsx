import React, { useEffect, useMemo, useState } from "react";
import Tableau from "../../../common/Tableau/Tableau";
import Pagination from "../../../common/Tableau/Pagination";
import usePagination from "../../../common/Tableau/usePagination";
import {
  creerContexteTypesEleves,
  enregistrerTypeEleve,
  listerTypesEleves,
} from "../../../../services/typesEleves/typesElevesService";

const formulaireVide = {
  id: "",
  nom: "",
  description: "",
  actif: true,
  estTypeParDefaut: false,
};

const normaliserTexte = (valeur) => String(valeur ?? "").trim();

const descriptionCourte = (description = "", limite = 110) => {
  const texte = normaliserTexte(description);
  return texte.length > limite
    ? `${texte.slice(0, limite).trim()}…`
    : texte || "—";
};

const GestionTypesEleves = ({ BarreGauche, NavHaut }) => {
  const contexte = useMemo(() => creerContexteTypesEleves(), []);
  const [types, setTypes] = useState([]);
  const [formulaire, setFormulaire] = useState(formulaireVide);
  const [typeEnDetail, setTypeEnDetail] = useState(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const { currentPage, totalPages, paginatedData, setCurrentPage } =
    usePagination(types, 10);

  const recharger = async () => {
    const typesCharges = await listerTypesEleves(contexte, {
      inclureInactifs: true,
    });
    setTypes(typesCharges);
  };

  useEffect(() => {
    recharger().catch(() => {
      setTypes([]);
      setErreur(
        "Impossible de charger les types d'élèves. Veuillez réessayer."
      );
    });
  }, []);

  const fermerFormulaire = () => {
    setFormulaireOuvert(false);
    setFormulaire(formulaireVide);
    setErreur("");
  };

  const ouvrirFormulaire = (type = formulaireVide) => {
    setMessage("");
    setErreur("");
    setFormulaire({
      id: type.id || "",
      nom: type.nom || "",
      description: type.description || "",
      actif: type.actif !== false,
      estTypeParDefaut: Boolean(type.estTypeParDefaut),
    });
    setFormulaireOuvert(true);
  };

  const envoyer = async (event) => {
    event.preventDefault();
    setMessage("");
    setErreur("");

    const nom = normaliserTexte(formulaire.nom);
    if (!nom) {
      setErreur("Le nom du type d'élève est requis.");
      return;
    }

    setEnregistrement(true);
    try {
      await enregistrerTypeEleve(contexte, {
        ...formulaire,
        nom,
        description: normaliserTexte(formulaire.description),
      });
      await recharger();
      fermerFormulaire();
      setMessage("Type d'élève enregistré avec succès.");
    } catch {
      setErreur("Impossible d'enregistrer ce type d'élève.");
    } finally {
      setEnregistrement(false);
    }
  };

  const colonnes = [
    {
      key: "nom",
      header: "Type d'élève",
      render: (type) => (
        <div>
          <strong>{type.nom}</strong>
          {type.estTypeParDefaut && (
            <span className="badge bg-secondary ms-2">Par défaut</span>
          )}
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (type) => (
        <span title={type.description || ""}>
          {descriptionCourte(type.description)}
        </span>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      render: (type) => (
        <span
          className={`badge ${
            type.actif ? "bg-success" : "bg-warning text-dark"
          }`}
        >
          {type.actif ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (type) => (
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setTypeEnDetail(type)}
          >
            Voir les détails
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => ouvrirFormulaire(type)}
          >
            Modifier
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid position-relative d-flex p-0">
      <BarreGauche />
      <main className="content">
        <NavHaut />
        <div className="container py-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h1 className="h4 mb-1">Types d'élèves</h1>
                  <p className="text-muted mb-0">
                    Gérez les catégories d'élèves. Les montants se configurent
                    maintenant dans chaque tranche.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn"
                  onClick={() => ouvrirFormulaire()}
                >
                  + Ajouter un type d'élève
                </button>
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              <Tableau
                columns={colonnes}
                data={paginatedData}
                keyExtractor={(type) => type.id}
                emptyMessage="Aucun type d'élève trouvé."
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </main>

      {typeEnDetail && (
        <div
          className="custom-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titre-detail-type"
        >
          <div className="modal-content">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h2 id="titre-detail-type" className="h5 mb-1">
                  {typeEnDetail.nom}
                </h2>
                <div className="d-flex gap-2">
                  {typeEnDetail.estTypeParDefaut && (
                    <span className="badge bg-secondary">Par défaut</span>
                  )}
                  <span
                    className={`badge ${
                      typeEnDetail.actif
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {typeEnDetail.actif ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setTypeEnDetail(null)}
              >
                Fermer
              </button>
            </div>
            <div className="mt-3">
              <h3 className="h6">Description</h3>
              <p>{typeEnDetail.description || "Aucune description."}</p>
              <p className="alert alert-light border mb-0">
                Les montants particuliers de ce type sont définis dans la
                gestion des tranches.
              </p>
            </div>
          </div>
        </div>
      )}

      {formulaireOuvert && (
        <div
          className="custom-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titre-formulaire-type"
        >
          <div className="modal-content">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h2 id="titre-formulaire-type" className="h5 mb-1">
                  {formulaire.id
                    ? "Modifier le type d'élève"
                    : "Ajouter un type d'élève"}
                </h2>
                <p className="text-muted mb-0">
                  Définissez uniquement la catégorie et son statut.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={fermerFormulaire}
              >
                Fermer
              </button>
            </div>

            <form onSubmit={envoyer}>
              <div className="mb-3">
                <label htmlFor="nom-type">Nom</label>
                <input
                  id="nom-type"
                  className="form-control"
                  value={formulaire.nom}
                  onChange={(event) =>
                    setFormulaire((courant) => ({
                      ...courant,
                      nom: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description-type">Description</label>
                <textarea
                  id="description-type"
                  className="form-control"
                  rows="3"
                  value={formulaire.description}
                  onChange={(event) =>
                    setFormulaire((courant) => ({
                      ...courant,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="d-flex flex-wrap gap-4 mb-3">
                <div className="form-check">
                  <input
                    id="type-defaut"
                    className="form-check-input"
                    type="checkbox"
                    checked={formulaire.estTypeParDefaut}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        estTypeParDefaut: event.target.checked,
                      }))
                    }
                  />
                  <label className="form-check-label" htmlFor="type-defaut">
                    Type par défaut
                  </label>
                </div>
                <div className="form-check">
                  <input
                    id="type-actif"
                    className="form-check-input"
                    type="checkbox"
                    checked={formulaire.actif}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        actif: event.target.checked,
                      }))
                    }
                  />
                  <label className="form-check-label" htmlFor="type-actif">
                    Actif
                  </label>
                </div>
              </div>

              {erreur && <p className="text-danger">{erreur}</p>}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={fermerFormulaire}
                  disabled={enregistrement}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={enregistrement}
                >
                  {enregistrement ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionTypesEleves;
