export const getAgeMinimumEleveError = (dateNaissance, ageMinimum) => {
  if (!dateNaissance) {
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

  if (birthDate > new Date()) {
    return "La date de naissance ne peut pas être dans le futur";
  }

  if (!ageMinimum) {
    return "";
  }

  const today = new Date();
  const minimumBirthDate = new Date(
    today.getFullYear() - ageMinimum,
    today.getMonth(),
    today.getDate()
  );

  if (birthDate > minimumBirthDate) {
    return `L'enfant doit avoir au moins ${ageMinimum} ans pour ce cycle.`;
  }

  return "";
};

export const getAgeEleveError = (
  dateNaissance,
  ageMinimum,
  ageMaximum = null
) => {
  if (!dateNaissance) return "";

  const erreurMinimum = getAgeMinimumEleveError(dateNaissance, ageMinimum);
  if (erreurMinimum) return erreurMinimum;

  if (!ageMaximum) return "";

  const [year, month, day] = dateNaissance.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const anniversairePasse =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!anniversairePasse) age -= 1;

  return age > ageMaximum
    ? `La maternelle accueille les enfants de ${ageMinimum} à ${ageMaximum} ans.`
    : "";
};

export const getErreurPourcentageFacultatif = (valeur) => {
  const texte = String(valeur ?? "").trim().replace(",", ".");
  if (!texte) return "";

  const nombre = Number(texte);
  return Number.isFinite(nombre) && nombre >= 0 && nombre <= 100
    ? ""
    : "Le pourcentage doit être compris entre 0 et 100";
};

export const normaliserChampFacultatif = (valeur) => {
  const texte = String(valeur ?? "").trim();
  return texte || null;
};

export const normaliserPourcentageFacultatif = (valeur) => {
  const texte = String(valeur ?? "").trim().replace(",", ".");
  return texte || null;
};
