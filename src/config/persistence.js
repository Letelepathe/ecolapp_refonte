const SOURCES_AUTORISEES = new Set(["api", "browser"]);

export const choisirSourcePersistance = (valeur) => {
  const source = String(valeur || "api").trim().toLowerCase();
  return SOURCES_AUTORISEES.has(source) ? source : "api";
};
