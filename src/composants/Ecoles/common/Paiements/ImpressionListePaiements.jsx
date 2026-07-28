import React, { useEffect, useMemo, useRef, useState } from "react";
import LogoEcoleApp from "../../../../static/images/logo_ecolapp.jpg";
import {
  imprimerListeFinanciere,
  telechargerDocumentPdf,
} from "../../../common/impressionDocuments";
import { api } from "../../../api/api";
import { obtenirUrlLogoEcole } from "../../../../services/ecoles/ecoleAssets";
import EtatFinancierGlobal from "./EtatFinancierGlobal";

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

const nomFichier = (titre) =>
  `${titre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`;

const ImpressionListePaiements = ({ paiements = [], titre }) => {
  const [ouvert, setOuvert] = useState(false);
  const [classe, setClasse] = useState("");
  const [filtreDate, setFiltreDate] = useState("tous");
  const [jour, setJour] = useState(dateIsoLocale(new Date()));
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [erreur, setErreur] = useState("");
  const [ecole, setEcole] = useState(null);
  const [telechargement, setTelechargement] = useState(false);
  const documentRef = useRef(null);
  const ecoleId = localStorage.getItem("ecole_id");

  useEffect(() => {
    if (!ouvert || !ecoleId) return undefined;

    let actif = true;
    const ecoleIncluse =
      paiements.find((paiement) => paiement.eleve?.ecole)?.eleve?.ecole ||
      paiements.find((paiement) => paiement.ecole)?.ecole;

    if (ecoleIncluse) {
      setEcole(ecoleIncluse);
      return undefined;
    }

    api
      .get(`/ecole/ecole_id/${ecoleId}`)
      .then((response) => {
        if (actif) setEcole(response.data?.ecole || null);
      })
      .catch(() => {
        if (actif) setEcole(null);
      });

    return () => {
      actif = false;
    };
  }, [ecoleId, ouvert, paiements]);

  const classes = useMemo(
    () =>
      [...new Set(paiements.map((paiement) => valeur(paiement, "classe.name", "")))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "fr")),
    [paiements]
  );

  const paiementsSelectionnes = useMemo(
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

  const totaux = useMemo(
    () =>
      paiementsSelectionnes.reduce((resultat, paiement) => {
        const devise = valeur(
          paiement,
          "devise.name",
          valeur(paiement, "devise.symbole", "Sans devise")
        );
        const montant = Number(paiement.montant);
        resultat[devise] =
          (resultat[devise] || 0) + (Number.isFinite(montant) ? montant : 0);
        return resultat;
      }, {}),
    [paiementsSelectionnes]
  );

  const libellePeriode =
    filtreDate === "jour"
      ? `Journée du ${jour}`
      : filtreDate === "periode"
        ? `Du ${debut} au ${fin}`
        : "Toutes les dates";

  const selectionValide = () => {
    if (filtreDate === "jour" && !jour) {
      setErreur("Choisissez le jour à traiter.");
      return false;
    }
    if (filtreDate === "periode" && (!debut || !fin)) {
      setErreur("Indiquez le début et la fin de la période.");
      return false;
    }
    if (filtreDate === "periode" && debut > fin) {
      setErreur("La date de début doit précéder la date de fin.");
      return false;
    }
    if (!paiementsSelectionnes.length) {
      setErreur("Aucun paiement ne correspond aux critères choisis.");
      return false;
    }
    setErreur("");
    return true;
  };

  const imprimer = () => {
    if (selectionValide()) {
      imprimerListeFinanciere(documentRef.current, titre);
    }
  };

  const telecharger = async () => {
    if (!selectionValide()) return;
    setTelechargement(true);
    await telechargerDocumentPdf(documentRef.current, {
      nomFichier: nomFichier(titre),
      orientation: "landscape",
      format: "a4",
      marge: 8,
      pagination: true,
    });
    setTelechargement(false);
  };

  const logoEcole = obtenirUrlLogoEcole(ecole, LogoEcoleApp);

  return (
    <>
      <button className="btn mb-3" type="button" onClick={() => setOuvert(true)}>
        <i className="bi bi-printer me-1"></i> Imprimer la liste
      </button>
      <EtatFinancierGlobal />

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
                <button className="btn-close" type="button" aria-label="Fermer" onClick={() => setOuvert(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3 hide-on-print">
                  <div className="col-md-4">
                    <label className="form-label">Classe</label>
                    <select className="form-select" value={classe} onChange={(event) => setClasse(event.target.value)}>
                      <option value="">Toutes les classes</option>
                      {classes.map((nomClasse) => <option key={nomClasse} value={nomClasse}>{nomClasse}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Date</label>
                    <select className="form-select" value={filtreDate} onChange={(event) => setFiltreDate(event.target.value)}>
                      <option value="tous">Toutes les dates</option>
                      <option value="jour">Un jour</option>
                      <option value="periode">Une période</option>
                    </select>
                  </div>
                  {filtreDate === "jour" && (
                    <div className="col-md-4">
                      <label className="form-label">Jour</label>
                      <input className="form-control" type="date" value={jour} onChange={(event) => setJour(event.target.value)} />
                    </div>
                  )}
                  {filtreDate === "periode" && (
                    <>
                      <div className="col-md-2">
                        <label className="form-label">Du</label>
                        <input className="form-control" type="date" value={debut} onChange={(event) => setDebut(event.target.value)} />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Au</label>
                        <input className="form-control" type="date" value={fin} onChange={(event) => setFin(event.target.value)} />
                      </div>
                    </>
                  )}
                </div>

                {erreur && <div className="alert alert-danger">{erreur}</div>}

                <div ref={documentRef} className="p-3 bg-white">
                  <div className="d-flex justify-content-between align-items-start gap-3 border-bottom border-primary border-2 pb-3 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={logoEcole}
                        alt={`Logo ${ecole?.name || "école"}`}
                        style={{ width: 58, height: 58, objectFit: "cover", borderRadius: 10 }}
                        onError={(event) => { event.currentTarget.src = LogoEcoleApp; }}
                      />
                      <div>
                        <h5 className="text-primary mb-1">{ecole?.name || "Établissement scolaire"}</h5>
                        <small>Gestion scolaire et financière</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <h4 className="mb-1">{titre}</h4>
                      <small>Édité le {dateLocale(new Date())}</small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between flex-wrap gap-2 bg-light rounded p-3 mb-3">
                    <span><strong>Classe :</strong> {classe || "Toutes les classes"}</span>
                    <span><strong>Période :</strong> {libellePeriode}</span>
                    <span><strong>Nombre :</strong> {paiementsSelectionnes.length}</span>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle">
                      <thead>
                        <tr>
                          <th>#</th><th>Matricule</th><th>Élève</th><th>Classe</th>
                          <th>Motif</th><th>Tranche</th><th>Montant</th><th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paiementsSelectionnes.map((paiement, index) => (
                          <tr key={`${paiement.id}-${index}`}>
                            <td>{index + 1}</td>
                            <td>{valeur(paiement, "eleve.matricule")}</td>
                            <td>{[valeur(paiement, "eleve.name", ""), valeur(paiement, "eleve.last_name", ""), valeur(paiement, "eleve.first_name", "")].filter(Boolean).join(" ")}</td>
                            <td>{valeur(paiement, "classe.name")}</td>
                            <td>{valeur(paiement, "motif.name")}</td>
                            <td>{valeur(paiement, "tranche.name")}</td>
                            <td>{paiement.montant} {valeur(paiement, "devise.name", "")}</td>
                            <td>{dateLocale(paiement.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-end flex-wrap gap-2 mt-3">
                    {Object.entries(totaux).map(([devise, total]) => (
                      <div key={devise} className="border border-primary rounded px-3 py-2">
                        <small className="d-block text-muted">Total {devise}</small>
                        <strong className="text-primary">
                          {total.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} {devise}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={() => setOuvert(false)}>Fermer</button>
                <button className="btn btn-primary" type="button" onClick={imprimer}>
                  <i className="bi bi-printer me-1"></i> Imprimer
                </button>
                <button className="btn btn-primary" type="button" disabled={telechargement} onClick={telecharger}>
                  <i className="bi bi-download me-1"></i>
                  {telechargement ? "Préparation…" : "Télécharger PDF"}
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
