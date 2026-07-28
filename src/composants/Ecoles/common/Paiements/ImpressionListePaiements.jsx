import React, { useMemo, useRef, useState } from "react";
import { imprimerListeFinanciere } from "../../../common/impressionDocuments";

const valeur = (objet, chemin, defaut = "—") =>
  chemin.split(".").reduce((resultat, cle) => resultat?.[cle], objet) ?? defaut;

const dateValide = (date) => {
  const resultat = new Date(date);
  return Number.isNaN(resultat.getTime()) ? null : resultat;
};

const dateLocale = (date) => {
  const resultat = dateValide(date);
  if (!resultat) return "—";
  return resultat.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const dateIsoLocale = (date) => {
  const valeurDate = dateValide(date);
  if (!valeurDate) return "";
  const decalage = valeurDate.getTimezoneOffset() * 60000;
  return new Date(valeurDate.getTime() - decalage).toISOString().slice(0, 10);
};

const ImpressionListePaiements = ({ paiements = [], titre }) => {
  const [ouvert, setOuvert] = useState(false);
  const [classe, setClasse] = useState("");
  const [filtreDate, setFiltreDate] = useState("tous");
  const [jour, setJour] = useState(dateIsoLocale(new Date()));
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [erreur, setErreur] = useState("");
  const documentRef = useRef(null);

  const classes = useMemo(
    () =>
      [...new Set(paiements.map((paiement) => valeur(paiement, "classe.name", "")))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "fr")),
    [paiements]
  );

  const paiementsAImprimer = useMemo(
    () =>
      paiements.filter((paiement) => {
        const correspondClasse =
          !classe || valeur(paiement, "classe.name", "") === classe;
        const datePaiement = dateIsoLocale(paiement.created_at);
        const correspondDate =
          filtreDate === "tous" ||
          (filtreDate === "jour" && datePaiement === jour) ||
          (filtreDate === "periode" &&
            (!debut || datePaiement >= debut) &&
            (!fin || datePaiement <= fin));

        return correspondClasse && correspondDate;
      }),
    [paiements, classe, filtreDate, jour, debut, fin]
  );

  const imprimer = () => {
    if (filtreDate === "jour" && !jour) {
      setErreur("Choisissez le jour à imprimer.");
      return;
    }
    if (filtreDate === "periode" && (!debut || !fin)) {
      setErreur("Indiquez le début et la fin de la période.");
      return;
    }
    if (filtreDate === "periode" && debut > fin) {
      setErreur("La date de début doit précéder la date de fin.");
      return;
    }
    if (!paiementsAImprimer.length) {
      setErreur("Aucun paiement ne correspond aux critères choisis.");
      return;
    }
    setErreur("");
    imprimerListeFinanciere(documentRef.current, titre);
  };

  return (
    <>
      <button className="btn mb-3" type="button" onClick={() => setOuvert(true)}>
        <i className="bi bi-printer me-1"></i> Imprimer la liste
      </button>

      {ouvert && (
        <div
          className="modal d-block"
          role="dialog"
          aria-modal="true"
          aria-label={`Impression : ${titre}`}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{titre}</h5>
                <button
                  className="btn-close"
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setOuvert(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3 hide-on-print">
                  <div className="col-md-4">
                    <label className="form-label">Classe</label>
                    <select
                      className="form-select"
                      value={classe}
                      onChange={(event) => setClasse(event.target.value)}
                    >
                      <option value="">Toutes les classes</option>
                      {classes.map((nomClasse) => (
                        <option key={nomClasse} value={nomClasse}>
                          {nomClasse}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Date</label>
                    <select
                      className="form-select"
                      value={filtreDate}
                      onChange={(event) => setFiltreDate(event.target.value)}
                    >
                      <option value="tous">Toutes les dates</option>
                      <option value="jour">Un jour</option>
                      <option value="periode">Une période</option>
                    </select>
                  </div>
                  {filtreDate === "jour" && (
                    <div className="col-md-4">
                      <label className="form-label">Jour</label>
                      <input
                        className="form-control"
                        type="date"
                        value={jour}
                        onChange={(event) => setJour(event.target.value)}
                      />
                    </div>
                  )}
                  {filtreDate === "periode" && (
                    <>
                      <div className="col-md-2">
                        <label className="form-label">Du</label>
                        <input
                          className="form-control"
                          type="date"
                          value={debut}
                          onChange={(event) => setDebut(event.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Au</label>
                        <input
                          className="form-control"
                          type="date"
                          value={fin}
                          onChange={(event) => setFin(event.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                {erreur && <div className="alert alert-danger">{erreur}</div>}

                <div ref={documentRef}>
                  <div className="d-flex justify-content-between align-items-end mb-3">
                    <div>
                      <h4 className="mb-1">{titre}</h4>
                      <small>
                        {classe || "Toutes les classes"} · {paiementsAImprimer.length} paiement(s)
                      </small>
                    </div>
                    <small>Édité le {dateLocale(new Date())}</small>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Matricule</th>
                          <th>Élève</th>
                          <th>Classe</th>
                          <th>Motif</th>
                          <th>Tranche</th>
                          <th>Montant</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paiementsAImprimer.map((paiement, index) => (
                          <tr key={`${paiement.id}-${index}`}>
                            <td>{index + 1}</td>
                            <td>{valeur(paiement, "eleve.matricule")}</td>
                            <td>
                              {[
                                valeur(paiement, "eleve.name", ""),
                                valeur(paiement, "eleve.last_name", ""),
                                valeur(paiement, "eleve.first_name", ""),
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </td>
                            <td>{valeur(paiement, "classe.name")}</td>
                            <td>{valeur(paiement, "motif.name")}</td>
                            <td>{valeur(paiement, "tranche.name")}</td>
                            <td>
                              {paiement.montant} {valeur(paiement, "devise.name", "")}
                            </td>
                            <td>{dateLocale(paiement.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setOuvert(false)}
                >
                  Fermer
                </button>
                <button className="btn btn-primary" type="button" onClick={imprimer}>
                  <i className="bi bi-printer me-1"></i> Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImpressionListePaiements;
