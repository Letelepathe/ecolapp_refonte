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

export const installerConfigurationApi = () => {
  axios.defaults.baseURL = API_BASE_URL;
  axios.interceptors.request.use((config) => ({
    ...config,
    url: normaliserUrlApi(config.url),
  }));
  axios.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject({ ...error, friendlyMessage: messageErreur(error) })
  );
};
