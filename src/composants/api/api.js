import axios from "axios";

const estLocal = () => {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
};

export const API_BASE_URL = estLocal() ? "http://localhost:8000/api" : "https://api.ecolapp.cd/api";
export const PUBLIC_BASE_URL = estLocal() ? "http://localhost:8000" : "https://api.ecolapp.cd";

export const messageErreur = (erreur, fallback = "Une erreur est survenue. Veuillez réessayer.") => {
  const data = erreur?.response?.data;
  if (typeof data === "string") return data;
  return data?.message || data?.error_msg || data?.error || erreur?.message || fallback;
};

export const normaliserUrlApi = (url = "") => {
  if (!url || typeof url !== "string") return url;
  return url
    .replace(/^https?:\/\/api\.ecolapp\.(cd|com)\/api/i, API_BASE_URL)
    .replace(/^http:\/\/localhost(?::\d+)?\/api/i, API_BASE_URL)
    .replace(/^http:\/\/localhost\/ecole-app\/apis/i, API_BASE_URL);
};

export const urlPublic = (chemin = "") => {
  if (!chemin) return "";
  if (/^https?:\/\//i.test(chemin)) return chemin.replace(/^https?:\/\/api\.ecolapp\.(cd|com)/i, PUBLIC_BASE_URL);
  return `${PUBLIC_BASE_URL}/${String(chemin).replace(/^\/+/, "")}`;
};

export const api = axios.create({ baseURL: API_BASE_URL });

// Limite côté navigateur : elle lisse les rafales sans modifier les routes Laravel.
// Les requêtes déjà parties restent plafonnées et les suivantes attendent dans une file FIFO.
export const CONFIGURATION_RATE_LIMITER = Object.freeze({
  requetesSimultanees: 6,
  intervalleEntreDepartsMs: 120,
  attenteMaximaleMs: 30000,
});

let requetesActives = 0;
let dernierDepart = 0;
let minuteurFile = null;
const fileRequetes = [];

const programmerFile = (delai = 0) => {
  if (minuteurFile !== null) return;
  minuteurFile = setTimeout(() => {
    minuteurFile = null;
    traiterFile();
  }, delai);
};

const traiterFile = () => {
  while (fileRequetes.length && fileRequetes[0].signal?.aborted) {
    const annulee = fileRequetes.shift();
    clearTimeout(annulee.expiration);
    annulee.reject(new axios.CanceledError("Requête annulée avant son envoi."));
  }

  if (!fileRequetes.length || requetesActives >= CONFIGURATION_RATE_LIMITER.requetesSimultanees) return;

  const attente = Math.max(
    0,
    CONFIGURATION_RATE_LIMITER.intervalleEntreDepartsMs - (Date.now() - dernierDepart)
  );
  if (attente > 0) {
    programmerFile(attente);
    return;
  }

  const suivante = fileRequetes.shift();
  clearTimeout(suivante.expiration);
  requetesActives += 1;
  dernierDepart = Date.now();
  suivante.resolve();
  programmerFile(CONFIGURATION_RATE_LIMITER.intervalleEntreDepartsMs);
};

const attendreAutorisation = (signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) {
    reject(new axios.CanceledError("Requête annulée avant son envoi."));
    return;
  }

  const entree = { resolve, reject, signal, expiration: null };
  entree.expiration = setTimeout(() => {
    const index = fileRequetes.indexOf(entree);
    if (index >= 0) fileRequetes.splice(index, 1);
    reject(new Error("Trop de requêtes sont en attente. Veuillez réessayer dans quelques instants."));
  }, CONFIGURATION_RATE_LIMITER.attenteMaximaleMs);
  fileRequetes.push(entree);
  traiterFile();
});

const libererRequete = (config) => {
  if (!config?.ecolappRateLimiterAcquis) return;
  config.ecolappRateLimiterAcquis = false;
  requetesActives = Math.max(0, requetesActives - 1);
  traiterFile();
};

const installerRateLimiter = (client) => {
  client.interceptors.request.use(async (config) => {
    // Permet ponctuellement d'exclure une requête non-API avec { ecolappRateLimiter: false }.
    if (config.ecolappRateLimiter === false) return config;
    await attendreAutorisation(config.signal);
    config.ecolappRateLimiterAcquis = true;
    return config;
  });
  client.interceptors.response.use(
    (response) => {
      libererRequete(response.config);
      return response;
    },
    (error) => {
      libererRequete(error?.config);
      return Promise.reject(error);
    }
  );
};

let configurationInstallee = false;

export const installerConfigurationApi = () => {
  if (configurationInstallee) return;
  configurationInstallee = true;
  axios.defaults.baseURL = API_BASE_URL;
  axios.interceptors.request.use((config) => ({
    ...config,
    url: normaliserUrlApi(config.url),
  }));
  axios.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject({ ...error, friendlyMessage: messageErreur(error) })
  );
  installerRateLimiter(axios);
  installerRateLimiter(api);
};
