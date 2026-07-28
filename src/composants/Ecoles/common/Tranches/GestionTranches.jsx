import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tableau from "../../../common/Tableau/Tableau";
import Pagination from "../../../common/Tableau/Pagination";
import usePagination from "../../../common/Tableau/usePagination";
import {
  creerContexteTypesEleves,
  listerTypesEleves,
} from "../../../../services/typesEleves/typesElevesService";
import {
  creerContexteReglements,
  enregistrerConfigurationTranche,
  listerConfigurationsTranches,
} from "../../../../services/reglementsTranches/reglementsTranchesService";
import {
  STATUTS_CONFIGURATION_TRANCHE,
  validerConfigurationTranche,
} from "../../../../services/reglementsTranches/validationConfigurationTranche";
import {
  estAnneeScolaireActive,
  libelleAnneeScolaire,
  obtenirAnneeScolaireActive,
} from "../../../../services/anneesScolaires/anneesScolairesService";
import EtatRepartitionMotif from "./EtatRepartitionMotif";

const API = "https://api.ecolapp.cd/api";

const formulaireVide = {
  trancheId: "",
  nom: "",
  motifId: "",
  montantNormal: "",
  deviseId: "",
  anneeId: "",
  ordre: "",
  echeance: "",
  statut: STATUTS_CONFIGURATION_TRANCHE.BROUILLON,
  reglements: [],
};

const nombre = (valeur) => {
  const resultat = Number(valeur);
  return Number.isFinite(resultat) ? resultat : 0;
};

