const nombre = (valeur) => {
  const resultat = Number(valeur);
  return Number.isFinite(resultat) ? resultat : 0;
};

const erreur = (code, message) => ({ niveau: "erreur", code, message });
const avertissement = (code, message) => ({
  niveau: "avertissement",
  code,
  message,
});
const succes = (code, message) => ({ niveau: "succes", code, message });

export const STATUTS_CONFIGURATION_TRANCHE = {
  BROUILLON: "brouillon",
  ACTIVE: "active",
  CLOTUREE: "cloturee",
};

export const validerConfigurationTranche = ({
  configuration,
  configurations = [],
  types = [],
  montantMotif = 0,
  aEnveloppeMotif = false,
}) => {
  const controles = [];
  const montantNormal = nombre(configuration.montantNormal);

  if (!configuration.nom?.trim()) {
    controles.push(erreur("nom_requis", "Le nom de la tranche est requis."));
  }
  if (!configuration.motifId) {
    controles.push(erreur("motif_requis", "Sélectionnez un motif."));
  }
  if (!configuration.anneeId) {
    controles.push(
      erreur(
        "annee_requise",
        "Sélectionnez une année scolaire. Si nécessaire, activez-la d'abord dans la gestion des années."
      )
    );
  }
  if (
    configuration.montantNormal === "" ||
    configuration.montantNormal === null ||
    montantNormal < 0
  ) {
    controles.push(
      erreur(
        "montant_invalide",
        "Le montant normal doit être un nombre positif ou nul."
      )
    );
  }
  if (
    configuration.statut === STATUTS_CONFIGURATION_TRANCHE.ACTIVE &&
    montantNormal <= 0
  ) {
    controles.push(
      erreur(
        "montant_actif_nul",
        "Une tranche active doit avoir un montant normal supérieur à zéro."
      )
    );
  }
  if (
    configuration.statut === STATUTS_CONFIGURATION_TRANCHE.ACTIVE &&
    !configuration.ordre
  ) {
    controles.push(
      erreur(
        "ordre_actif_requis",
        "Indiquez l'ordre avant d'activer la tranche."
      )
    );
  }
  if (configuration.ordre && nombre(configuration.ordre) < 1) {
    controles.push(
      erreur("ordre_invalide", "L'ordre doit être un nombre supérieur à zéro.")
    );
  }

  const autres = configurations.filter(
    (element) =>
      String(element.trancheId) !== String(configuration.trancheId) &&
      String(element.motifId) === String(configuration.motifId) &&
      String(element.anneeId) === String(configuration.anneeId)
  );
  const ordreDuplique =
    configuration.ordre &&
    autres.some(
      (element) => String(element.ordre) === String(configuration.ordre)
    );
  if (ordreDuplique) {
    controles.push(
      erreur(
        "ordre_duplique",
        "Une autre tranche utilise déjà cet ordre pour ce motif et cette année."
      )
    );
  }

  const totalAutres = autres.reduce(
    (total, element) => total + nombre(element.montantNormal),
    0
  );
  const totalAvecTranche = totalAutres + montantNormal;
  if (aEnveloppeMotif && totalAvecTranche > nombre(montantMotif)) {
    controles.push(
      erreur(
        "enveloppe_depassee",
        `La répartition dépasse le montant du motif de ${(totalAvecTranche - nombre(montantMotif)).toLocaleString("fr-FR")}.`
      )
    );
  } else if (
    aEnveloppeMotif &&
    configuration.statut === STATUTS_CONFIGURATION_TRANCHE.ACTIVE &&
    totalAvecTranche < nombre(montantMotif)
  ) {
    controles.push(
      avertissement(
        "enveloppe_incomplete",
        `Il reste ${(nombre(montantMotif) - totalAvecTranche).toLocaleString("fr-FR")} à répartir sur ce motif.`
      )
    );
  }

  configuration.reglements.forEach((reglement) => {
    const type = types.find(
      (element) => String(element.id) === String(reglement.typeEleveId)
    );
    const nomType = type?.nom || "Type d'élève inconnu";
    if (
      reglement.applicable !== false &&
      nombre(reglement.montant) > montantNormal
    ) {
      controles.push(
        erreur(
          `montant_type_${reglement.typeEleveId}`,
          `Le montant de « ${nomType} » dépasse le montant normal de la tranche.`
        )
      );
    }
    if (reglement.applicable === false && nombre(reglement.montant) !== 0) {
      controles.push(
        erreur(
          `non_applicable_${reglement.typeEleveId}`,
          `Le montant de « ${nomType} » doit être zéro lorsque la règle est « Non applicable ».`
        )
      );
    }
  });

  if (!configuration.echeance) {
    controles.push(
      avertissement(
        "echeance_absente",
        "Aucune échéance n'est indiquée. Le paiement restera autorisé."
      )
    );
  }
  if (!controles.some((controle) => controle.niveau === "erreur")) {
    controles.unshift(
      succes(
        "configuration_coherente",
        "Les règles bloquantes de cette configuration sont cohérentes."
      )
    );
  }

  return {
    controles,
    erreurs: controles.filter((controle) => controle.niveau === "erreur"),
    avertissements: controles.filter(
      (controle) => controle.niveau === "avertissement"
    ),
    estValide: !controles.some((controle) => controle.niveau === "erreur"),
    totalAutres,
    totalAvecTranche,
    resteMotif: aEnveloppeMotif
      ? nombre(montantMotif) - totalAvecTranche
      : null,
  };
};
