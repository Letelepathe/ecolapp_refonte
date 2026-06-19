export const AGE_MINIMUM_ELEVE_MESSAGE =
  "La date de naissance d'un élève doit correspondre à au moins 3 ans pour la maternelle et 5 ans pour le primaire.";

export const getAgeMinimumEleveError = (dateNaissance, ageMinimum) => {
  if (!dateNaissance) {
    return "Date de naissance requise";
  }

  if (!ageMinimum) {
    return "";
  }

  const [year, month, day] = dateNaissance.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);

  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return "Date de naissance invalide";
  }

  const today = new Date();
  const minimumBirthDate = new Date(
    today.getFullYear() - ageMinimum,
    today.getMonth(),
    today.getDate()
  );

  if (birthDate > minimumBirthDate) {
    return AGE_MINIMUM_ELEVE_MESSAGE;
  }

  return "";
};
