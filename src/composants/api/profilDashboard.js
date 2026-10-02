import { api } from "./api";

export const chargerDonneesProfil = async (id, signal) => {
  if (!id) throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
  const obtenir = async (url) => {
    for (let essai = 0; ; essai++) {
      try {
        return await api.get(url, { signal, timeout: 15000 });
      } catch (erreur) {
        if (signal?.aborted || erreur.code === "ERR_CANCELED") throw erreur;
        const statut = erreur.response?.status;
        if (essai >= 1 || (statut && ![429, 502, 503, 504].includes(statut))) throw erreur;
        const secondes = Number(erreur.response?.headers?.['retry-after']);
        const attente = Number.isFinite(secondes) && secondes > 0 ? Math.min(secondes * 1000, 10000) : 1000;
        await new Promise(resolve => setTimeout(resolve, attente));
        if (signal?.aborted) throw new Error("Chargement annulé.");
      }
    }
  };
  const reponse = await obtenir(`/user/${id}`);
  const user = reponse.data?.user || reponse.data;
  if (!user?.id || String(user.id) !== String(id)) throw new Error("Le serveur n’a pas retourné votre profil. Veuillez réessayer.");
  const roles = [user.fonction?.name, user.role?.name, user.role].filter(v => typeof v === "string").map(v => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
  const [statistiques, eleve] = await Promise.all([
    obtenir(`/user/count/${id}`),
    roles.includes("eleve") ? obtenir(`/user/eleve/${id}`) : Promise.resolve(null),
  ]);
  if (statistiques.data?.status && Number(statistiques.data.status) >= 400) throw new Error(statistiques.data.message || "Statistiques indisponibles.");
  if (eleve && !eleve.data?.eleve_info) throw new Error("Les informations scolaires de l’élève sont indisponibles.");
  return { user, counts: statistiques.data, eleveInfo: eleve?.data?.eleve_info || null };
};