const GestionTranches = ({
  BarreGauche,
  NavHaut,
  cycle,
  ouvrirAjoutAuChargement = false,
}) => {
  const contexteTypes = useMemo(() => creerContexteTypesEleves(), []);
  const contexteReglements = useMemo(() => creerContexteReglements(), []);
  const ecoleId = contexteReglements.ecoleId;
  const direction = contexteReglements.direction;
  const [tranches, setTranches] = useState([]);
  const [types, setTypes] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [devises, setDevises] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [motifFiltre, setMotifFiltre] = useState("");
  const [configurations, setConfigurations] = useState([]);
  const [formulaire, setFormulaire] = useState(formulaireVide);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [rapportVisible, setRapportVisible] = useState(false);
  const tranchesFiltrees = motifFiltre
    ? tranches.filter((tranche) => {
        const configuration = configurations.find(
          (element) =>
            String(element.trancheId) === String(tranche.id)
        );
        return String(configuration?.motifId) === String(motifFiltre);
      })
    : tranches;
  const { currentPage, totalPages, paginatedData, setCurrentPage } =
    usePagination(tranchesFiltrees, 10);

  const charger = async () => {
    try {
      const [
        reponseTranches,
        reponseMotifs,
        reponseDevises,
        reponseAnnees,
        typesCharges,
        configurationsChargees,
      ] = await Promise.all([
        axios.get(`${API}/tranche/ecole/${ecoleId}/direction/${direction}`),
        axios.get(`${API}/motif/ecole/${ecoleId}/direction/${direction}`),
        axios.get(`${API}/devise/ecole/${ecoleId}/direction/${direction}`),
        axios.get(`${API}/annee/ecole/${ecoleId}/direction/${direction}`),
        listerTypesEleves(contexteTypes, { inclureInactifs: false }),
        listerConfigurationsTranches(contexteReglements),
      ]);
      setTranches(reponseTranches.data.trancheAll || []);
      setMotifs(reponseMotifs.data.motifAll || []);
      setDevises(reponseDevises.data.deviseAll || []);
      const anneesChargees = reponseAnnees.data.anneeAll || [];
      setAnnees(anneesChargees);
      setTypes(typesCharges);
      setConfigurations(configurationsChargees);
      return anneesChargees;
    } catch {
      setErreur("Impossible de charger les tranches et leur configuration.");
      return [];
    }
  };

  useEffect(() => {
    charger().then((anneesChargees) => {
      if (ouvrirAjoutAuChargement) {
        const anneeActive = obtenirAnneeScolaireActive(anneesChargees);
        setFormulaire({
          ...formulaireVide,
          anneeId: anneeActive?.id || "",
        });
        setFormulaireOuvert(true);
      }
    });
  }, []);

  const configurationDe = (trancheId) =>
    configurations.find(
      (configuration) =>
        String(configuration.trancheId) === String(trancheId)
    );

  const motifSelectionne = motifs.find(
    (motif) => String(motif.id) === String(formulaire.motifId)
  );
  const montantTotalMotifBrut =
    motifSelectionne?.montant_total ??
    motifSelectionne?.montantTotal ??
    motifSelectionne?.plafond_total ??
    motifSelectionne?.montant ??
    motifSelectionne?.amount;
  const aEnveloppeMotif =
    montantTotalMotifBrut !== undefined &&
    montantTotalMotifBrut !== null &&
    montantTotalMotifBrut !== "" &&
    nombre(montantTotalMotifBrut) > 0;
  const montantMotif = aEnveloppeMotif
    ? nombre(montantTotalMotifBrut)
    : 0;
  const montantAutresTranches = configurations
    .filter(
      (configuration) =>
        String(configuration.motifId) === String(formulaire.motifId) &&
        String(configuration.anneeId) === String(formulaire.anneeId) &&
        String(configuration.trancheId) !== String(formulaire.trancheId)
    )
    .reduce(
      (total, configuration) =>
        total + nombre(configuration.montantNormal),
      0
    );
  const montantDisponible = Math.max(
    0,
    montantMotif - montantAutresTranches
  );
  const rapportValidation = validerConfigurationTranche({
    configuration: formulaire,
    configurations,
    types,
    montantMotif,
    aEnveloppeMotif,
  });
  const configurationCloturee =
    configurationDe(formulaire.trancheId)?.statut ===
    STATUTS_CONFIGURATION_TRANCHE.CLOTUREE;

  const choisirMotif = (motifId) => {
    const motif = motifs.find(
      (element) => String(element.id) === String(motifId)
    );
    setFormulaire((courant) => ({
      ...courant,
      motifId,
      deviseId:
        motif?.devise_id ??
        motif?.devises_id ??
        motif?.devise?.id ??
        "",
    }));
  };

  const ouvrirAjout = () => {
    setErreur("");
    setMessage("");
    setRapportVisible(false);
    const anneeActive = obtenirAnneeScolaireActive(annees);
    setFormulaire({
      ...formulaireVide,
      anneeId: anneeActive?.id || "",
    });
    setFormulaireOuvert(true);
  };

  const ouvrirConfiguration = (tranche) => {
    const configuration = configurationDe(tranche.id);
    setErreur("");
    setMessage("");
    setRapportVisible(false);
    setFormulaire({
      ...formulaireVide,
      ...configuration,
      trancheId: tranche.id,
      nom: tranche.name || tranche.nom || "",
      montantNormal:
        configuration?.montantNormal ?? tranche.montant ?? "",
      motifId:
        configuration?.motifId ??
        tranche.motif_id ??
        tranche.motifs_id ??
        "",
      deviseId:
        configuration?.deviseId ??
        tranche.devise_id ??
        tranche.devises_id ??
        "",
      anneeId:
        configuration?.anneeId ??
        tranche.annee_id ??
        "",
      ordre: configuration?.ordre ?? tranche.ordre ?? "",
      echeance:
        configuration?.echeance ??
        tranche.date_echeance ??
        "",
      statut:
        configuration?.statut ??
        STATUTS_CONFIGURATION_TRANCHE.BROUILLON,
      reglements: configuration?.reglements || [],
    });
    setFormulaireOuvert(true);
  };

  const fermer = () => {
    setFormulaireOuvert(false);
    setFormulaire(formulaireVide);
    setErreur("");
    setRapportVisible(false);
  };

  const reglementDe = (typeId) =>
    formulaire.reglements.find(
      (reglement) => String(reglement.typeEleveId) === String(typeId)
    );

  const modifierReglement = (typeId, changement) => {
    setFormulaire((courant) => {
      const precedent =
        courant.reglements.find(
          (reglement) =>
            String(reglement.typeEleveId) === String(typeId)
        ) || {
          typeEleveId: typeId,
          montant: courant.montantNormal,
          applicable: true,
          actif: true,
        };
      const autres = courant.reglements.filter(
        (reglement) =>
          String(reglement.typeEleveId) !== String(typeId)
      );
      return {
        ...courant,
        reglements: [...autres, { ...precedent, ...changement }],
      };
    });
  };

  const retirerReglement = (typeId) => {
    setFormulaire((courant) => ({
      ...courant,
      reglements: courant.reglements.filter(
        (reglement) =>
          String(reglement.typeEleveId) !== String(typeId)
      ),
    }));
  };

  const retrouverTrancheCreee = async (nom) => {
    const reponse = await axios.get(
      `${API}/tranche/ecole/${ecoleId}/direction/${direction}`
    );
    const liste = reponse.data.trancheAll || [];
    return [...liste]
      .reverse()
      .find((tranche) => (tranche.name || tranche.nom) === nom);
  };

  const envoyer = async (event) => {
    event.preventDefault();
    setErreur("");
    setMessage("");

    if (configurationCloturee) {
      setErreur(
        "Cette configuration est clôturée. Elle reste consultable mais ne peut plus être modifiée."
      );
      return;
    }
    if (!rapportValidation.estValide) {
      setRapportVisible(true);
      setErreur(
        `${rapportValidation.erreurs.length} erreur(s) doivent être corrigées avant l'enregistrement.`
      );
      return;
    }

    setEnregistrement(true);
    try {
      let trancheId = formulaire.trancheId;
      if (!trancheId) {
        const reponse = await axios.post(`${API}/tranche/create`, {
          name: formulaire.nom.trim(),
          ecole_id: ecoleId,
          direction,
        });
        trancheId =
          reponse.data.tranche?.id ||
          reponse.data.tranche_id ||
          reponse.data.last_id;
        if (!trancheId) {
          const creee = await retrouverTrancheCreee(formulaire.nom.trim());
          trancheId = creee?.id;
        }
      }

      if (!trancheId) {
        throw new Error("Identifiant de tranche absent");
      }

      await enregistrerConfigurationTranche(contexteReglements, {
        ...formulaire,
        trancheId,
        nom: formulaire.nom.trim(),
      });
      await charger();
      fermer();
      setMessage("Tranche et montants par type enregistrés.");
    } catch {
      setErreur(
        "Impossible d'enregistrer la tranche. La configuration locale n'a pas été perdue."
      );
    } finally {
      setEnregistrement(false);
    }
  };

  const colonnes = [
    {
      key: "nom",
      header: "Tranche",
      render: (tranche) => tranche.name || tranche.nom,
    },
    {
      key: "motif",
      header: "Motif",
      render: (tranche) => {
        const configuration = configurationDe(tranche.id);
        const motif = motifs.find(
          (element) =>
            String(element.id) === String(configuration?.motifId)
        );
        return motif?.name || motif?.nom || "À configurer";
      },
    },
    {
      key: "montant",
      header: "Montant normal",
      render: (tranche) => {
        const configuration = configurationDe(tranche.id);
        return configuration
          ? nombre(configuration.montantNormal).toLocaleString("fr-FR")
          : "À configurer";
      },
    },
    {
      key: "reglements",
      header: "Types configurés",
      render: (tranche) =>
        configurationDe(tranche.id)?.reglements?.length || 0,
    },
    {
      key: "statut",
      header: "Statut",
      render: (tranche) => {
        const statut =
          configurationDe(tranche.id)?.statut ||
          STATUTS_CONFIGURATION_TRANCHE.BROUILLON;
        const libelles = {
          brouillon: "Brouillon",
          active: "Active",
          cloturee: "Clôturée",
        };
        const classes = {
          brouillon: "bg-secondary",
          active: "bg-success",
          cloturee: "bg-dark",
        };
        return (
          <span className={`badge ${classes[statut] || "bg-secondary"}`}>
            {libelles[statut] || statut}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (tranche) => (
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => ouvrirConfiguration(tranche)}
          >
            Configurer
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
                  <h1 className="h4 mb-1">Tranches et montants</h1>
                  <p className="text-muted mb-0">
                    Le montant normal appartient à la tranche. Les montants
                    particuliers sont définis par type d'élève.
                  </p>
                </div>
                <button type="button" className="btn" onClick={ouvrirAjout}>
                  + Ajouter une tranche
                </button>
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              {erreur && !formulaireOuvert && (
                <div className="alert alert-danger">{erreur}</div>
              )}
              <div className="row align-items-end mb-3">
                <div className="col-12 col-md-5">
                  <label htmlFor="filtre-motif">Filtrer par motif</label>
                  <select
                    id="filtre-motif"
                    className="form-control"
                    value={motifFiltre}
                    onChange={(event) => {
                      setMotifFiltre(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Tous les motifs</option>
                    {motifs.map((motif) => (
                      <option key={motif.id} value={motif.id}>
                        {motif.name || motif.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Tableau
                columns={colonnes}
                data={paginatedData}
                keyExtractor={(tranche) => tranche.id}
                emptyMessage="Aucune tranche trouvée."
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-3"
              />
              <Link to={`/${cycle}/types_eleves`} className="d-inline-block mt-3">
                Gérer les types d'élèves
              </Link>
            </div>
          </div>
        </div>
      </main>

      {formulaireOuvert && (
        <div
          className="custom-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titre-tranche"
        >
          <div
            className="modal-content"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between gap-3 mb-3">
              <div>
                <h2 id="titre-tranche" className="h5 mb-1">
                  {formulaire.trancheId
                    ? "Configurer la tranche"
                    : "Ajouter une tranche"}
                </h2>
                <p className="text-muted mb-0">
                  Sans montant particulier, un type paie le montant normal.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={fermer}
              >
                Fermer
              </button>
            </div>

            <form onSubmit={envoyer}>
              <fieldset disabled={configurationCloturee}>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label htmlFor="nom-tranche">Nom</label>
                  <input
                    id="nom-tranche"
                    className="form-control"
                    value={formulaire.nom}
                    disabled={Boolean(formulaire.trancheId)}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        nom: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label htmlFor="motif-tranche">Motif</label>
                  <select
                    id="motif-tranche"
                    className="form-control"
                    value={formulaire.motifId}
                    onChange={(event) => choisirMotif(event.target.value)}
                  >
                    <option value="">Sélectionner un motif</option>
                    {motifs.map((motif) => (
                      <option key={motif.id} value={motif.id}>
                        {motif.name || motif.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label htmlFor="montant-normal">Montant normal</label>
                  <input
                    id="montant-normal"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={formulaire.montantNormal}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        montantNormal: event.target.value,
                      }))
                    }
                  />
                  {formulaire.motifId && aEnveloppeMotif && (
                    <EtatRepartitionMotif
                      nomMotif={
                        motifSelectionne?.name || motifSelectionne?.nom
                      }
                      montantMotif={montantMotif}
                      montantAffecte={montantAutresTranches}
                      montantDisponible={montantDisponible}
                      montantSaisi={formulaire.montantNormal}
                      devise={
                        devises.find(
                          (devise) =>
                            String(devise.id) ===
                            String(formulaire.deviseId)
                        )?.name ||
                        motifSelectionne?.devise?.name ||
                        ""
                      }
                      onVoirTranches={() => {
                        setMotifFiltre(formulaire.motifId);
                        setCurrentPage(1);
                        fermer();
                      }}
                    />
                  )}
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label>Devise</label>
                  <div className="form-control bg-light">
                    {devises.find(
                      (devise) =>
                        String(devise.id) === String(formulaire.deviseId)
                    )?.name ||
                      motifSelectionne?.devise?.name ||
                      "Devise du motif"}
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <label htmlFor="annee-tranche">Année scolaire</label>
                  <select
                    id="annee-tranche"
                    className="form-control"
                    value={formulaire.anneeId}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        anneeId: event.target.value,
                      }))
                    }
                  >
                    <option value="">Sélectionner une année</option>
                    {annees.map((annee) => (
                      <option key={annee.id} value={annee.id}>
                        {libelleAnneeScolaire(annee)}
                        {estAnneeScolaireActive(annee)
                          ? " (active)"
                          : " (inactive)"}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    L'année active est proposée automatiquement. Vous pouvez
                    choisir une autre année pour sa propre configuration.
                  </small>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <label htmlFor="ordre-tranche">Ordre</label>
                  <input
                    id="ordre-tranche"
                    type="number"
                    min="1"
                    className="form-control"
                    value={formulaire.ordre}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        ordre: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <label htmlFor="echeance-tranche">Échéance</label>
                  <input
                    id="echeance-tranche"
                    type="date"
                    className="form-control"
                    value={formulaire.echeance}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        echeance: event.target.value,
                      }))
                    }
                  />
                  <small className="text-muted">
                    Date indicative : elle ne bloque jamais un paiement tardif.
                  </small>
                </div>
                <div className="col-12 col-md-4 mb-3">
                  <label htmlFor="statut-tranche">Statut</label>
                  <select
                    id="statut-tranche"
                    className="form-control"
                    value={formulaire.statut}
                    onChange={(event) =>
                      setFormulaire((courant) => ({
                        ...courant,
                        statut: event.target.value,
                      }))
                    }
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="active">Active</option>
                    <option value="cloturee">Clôturée</option>
                  </select>
                  <small className="text-muted">
                    Active pour l'encaissement ; clôturée pour protéger
                    l'historique.
                  </small>
                </div>
              </div>

              <h3 className="h6 mt-2">Montants par type d'élève</h3>
              {types.length === 0 ? (
                <p className="alert alert-info">
                  Créez d'abord les types d'élèves. Le montant normal reste
                  applicable.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Règle</th>
                        <th>Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {types.map((type) => {
                        const reglement = reglementDe(type.id);
                        return (
                          <tr key={type.id}>
                            <td>{type.nom}</td>
                            <td>
                              <select
                                className="form-control"
                                value={
                                  !reglement
                                    ? "heriter"
                                    : reglement.applicable === false
                                      ? "non_applicable"
                                      : "personnaliser"
                                }
                                onChange={(event) => {
                                  if (event.target.value === "heriter") {
                                    retirerReglement(type.id);
                                  } else if (
                                    event.target.value === "non_applicable"
                                  ) {
                                    modifierReglement(type.id, {
                                      applicable: false,
                                      montant: 0,
                                    });
                                  } else {
                                    modifierReglement(type.id, {
                                      applicable: true,
                                      montant:
                                        reglement?.montant ??
                                        formulaire.montantNormal,
                                    });
                                  }
                                }}
                              >
                                <option value="heriter">Hériter</option>
                                <option value="personnaliser">
                                  Personnaliser
                                </option>
                                <option value="non_applicable">
                                  Non applicable
                                </option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                max={formulaire.montantNormal || undefined}
                                className="form-control"
                                value={
                                  reglement?.montant ??
                                  formulaire.montantNormal
                                }
                                disabled={
                                  !reglement ||
                                  reglement.applicable === false
                                }
                                onChange={(event) =>
                                  modifierReglement(type.id, {
                                    montant: event.target.value,
                                  })
                                }
                                aria-label={`Montant pour ${type.nom}`}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              </fieldset>

              {configurationCloturee && (
                <div className="alert alert-secondary mt-3">
                  Cette configuration est clôturée et protégée. Elle reste
                  consultable pour l'historique.
                </div>
              )}

              {rapportVisible && (
                <div className="border rounded p-3 mt-3">
                  <h6 className="mb-2">Contrôle de la configuration</h6>
                  <ul className="mb-0 ps-3">
                    {rapportValidation.controles.map((controle) => (
                      <li
                        key={controle.code}
                        className={
                          controle.niveau === "erreur"
                            ? "text-danger"
                            : controle.niveau === "avertissement"
                              ? "text-warning"
                              : "text-success"
                        }
                      >
                        {controle.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {erreur && <p className="text-danger">{erreur}</p>}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setRapportVisible((visible) => !visible)}
                >
                  {rapportVisible ? "Masquer le contrôle" : "Vérifier"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={fermer}
                  disabled={enregistrement}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={enregistrement || configurationCloturee}
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

export default GestionTranches;
