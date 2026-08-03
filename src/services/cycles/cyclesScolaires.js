export const DIRECTIONS_CYCLES = Object.freeze({
  maternelle: 1,
  primaire: 2,
  secondaire: 3,
});

export const obtenirDirectionCycle = (cycle) => {
  const direction = DIRECTIONS_CYCLES[String(cycle || "").toLowerCase()];
  if (!direction) {
    throw new Error(`Cycle scolaire inconnu : ${cycle || "non renseigné"}.`);
  }
  return direction;
};
