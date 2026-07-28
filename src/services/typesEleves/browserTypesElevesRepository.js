const PREFIXE = "ecolapp:types-eleves:v1";

const contexteValide = ({ ecoleId, direction }) =>
  String(ecoleId || "").trim() && String(direction || "").trim();

const cle = ({ ecoleId, direction }) =>
  `${PREFIXE}:${String(ecoleId)}:${String(direction)}`;

const lire = (contexte) => {
  if (!contexteValide(contexte) || typeof window === "undefined") return null;

  try {
    return JSON.parse(window.localStorage.getItem(cle(contexte)) || "null");
  } catch {
    return null;
  }
};

const ecrire = (contexte, valeur) => {
  if (!contexteValide(contexte) || typeof window === "undefined") return;
  window.localStorage.setItem(cle(contexte), JSON.stringify(valeur));
};

const creerEtatInitial = () => ({
  version: 2,
  types: [
    {
      id: "ordinaire",
      nom: "Ordinaire",
      description: "Régime financier normal de l'école.",
      actif: true,
      estTypeParDefaut: true,
      creeLe: new Date().toISOString(),
    },
  ],
  attributions: [],
});

const obtenirEtat = (contexte) => {
  const existant = lire(contexte);
  if (existant?.types?.length) {
    if (Number(existant.version) >= 2) return existant;

    const migre = {
      ...existant,
      version: 2,
      types: existant.types.map((type) => {
        const { regles, ...sansRegles } = type;
        return {
          ...sansRegles,
          reglesLegacy: Array.isArray(regles) ? regles : [],
        };
      }),
    };
    ecrire(contexte, migre);
    return migre;
  }

  const initial = creerEtatInitial();
  ecrire(contexte, initial);
  return initial;
};

const identifiant = () =>
  globalThis.crypto?.randomUUID?.() ||
  `type-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const browserTypesElevesRepository = {
  async listerTypes(contexte, { inclureInactifs = false } = {}) {
    const types = obtenirEtat(contexte).types;
    return inclureInactifs ? types : types.filter((type) => type.actif);
  },

  async enregistrerType(contexte, typeEleve) {
    const etat = obtenirEtat(contexte);
    const maintenant = new Date().toISOString();
    const type = {
      ...typeEleve,
      id: typeEleve.id || identifiant(),
      actif: typeEleve.actif !== false,
      estTypeParDefaut: Boolean(typeEleve.estTypeParDefaut),
      reglesLegacy:
        typeEleve.reglesLegacy ||
        etat.types.find((element) => element.id === typeEleve.id)
          ?.reglesLegacy ||
        [],
      modifieLe: maintenant,
      creeLe: typeEleve.creeLe || maintenant,
    };

    let types = etat.types.filter((element) => element.id !== type.id);
    if (type.estTypeParDefaut) {
      types = types.map((element) => ({ ...element, estTypeParDefaut: false }));
    }
    types.push(type);

    if (!types.some((element) => element.estTypeParDefaut && element.actif)) {
      types = types.map((element, index) => ({
        ...element,
        estTypeParDefaut: index === 0,
      }));
    }

    ecrire(contexte, { ...etat, types });
    return type;
  },

  async attribuerType(contexte, attribution) {
    const etat = obtenirEtat(contexte);
    const nouvelle = {
      ...attribution,
      id: attribution.id || identifiant(),
      attribueLe: attribution.attribueLe || new Date().toISOString(),
    };
    const memeInscription = (element) =>
      String(element.inscriptionId || "") === String(nouvelle.inscriptionId || "") &&
      String(element.anneeId || "") === String(nouvelle.anneeId || "");
    const attributions = [
      ...etat.attributions.filter((element) => !memeInscription(element)),
      nouvelle,
    ];

    ecrire(contexte, { ...etat, attributions });
    return nouvelle;
  },

  async trouverAttribution(contexte, { inscriptionId, eleveId, anneeId } = {}) {
    const attributions = obtenirEtat(contexte).attributions;
    return [...attributions].reverse().find((element) => {
      const memeAnnee = !anneeId || String(element.anneeId) === String(anneeId);
      const memeInscription =
        inscriptionId && String(element.inscriptionId) === String(inscriptionId);
      const memeEleve = eleveId && String(element.eleveId) === String(eleveId);
      return memeAnnee && (memeInscription || memeEleve);
    }) || null;
  },
};
