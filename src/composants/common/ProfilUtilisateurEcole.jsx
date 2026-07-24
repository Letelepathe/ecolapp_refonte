import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL, messageErreur, urlPublic } from "../api/api";
import EcranChargement from "./EcranChargement";

const ProfilUtilisateurEcole = () => {
  const { userId, id } = useParams();
  const identifiant = userId || id || localStorage.getItem("userId");
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [tentative, setTentative] = useState(0);

  useEffect(() => {
    const charger = async () => {
      if (!identifiant) {
        setErreur("Aucun utilisateur n’a été sélectionné.");
        setChargement(false);
        return;
      }
      setChargement(true); setErreur("");
      try {
        const reponse = await axios.get(`${API_BASE_URL}/user/${identifiant}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}` },
        });
        const donnees = reponse.data?.user || reponse.data;
        if (!donnees?.id) throw new Error("Profil utilisateur introuvable.");
        setUtilisateur(donnees);
      } catch (error) {
        setErreur(messageErreur(error, "Impossible de charger ce profil utilisateur."));
      } finally { setChargement(false); }
    };
    charger();
  }, [identifiant, tentative]);

  if (chargement) return <EcranChargement titre="Chargement du profil" />;
  if (erreur || !utilisateur) return <EcranChargement erreur={erreur || "Profil utilisateur introuvable."} onReessayer={() => setTentative((valeur) => valeur + 1)} />;

  const photo = utilisateur.file ? urlPublic(`imgUser/${utilisateur.file}`) : "";
  const fonction = utilisateur.fonction?.name
    || utilisateur.role?.name
    || (typeof utilisateur.role === "string" ? utilisateur.role : "Non renseignée");
  const lignes = [
    ["Nom", utilisateur.name], ["Postnom", utilisateur.last_name], ["Prénom", utilisateur.first_name],
    ["Sexe", utilisateur.sexe], ["E-mail", utilisateur.email], ["Téléphone", utilisateur.phone],
    ["Adresse", utilisateur.address], ["Fonction", fonction],
  ];

  return <div>
    <div className="profile"><div className="profile-cover" /><div className="profile-details">
      <div className="profile-image">{photo && <img src={photo} alt="Profil" className="u-style-2f8d99ec" />}</div>
      <div className="profile-details-info"><h2>{utilisateur.first_name} {utilisateur.name}</h2></div>
    </div></div>
    <div className="container-fluid"><div className="tab-content"><div className="tab-pane fade show active">
      {lignes.map(([libelle, valeur]) => <React.Fragment key={libelle}><div className="row"><div className="col-sm-3"><h6 className="mb-0">{libelle}</h6></div><div className="col-sm-9"><p className="text-muted mb-0">{libelle === "E-mail" && valeur ? <a href={`mailto:${valeur}`}>{valeur}</a> : valeur || "Non renseigné"}</p></div></div><hr /></React.Fragment>)}
    </div></div></div>
  </div>;
};

export default ProfilUtilisateurEcole;
