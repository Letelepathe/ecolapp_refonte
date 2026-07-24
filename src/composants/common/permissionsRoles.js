const normaliserRole = (valeur = "") => valeur
  .toString()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[_-]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const ROLES_ADMINISTRATION = new Set([
  "administrateur",
  "administratrice",
  "super administrateur",
  "super administratrice",
  "admin",
  "superadmin",
  "superdmin",
]);

export const estRoleAdministration = (utilisateur) => {
  if (!utilisateur) return false;

  const roles = [
    utilisateur.fonction?.name,
    utilisateur.role?.name,
    utilisateur.role,
    utilisateur.type,
  ].map(normaliserRole).filter(Boolean);

  return roles.some((role) => ROLES_ADMINISTRATION.has(role));
};

export const estRoleEnseignant = (utilisateur) => {
  if (!utilisateur) return false;
  const roles = [utilisateur.fonction?.name, utilisateur.role?.name, utilisateur.role, utilisateur.type]
    .map(normaliserRole)
    .filter(Boolean);
  return roles.some((role) => ["enseignant", "enseignante", "professeur", "titulaire"].some((terme) => role.includes(terme)));
};

export { normaliserRole };
