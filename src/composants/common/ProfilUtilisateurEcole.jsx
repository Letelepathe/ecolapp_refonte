import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL, messageErreur, urlPublic } from "../api/api";
import EcranChargement from "./EcranChargement";

const texte = (valeur, defaut = "Non renseigné") => {
  if (valeur === null || valeur === undefined || valeur === "") return defaut;
  if (typeof valeur === "object") return valeur.name || valeur.libelle || valeur.titre || defaut;
  return valeur;
};

const ligneProfil = (libelle, valeur) => (
  <React.Fragment key={libelle}>
    <div className="row">
      <div className="col-sm-3"><h6 className="mb-0">{libelle}</h6></div>
      <div className="col-sm-9">
        <p className="text-muted mb-0">
          {libelle === "E-mail" && valeur ? <a href={`mailto:${valeur}`}>{valeur}</a> : texte(valeur)}
        </p>
      </div>
    </div>
    <hr />
  </React.Fragment>
);

const ProfilUtilisateurEcole = () => {
  const { userId, id } = useParams();
  const utilisateurConnecte = localStorage.getItem("userId");
  const identifiant = userId || id || utilisateurConnecte;
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [tentative, setTentative] = useState(0);

  const endpoints = useMemo(() => {
    const routes = [];
    if (identifiant && identifiant !== "userid") routes.push(`${API_BASE_URL}/user/${identifiant}`);
    if (utilisateurConnecte && utilisateurConnecte === identifiant) routes.unshift(`${API_BASE_URL}/user`);
    if (!routes.includes(`${API_BASE_URL}/user`)) routes.push(`${API_BASE_URL}/user`);
    return routes;
  }, [identifiant, utilisateurConnecte]);

  useEffect(() => {
    let actif = true;

    const charger = async () => {
      if (!identifiant && !utilisateurConnecte) {
        setErreur("Aucun utilisateur n’a été sélectionné.");
        setChargement(false);
        return;
      }

      setChargement(true);
      setErreur("");
      const headers = { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}` };
      let derniereErreur = null;

      for (const endpoint of endpoints) {
        try {
          const reponse = await axios.get(endpoint, { headers });
          const donnees = reponse.data?.user || reponse.data;
          if (donnees?.id) {
            if (actif) setUtilisateur(donnees);
            derniereErreur = null;
            break;
          }
        } catch (error) {
          derniereErreur = error;
        }
      }

      if (actif) {
        if (derniereErreur && !utilisateur) {
          setErreur(messageErreur(derniereErreur, "Impossible de charger ce profil utilisateur."));
        }
        setChargement(false);
      }
    };

    charger();
    return () => { actif = false; };
  }, [endpoints, identifiant, tentative, utilisateurConnecte]);

  if (chargement) return <EcranChargement titre="Chargement du profil" />;
  if (erreur || !utilisateur) return <EcranChargement erreur={erreur || "Profil utilisateur introuvable."} onReessayer={() => setTentative((valeur) => valeur + 1)} />;

  const photo = utilisateur.file ? urlPublic(`imgUser/${utilisateur.file}`) : "";
  const fonction = texte(utilisateur.fonction, texte(utilisateur.role));
  const lignes = [
    ["Nom", utilisateur.name],
    ["Postnom", utilisateur.last_name],
    ["Prénom", utilisateur.first_name],
    ["Sexe", utilisateur.sexe],
    ["E-mail", utilisateur.email],
    ["Téléphone", utilisateur.phone],
    ["Adresse", utilisateur.address],
    ["Fonction", fonction],
  ];

  return (
    <div>
      <div className="profile">
        <div className="profile-cover" />
        <div className="profile-details">
          <div className="profile-image">
            {photo && <img src={photo} alt="Profil" className="u-style-2f8d99ec" />}
          </div>
          <div className="profile-details-info">
            <h2 className="u-style-1b959d56">{texte(utilisateur.first_name, "")} {texte(utilisateur.name, "")}</h2>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="tab-content" id="pills-tabContent">
          <div className="tab-pane fade show active" id="apropos" role="tabpanel" aria-labelledby="pills-home-tab">
            {lignes.map(([libelle, valeur]) => ligneProfil(libelle, valeur))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilUtilisateurEcole;
