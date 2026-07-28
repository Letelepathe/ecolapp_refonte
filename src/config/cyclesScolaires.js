const commun = {
  utiliseOptions: true,
  utiliseSections: true,
  utiliseSemestres: false,
  utiliseTrimestres: true,
  utiliseTitulaireClasse: true,
  ageMinimum: null,
  ageMaximum: null,
  utilisePeriodes: true,
  modeEvaluation: "notes",
  libelles: {
    classe: "Classe",
    classes: "Classes",
    cours: "Cours",
    titulaire: "Titulaire",
  },
};

export const CONFIG_CYCLES = {
  secondaire: {
    ...commun,
    utiliseSemestres: true,
    utiliseTrimestres: false,
    utiliseTitulaireClasse: false,
    libelles: {
      classe: "Classe",
      classes: "Classes",
      cours: "Cours",
      titulaire: "Titulaire",
    },
  },
  primaire: {
    ...commun,
    utiliseOptions: false,
    utiliseSections: false,
    ageMinimum: 6,
    libelles: {
      classe: "Classe primaire",
      classes: "Classes primaires",
      cours: "Branches",
      titulaire: "Titulaire de classe",
    },
    niveaux: [
      "1re primaire",
      "2e primaire",
      "3e primaire",
      "4e primaire",
      "5e primaire",
      "6e primaire",
    ],
  },
  maternelle: {
    ...commun,
    utiliseOptions: false,
    utiliseSections: false,
    ageMinimum: 3,
    ageMaximum: 5,
    utilisePeriodes: false,
    modeEvaluation: "competences",
    libelles: {
      classe: "Classe maternelle",
      classes: "Classes maternelles",
      cours: "Activités d'éveil",
      titulaire: "Éducateur titulaire",
    },
    niveaux: [
      "1re année maternelle (3 ans)",
      "2e année maternelle (4 ans)",
      "3e année maternelle (5 ans)",
    ],
    domainesActivites: [
      "Activités de langage",
      "Activités sensorielles",
      "Activités mathématiques",
      "Activités d'arts plastiques",
      "Activités musicales",
      "Activités libres",
      "Activités psychomotrices",
      "Activités physiques",
      "Activités de comportement",
      "Activités de vie pratique",
      "Activités exploratoires",
      "Activités de promotion de la santé",
    ],
  },
};

export const obtenirConfigCycle = (cycle) =>
  CONFIG_CYCLES[cycle] || CONFIG_CYCLES.secondaire;

const texteNormalise = (valeur = "") =>
  valeur
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const choisirOptionCompatibilite = (options = [], cycle) => {
  if (obtenirConfigCycle(cycle).utiliseOptions) return "";

  const optionNeutre = options.find((option) => {
    const nom = texteNormalise(option.name || option.nom);
    return (
      nom.includes("sans option") ||
      nom.includes("primaire") ||
      nom.includes("maternelle") ||
      nom.includes("generale")
    );
  });
  return optionNeutre?.id || "";
};
