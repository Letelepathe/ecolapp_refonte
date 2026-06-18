import axios from "axios";

export const URL_API = "https://api.ecolapp.cd/api";

export const champsReq = [
  "name",
  "first_name",
  "last_name",
  "sexe",
  "date_naissance",
  "lieu_de_naissance",
  "adresse",
  "code_parent",
  "annee_id",
  "classes_id",
  "options_id",
];

export const nomsChamps = {
  name: "Nom",
  first_name: "Prénom",
  last_name: "Postnom",
  sexe: "Sexe",
  date_naissance: "Date de naissance",
  lieu_de_naissance: "Lieu de naissance",
  adresse: "Adresse",
  code_parent: "Code parent",
  annee_id: "Année scolaire",
  classes_id: "Classe",
  options_id: "Option",
};

const champsIdNum = [
  "users_id",
  "annee_id",
  "ecole_id",
  "classes_id",
  "options_id",
  "direction",
];

const enIntSiNum = (valeur) => {
  const txt = String(valeur ?? "").trim();

  if (!txt) return valeur;

  return /^\d+$/.test(txt) ? parseInt(txt, 10) : valeur;
};

const prepEleve = ({ eleve, userId, ecoleId, direction }) => {
  const data = {
    ...eleve,
    users_id: userId,
    ecole_id: ecoleId,
    direction,
  };

  champsIdNum.forEach((champ) => {
    data[champ] = enIntSiNum(data[champ]);
  });

  return data;
};

export const creerEleveVide = (ecoleId, direction) => ({
  name: "",
  first_name: "",
  last_name: "",
  sexe: "Homme",
  lieu_de_naissance: "",
  date_naissance: "",
  adresse: "",
  code_parent: "",
  description: "",
  classes_id: "",
  options_id: "",
  users_id: "",
  annee_id: "",
  ecole_id: ecoleId,
  direction,
});

export const validerEleve = (eleve) => {
  const err = {};

  champsReq.forEach((champ) => {
    if (!String(eleve[champ] || "").trim()) {
      err[champ] = `${nomsChamps[champ]} requis`;
    }
  });

  return err;
};

export const chargerRefsEleves = async (ecoleId, direction) => {
  const [resClasses, resOptions, resAnnees] = await Promise.all([
    axios.get(`${URL_API}/classe/ecole/${ecoleId}/direction/${direction}`),
    axios.get(`${URL_API}/option/ecole/${ecoleId}/direction/${direction}`),
    axios.get(`${URL_API}/annee/ecole/${ecoleId}/direction/${direction}`),
  ]);

  return {
    classes: resClasses.data.classesAll || [],
    options: resOptions.data.optionAll || [],
    annees: resAnnees.data.anneeAll || [],
  };
};

export const creerEleves = async ({ eleves, userId, ecoleId, direction }) => {
  const reqs = eleves.map((eleve) => {
    const data = prepEleve({ eleve, userId, ecoleId, direction });
  console.log('ajouter eleve prepat',data)
    return axios.post(`https://api.ecolapp.cd/api/eleve/create`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  });

  const resultats = await Promise.allSettled(reqs);

  return resultats.map((resultat, index) => {
    if (resultat.status === "fulfilled" && resultat.value.data.status === 200) {
      return {
        ok: true,
        index,
        msg: resultat.value.data.status_msg || "Élève ajouté avec succès.",
      };
    }

    const msg =
      resultat.status === "fulfilled"
        ? resultat.value.data.status_msg || resultat.value.data.error_msg || "Ajout refusé par le serveur."
        : "Erreur de connexion au serveur.";

    return { ok: false, index, msg };
  });
};

export const majEleve = (eleves, index, champ, valeur) =>
  eleves.map((eleve, rang) =>
    rang === index ? { ...eleve, [champ]: valeur } : eleve
  );

export const retirerEleve = (eleves, index) =>
  eleves.filter((_, rang) => rang !== index);
