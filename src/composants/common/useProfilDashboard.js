import { createContext, useEffect, useState } from "react";
import { chargerDonneesProfil } from "../api/profilDashboard";
import { messageErreur } from "../api/api";

export const ProfilDashboardContext = createContext(null);
export default function useProfilDashboard(id) {
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [tentative, setTentative] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setChargement(true); setErreur(""); setDonnees(null);
    chargerDonneesProfil(id, controller.signal).then(resultat => {
      if (controller.signal.aborted) return;
      if (resultat.user.ecole_id) localStorage.setItem("ecole_id", resultat.user.ecole_id);
      if (resultat.user.direction) localStorage.setItem("direction", resultat.user.direction);
      setDonnees(resultat);
    }).catch(err => {
      if (!controller.signal.aborted) setErreur(messageErreur(err, "Impossible de charger votre tableau de bord. Veuillez réessayer."));
    }).finally(() => { if (!controller.signal.aborted) setChargement(false); });
    return () => controller.abort();
  }, [id, tentative]);
  return { user: donnees?.user || null, counts: donnees?.counts || {}, eleveInfo: donnees?.eleveInfo || null,
    isLoading: chargement, isLoadingEleveInfo: chargement, erreurChargement: erreur,
    reessayer: () => { setChargement(true); setErreur(""); setTentative(t => t + 1); } };
}
