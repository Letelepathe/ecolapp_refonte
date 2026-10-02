const valeursActives = new Set([
  "1",
  "true",
  "active",
  "actif",
  "ouverte",
  "ouvert",
]);

export const estAnneeScolaireActive = (annee) => {
  if (!annee) return false;

  const valeur =
    annee.status ??
    annee.statut ??
    annee.active ??
    annee.actif ??
    annee.is_active;

  return valeursActives.has(String(valeur).trim().toLowerCase());
};

export const obtenirAnneeScolaireActive = (annees = []) =>
  annees.find(estAnneeScolaireActive) || null;

export const libelleAnneeScolaire = (annee) =>
  annee?.name ??
  annee?.nom ??
  annee?.libelle ??
  annee?.annee ??
  "";
