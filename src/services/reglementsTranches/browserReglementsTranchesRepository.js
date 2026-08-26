const PREFIXE = "ecolapp:reglements-tranches:v1";

const cle = ({ ecoleId, direction }) =>
  `${PREFIXE}:${String(ecoleId)}:${String(direction)}`;

const lire = (contexte) => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(cle(contexte)) || "[]");
  } catch {
    return [];
  }
};

const ecrire = (contexte, configurations) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cle(contexte), JSON.stringify(configurations));
};

export const browserReglementsTranchesRepository = {
  async lister(contexte) {
    return lire(contexte);
  },

  async obtenir(contexte, trancheId) {
    return (
      lire(contexte).find(
        (configuration) =>
          String(configuration.trancheId) === String(trancheId)
      ) || null
    );
  },

  async enregistrer(contexte, configuration) {
    const configurations = lire(contexte);
    const maintenant = new Date().toISOString();
    const precedente = configurations.find(
      (element) =>
        String(element.trancheId) === String(configuration.trancheId)
    );
    const normalisee = {
      trancheId: configuration.trancheId,
      motifId: configuration.motifId || "",
      montantNormal: Math.max(0, Number(configuration.montantNormal) || 0),
      deviseId: configuration.deviseId || "",
      anneeId: configuration.anneeId || "",
      ordre: configuration.ordre || "",
      echeance: configuration.echeance || "",
      statut: configuration.statut || "brouillon",
      reglements: (configuration.reglements || []).map((reglement) => ({
        typeEleveId: reglement.typeEleveId,
        applicable: reglement.applicable !== false,
        montant: Math.max(0, Number(reglement.montant) || 0),
        actif: reglement.actif !== false,
      })),
      modifieLe: maintenant,
      creeLe: configuration.creeLe || maintenant,
      activeLe:
        configuration.statut === "active"
          ? configuration.activeLe || maintenant
          : configuration.activeLe || null,
      clotureeLe:
        configuration.statut === "cloturee"
          ? configuration.clotureeLe || maintenant
          : configuration.clotureeLe || null,
      historique: [
        ...(precedente?.historique || []),
        {
          modifieLe: maintenant,
          statutAvant: precedente?.statut || null,
          statutApres: configuration.statut || "brouillon",
          montantAvant: precedente?.montantNormal ?? null,
          montantApres: Math.max(
            0,
            Number(configuration.montantNormal) || 0
          ),
        },
      ].slice(-50),
    };
    const suivants = configurations.filter(
      (element) =>
        String(element.trancheId) !== String(normalisee.trancheId)
    );
    suivants.push(normalisee);
    ecrire(contexte, suivants);
    return normalisee;
  },
};
