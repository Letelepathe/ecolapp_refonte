import React, { useContext, useEffect, useState } from "react";
import { api, messageErreur } from "../../api/api";
import { ProfilDashboardContext } from "../useProfilDashboard";
import EcranChargement from "../EcranChargement";
import NavHautDashboard from "./NavHautDashboard";

const NavHautUtilisateurEcole = ({ cycle }) => {
  const contexte = useContext(ProfilDashboardContext);
  const [user, setUser] = useState(null);
  const [erreur, setErreur] = useState("");
  const [tentative, setTentative] = useState(0);
  useEffect(() => {
    if (contexte?.user) return;
    const controller = new AbortController();
    setErreur("");
    api.get("/user", {signal:controller.signal,timeout:15000}).then(({data}) => {
      const profil = data?.user || data;
      if (!profil?.id) throw new Error("Profil utilisateur indisponible.");
      if (!controller.signal.aborted) setUser(profil);
    }).catch(err => { if (!controller.signal.aborted) setErreur(messageErreur(err)); });
    return () => controller.abort();
  }, [contexte?.user, tentative]);
  const profil = contexte?.user || user;
  if (!profil) return <EcranChargement titre="Chargement du menu utilisateur" erreur={erreur} onReessayer={() => { setErreur(""); setTentative(t=>t+1); }} />;
  return <NavHautDashboard user={profil} accueil={`/${cycle}/profil_user`} profil={`/${cycle}/mon_profil/${profil.id}`} deconnexion={`/${cycle}/deconnexion`} titreCourt="Ecolapp" />;
};
export default NavHautUtilisateurEcole;
