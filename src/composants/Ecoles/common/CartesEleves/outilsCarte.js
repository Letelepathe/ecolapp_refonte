import { API_BASE_URL, PUBLIC_BASE_URL, urlPublic } from "../../../api/api";

export const URL_API = API_BASE_URL;
export const URL_PUBLIC = PUBLIC_BASE_URL;

export const idEleve = (eleve) => String(eleve?.id ?? eleve?.matricule ?? "");

export const maj = (val) => String(val || "").trim().toUpperCase();

export const anneeSco = (eleve) =>
  eleve?.annee?.name ||
  eleve?.annee_scolaire?.name ||
  eleve?.anneeScolaire?.name ||
  "2024-2025";

export const anneeCarte = (annee) => {
  const result = String(annee || "").match(/(\d{4})\s*$/);
  return result ? result[1] : new Date().getFullYear();
};

export const nomCls = (eleve) => eleve?.classe?.name || eleve?.classe_name || "";
export const nomOpt = (eleve) => eleve?.option?.name || eleve?.option_name || "";

export const numCarte = (eleve) => String(eleve?.id || eleve?.matricule || "0").padStart(3, "0");

export const infosVille = (ecole) => ecole?.ville || ecole?.commune || "";

export const infosProvince = (ecole) =>
  ecole?.province_educationnelle?.province?.name ||
  ecole?.province?.name ||
  ecole?.province ||
  "";

export const chefEtab = (ecole) =>
  ecole?.chef_etablissement ||
  ecole?.chefEtablissement ||
  ecole?.directeur ||
  ecole?.prefet ||
  "Chef d'Etablissement";

export const valPhoto = (eleve) =>
  eleve?.photo ||
  eleve?.photo_eleve ||
  eleve?.photo_profil ||
  eleve?.image ||
  eleve?.avatar ||
  "";

export const urlPhoto = (eleve) => {
  const photo = valPhoto(eleve);

  if (!photo) return "";
  if (/^https?:\/\//i.test(photo)) return photo;

  const photoNet = String(photo).replace(/^\/+/, "");
  if (photoNet.includes("/")) return urlPublic(photoNet);

  return urlPublic(`public/Eleves/${photoNet}`);
};

export const txtRecherche = (eleve) =>
  [eleve.name, eleve.last_name, eleve.first_name, eleve.matricule]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const payloadQrEleve = (eleve, ecole) => JSON.stringify({
  type: "eleve",
  id: eleve?.id,
  matricule: eleve?.matricule,
  nom: [eleve?.name, eleve?.last_name, eleve?.first_name].filter(Boolean).join(" "),
  ecole_id: eleve?.ecole_id || ecole?.id || localStorage.getItem("ecole_id"),
  direction: eleve?.direction || localStorage.getItem("direction"),
  classe_id: eleve?.classes_id || eleve?.classe?.id,
  option_id: eleve?.options_id || eleve?.option?.id,
});

export const urlQr = (payload, taille = 112) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${taille}x${taille}&margin=8&data=${encodeURIComponent(payload)}`;
