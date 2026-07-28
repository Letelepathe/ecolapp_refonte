import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  creerContexteTypesEleves,
  listerTypesEleves,
  obtenirTypeParDefaut,
  trouverAttributionTypeEleve,
} from "../../../../services/typesEleves/typesElevesService";
import {
  calculerMontantTranche,
  creerContexteReglements,
  listerConfigurationsTranches,
} from "../../../../services/reglementsTranches/reglementsTranchesService";

const URL_API = "https://api.ecolapp.cd/api";

const montant = (valeur) => {
  const resultat = Number(valeur);
  return Number.isFinite(resultat) ? resultat : 0;
};

const formatMontant = (valeur, devise) =>
  `${montant(valeur).toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })}${devise ? ` ${devise}` : ""}`;

const SituationPaiementEleve = ({
  eleveId,
  motifId,
  trancheId,
  motifs = [],
  tranches = [],
  onTrancheCalculee,
  onSituationCalculee,
}) => {
  const contexte = useMemo(() => creerContexteTypesEleves(), []);
  const contexteReglements = useMemo(() => creerContexteReglements(), []);
  const [situation, setSituation] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [detailsOuverts, setDetailsOuverts] = useState(false);

  useEffect(() => {
    if (!eleveId || !motifId) {
      setSituation(null);
      return;
    }

    const charger = async () => {
      setChargement(true);
      try {
        const [
          reponsePaiements,
          reponseAnnees,
          types,
          typeParDefaut,
          configurations,
        ] =
          await Promise.all([
            axios.get(`${URL_API}/paiement/eleve/${eleveId}`),
            axios.get(
              `${URL_API}/annee/ecole/${contexte.ecoleId}/direction/${contexte.direction}`
            ),
            listerTypesEleves(contexte, { inclureInactifs: true }),
            obtenirTypeParDefaut(contexte),
            listerConfigurationsTranches(contexteReglements),
          ]);
        const annees = reponseAnnees.data.anneeAll || [];
        const anneeActive =
          annees.find((annee) => Number(annee.status) === 1) || annees[0] || null;
        const attribution = await trouverAttributionTypeEleve(contexte, {
          eleveId,
          anneeId: anneeActive?.id,
        });
        const typeEleve =
          types.find(
            (type) => String(type.id) === String(attribution?.typeEleveId)
          ) || typeParDefaut;
        const motif = motifs.find(
          (element) => String(element.id) === String(motifId)
        );
        const paiements = (reponsePaiements.data.paiements || []).filter(
          (paiement) =>
            String(paiement.motifs_id) === String(motifId) &&
            (!anneeActive ||
              String(paiement.annee_id) === String(anneeActive.id))
        );
        const devise =
          motif?.devise?.name ||
          motif?.devise?.symbole ||
          paiements[0]?.devise?.name ||
          "";
        const configurationsUtilisables = configurations.filter(
          (configuration) =>
            configuration.statut !== "brouillon" &&
            (!anneeActive ||
              !configuration.anneeId ||
              String(configuration.anneeId) === String(anneeActive.id))
        );
        const tranchesDuMotif = tranches.filter((tranche) => {
          const configuration = configurationsUtilisables.find(
            (element) =>
              String(element.trancheId) === String(tranche.id)
          );
          return (
            String(tranche.id) === String(trancheId) ||
            String(configuration?.motifId) === String(motifId)
          );
        });
        const lignes = tranchesDuMotif.map((tranche) => {
          const configurationStockee = configurationsUtilisables.find(
            (element) =>
              String(element.trancheId) === String(tranche.id)
          );
          const configuration = configurationStockee || {
            trancheId: tranche.id,
            motifId,
            montantNormal:
              tranche.montant_prevu ??
              tranche.montant ??
              motif?.montant ??
              0,
            reglements: [],
          };
          const calcul = calculerMontantTranche(
            configuration,
            typeEleve?.id
          );
          const prevu = calcul.montant;
          const paye = paiements
            .filter(
              (paiement) =>
                String(paiement.tranches_id) === String(tranche.id)
            )
            .reduce((total, paiement) => total + montant(paiement.montant), 0);
          const reste = Math.max(0, prevu - paye);
          const echeanceDepassee =
            Boolean(configuration.echeance) &&
            new Date(`${configuration.echeance}T23:59:59`) < new Date() &&
            reste > 0;
          return {
            id: tranche.id,
            nom: tranche.name || tranche.nom,
            prevu,
            paye,
            reste,
            applicable: calcul.applicable,
            reglement: calcul.reglement,
            echeance: configuration.echeance || "",
            statut: !calcul.applicable
              ? "Non applicable"
              : reste === 0
                ? "Payée"
                : paye > 0
                  ? echeanceDepassee
                    ? "Partielle · Échue"
                    : "Partielle"
                  : echeanceDepassee
                    ? "Échue"
                    : "Non payée",
          };
        }).sort((a, b) => {
          const configurationA = configurationsUtilisables.find(
            (element) => String(element.trancheId) === String(a.id)
          );
          const configurationB = configurationsUtilisables.find(
            (element) => String(element.trancheId) === String(b.id)
          );
          return (
            Number(configurationA?.ordre || 9999) -
            Number(configurationB?.ordre || 9999)
          );
        });
        const totalPrevu = lignes.reduce((total, ligne) => total + ligne.prevu, 0);
        const totalPaye = lignes.reduce((total, ligne) => total + ligne.paye, 0);

        const situationCalculee = {
          motif,
          typeEleve,
          devise,
          lignes,
          totalPrevu,
          totalPaye,
          totalReste: Math.max(0, totalPrevu - totalPaye),
        };
        setSituation(situationCalculee);
        onSituationCalculee?.(situationCalculee);
        const trancheSelectionnee = lignes.find(
          (ligne) => String(ligne.id) === String(trancheId)
        );
        onTrancheCalculee?.(trancheSelectionnee || null);
      } catch {
        setSituation(null);
        onTrancheCalculee?.(null);
        onSituationCalculee?.(null);
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, [
    contexte,
    contexteReglements,
    eleveId,
    motifId,
    trancheId,
    motifs,
    tranches,
    onTrancheCalculee,
    onSituationCalculee,
  ]);

  if (!eleveId || !motifId) return null;
  if (chargement) return <p className="small text-muted mt-2">Calcul de la situation…</p>;
  if (!situation) return null;

  const prochaineTranche =
    situation.lignes.find((ligne) => String(ligne.id) === String(trancheId)) ||
    situation.lignes.find((ligne) => ligne.reste > 0) ||
    situation.lignes.at(-1);

  return (
    <>
      <div className="border rounded p-3 mt-3 bg-light">
        <div className="d-flex justify-content-between gap-2 align-items-start">
          <div>
            <strong>{situation.motif?.name || "Situation financière"}</strong>
            <div className="small text-muted">
              {situation.typeEleve?.nom || "Ordinaire"} · Montants définis par tranche
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setDetailsOuverts(true)}
          >
            Voir les détails
          </button>
        </div>
        <div className="d-flex flex-wrap gap-3 mt-2">
          <span>Prévu : <strong>{formatMontant(situation.totalPrevu, situation.devise)}</strong></span>
          <span>Payé : <strong>{formatMontant(situation.totalPaye, situation.devise)}</strong></span>
          <span>Reste : <strong>{formatMontant(situation.totalReste, situation.devise)}</strong></span>
        </div>
        {prochaineTranche && (
          <div className="small mt-2">
            {prochaineTranche.nom} : {formatMontant(prochaineTranche.reste, situation.devise)} restant
          </div>
        )}
      </div>

      {detailsOuverts && (
        <div className="custom-modal" role="dialog" aria-modal="true" aria-labelledby="titre-situation-paiement">
          <div className="modal-content">
            <div className="d-flex justify-content-between gap-2 align-items-start">
              <div>
                <h2 id="titre-situation-paiement" className="h5 mb-1">
                  Détail du paiement
                </h2>
                <p className="text-muted mb-3">
                  {situation.motif?.name} · {situation.typeEleve?.nom}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setDetailsOuverts(false)}
              >
                Fermer
              </button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Tranche</th>
                    <th>Prévu</th>
                    <th>Payé</th>
                    <th>Reste</th>
                    <th>Échéance</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {situation.lignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td>{ligne.nom}</td>
                      <td>{formatMontant(ligne.prevu, situation.devise)}</td>
                      <td>{formatMontant(ligne.paye, situation.devise)}</td>
                      <td>{formatMontant(ligne.reste, situation.devise)}</td>
                      <td>{ligne.echeance || "Non définie"}</td>
                      <td>{ligne.statut}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold">
                    <td>Total</td>
                    <td>{formatMontant(situation.totalPrevu, situation.devise)}</td>
                    <td>{formatMontant(situation.totalPaye, situation.devise)}</td>
                    <td>{formatMontant(situation.totalReste, situation.devise)}</td>
                    <td />
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SituationPaiementEleve;
