import React, { useEffect, useMemo, useRef, useState } from "react";
import LogoEcoleApp from "../../../../static/images/logo_ecolapp.jpg";
import { api, messageErreur } from "../../../api/api";
import {
  imprimerListeFinanciere,
  telechargerDocumentPdf,
} from "../../../common/impressionDocuments";
import { obtenirUrlLogoEcole } from "../../../../services/ecoles/ecoleAssets";

const DECoupages = [
  ["annee", "Année scolaire"],
  ["trimestre_1", "Premier trimestre"],
  ["trimestre_2", "Deuxième trimestre"],
  ["trimestre_3", "Troisième trimestre"],
  ["semestre_1", "Premier semestre"],
  ["semestre_2", "Deuxième semestre"],
  ["jour", "Un jour"],
  ["personnalisee", "Période personnalisée"],
];

const nombre = (valeur) =>
  Number(valeur || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });

const EtatFinancierGlobal = () => {
  const [ouvert, setOuvert] = useState(false);
  const [chargementRefs, setChargementRefs] = useState(false);
  const [generation, setGeneration] = useState(false);
  const [telechargement, setTelechargement] = useState(false);
  const [classes, setClasses] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [ecole, setEcole] = useState(null);
  const [rapport, setRapport] = useState(null);
  const [erreur, setErreur] = useState("");
  const [filtres, setFiltres] = useState({
    annee_id: "",
    classe_id: "",
    motif_id: "",
    decoupage: "annee",
    jour: "",
    date_debut: "",
    date_fin: "",
  });
  const documentRef = useRef(null);
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");

  useEffect(() => {
    if (!ouvert || !ecoleId || !direction) return;

    setChargementRefs(true);
    setErreur("");
    Promise.all([
      api.get(`/classe/ecole/${ecoleId}/direction/${direction}`),
      api.get(`/annee/ecole/${ecoleId}/direction/${direction}`),
      api.get(`/motif/ecole/${ecoleId}/direction/${direction}`),
      api.get(`/ecole/ecole_id/${ecoleId}`),
    ])
      .then(([classesResponse, anneesResponse, motifsResponse, ecoleResponse]) => {
        const listeAnnees = anneesResponse.data?.anneeAll || [];
        setClasses(classesResponse.data?.classesAll || []);
        setAnnees(listeAnnees);
        setMotifs(motifsResponse.data?.motifAll || []);
        setEcole(ecoleResponse.data?.ecole || null);
        setFiltres((anciens) => ({
          ...anciens,
          annee_id:
            anciens.annee_id ||
            String(listeAnnees.find((annee) => Number(annee.status) === 1)?.id || listeAnnees[0]?.id || ""),
        }));
      })
      .catch((cause) => setErreur(messageErreur(cause, "Impossible de charger les filtres.")))
      .finally(() => setChargementRefs(false));
  }, [direction, ecoleId, ouvert]);

  const modifierFiltre = (event) => {
    const { name, value } = event.target;
    setFiltres((anciens) => ({ ...anciens, [name]: value }));
    setRapport(null);
    setErreur("");
  };

  const generer = async () => {
    if (!filtres.annee_id) {
      setErreur("Choisissez une année scolaire.");
      return;
    }

    setGeneration(true);
    setErreur("");
    try {
      const response = await api.get(
        `/ecoles/${ecoleId}/directions/${direction}/etat-financier`,
        { params: filtres }
      );
      setRapport(response.data?.data || null);
    } catch (cause) {
      setRapport(null);
      setErreur(messageErreur(cause, "L'état financier n'a pas pu être généré."));
    } finally {
      setGeneration(false);
    }
  };

  const anneeSelectionnee = useMemo(
    () => annees.find((annee) => String(annee.id) === String(filtres.annee_id)),
    [annees, filtres.annee_id]
  );

  const imprimer = () =>
    imprimerListeFinanciere(documentRef.current, "État financier global");

  const telecharger = async () => {
    setTelechargement(true);
    await telechargerDocumentPdf(documentRef.current, {
      nomFichier: "etat-financier-global.pdf",
      orientation: "landscape",
      format: "a4",
      marge: 7,
      pagination: true,
    });
    setTelechargement(false);
  };

  return (
    <>
      <button className="btn mb-3" type="button" onClick={() => setOuvert(true)}>
        <i className="bi bi-file-earmark-spreadsheet me-1"></i>
        État financier global
      </button>

      {ouvert && (
        <div className="modal d-block" role="dialog" aria-modal="true" style={{ backgroundColor: "rgba(0,0,0,.45)" }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">État financier global</h5>
                <button className="btn-close" type="button" aria-label="Fermer" onClick={() => setOuvert(false)} />
              </div>
              <div className="modal-body">
                {chargementRefs ? (
                  <p>Chargement des filtres…</p>
                ) : (
                  <div className="row g-3 mb-3 hide-on-print">
                    <div className="col-md-3">
                      <label className="form-label">Année scolaire</label>
                      <select className="form-select" name="annee_id" value={filtres.annee_id} onChange={modifierFiltre}>
                        <option value="">Choisir</option>
                        {annees.map((annee) => <option key={annee.id} value={annee.id}>{annee.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Classe</label>
                      <select className="form-select" name="classe_id" value={filtres.classe_id} onChange={modifierFiltre}>
                        <option value="">Toutes les classes</option>
                        {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Motif</label>
                      <select className="form-select" name="motif_id" value={filtres.motif_id} onChange={modifierFiltre}>
                        <option value="">Tous les motifs</option>
                        {motifs.map((motif) => <option key={motif.id} value={motif.id}>{motif.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Calendrier</label>
                      <select className="form-select" name="decoupage" value={filtres.decoupage} onChange={modifierFiltre}>
                        {DECoupages.map(([id, libelle]) => <option key={id} value={id}>{libelle}</option>)}
                      </select>
                    </div>
                    {filtres.decoupage === "jour" && (
                      <div className="col-md-3">
                        <label className="form-label">Jour</label>
                        <input className="form-control" type="date" name="jour" value={filtres.jour} onChange={modifierFiltre} />
                      </div>
                    )}
                    {filtres.decoupage === "personnalisee" && (
                      <>
                        <div className="col-md-3">
                          <label className="form-label">Du</label>
                          <input className="form-control" type="date" name="date_debut" value={filtres.date_debut} onChange={modifierFiltre} />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Au</label>
                          <input className="form-control" type="date" name="date_fin" value={filtres.date_fin} onChange={modifierFiltre} />
                        </div>
                      </>
                    )}
                    <div className="col-12">
                      <button className="btn btn-primary" type="button" disabled={generation} onClick={generer}>
                        {generation ? "Calcul en cours…" : "Générer l'état"}
                      </button>
                    </div>
                  </div>
                )}

                {erreur && <div className="alert alert-danger">{erreur}</div>}

                {rapport && (
                  <div ref={documentRef} className="bg-white p-3">
                    <header className="d-flex justify-content-between align-items-start border-bottom border-primary border-2 pb-3 mb-3">
                      <div className="d-flex gap-3 align-items-center">
                        <img
                          src={obtenirUrlLogoEcole(ecole, LogoEcoleApp)}
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
                        <h4 className="mb-1">État financier global</h4>
                        <small>{anneeSelectionnee?.name} · {rapport.calendrier?.libelle}</small>
                        <div><small>Du {rapport.calendrier?.date_debut} au {rapport.calendrier?.date_fin}</small></div>
                      </div>
                    </header>

                    <div className="alert alert-light py-2">
                      {rapport.nombre_eleves} élève(s). Les paiements affichés sont cumulés jusqu'à la fin de la période.
                    </div>

                    {rapport.motifs?.map((motif) => (
                      <section key={motif.motif_id} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center bg-primary text-white rounded-top px-3 py-2">
                          <strong>{motif.motif}</strong>
                          <span>{motif.devise || ""}</span>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered align-middle mb-0">
                            <thead>
                              <tr>
                                <th>Matricule</th><th>Élève</th><th>Classe</th>
                                {motif.tranches.map((tranche) => {
                                  const du = motif.eleves.reduce((somme, ligne) => {
                                    const detail = ligne.tranches.find((item) => item.tranche_id === tranche.id);
                                    return somme + Number(detail?.montant_du || 0);
                                  }, 0);
                                  return <th key={tranche.id}>{tranche.nom}<small className="d-block">Dû : {nombre(du)}</small></th>;
                                })}
                                <th>Total dû</th><th>Total payé</th><th>Reste</th>
                              </tr>
                            </thead>
                            <tbody>
                              {motif.eleves.map((ligne) => (
                                <tr key={ligne.eleve_id}>
                                  <td>{ligne.matricule}</td><td>{ligne.nom}</td><td>{ligne.classe}</td>
                                  {motif.tranches.map((tranche) => {
                                    const detail = ligne.tranches.find((item) => item.tranche_id === tranche.id);
                                    return (
                                      <td key={tranche.id}>
                                        {!detail?.applicable ? "N/A" : (
                                          <>
                                            <strong>{nombre(detail?.montant_paye)}</strong>
                                            <small className="d-block text-muted">Reste {nombre(detail?.reste)}</small>
                                          </>
                                        )}
                                      </td>
                                    );
                                  })}
                                  <td>{nombre(ligne.total_du)}</td>
                                  <td>{nombre(ligne.total_paye)}</td>
                                  <td>{nombre(ligne.reste)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="fw-bold">
                                <td colSpan={3 + motif.tranches.length}>Totaux {motif.motif}</td>
                                <td>{nombre(motif.totaux.du)}</td>
                                <td>{nombre(motif.totaux.paye)}</td>
                                <td>{nombre(motif.totaux.reste)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={() => setOuvert(false)}>Fermer</button>
                {rapport && (
                  <>
                    <button className="btn btn-primary" type="button" onClick={imprimer}>Imprimer</button>
                    <button className="btn btn-primary" type="button" disabled={telechargement} onClick={telecharger}>
                      {telechargement ? "Préparation…" : "Télécharger PDF"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EtatFinancierGlobal;
