import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginRefonte from "../../../../common/LoginRefonte";

const champsConnexion = [
  {
    name: "identifier",
    label: "Email ou téléphone",
    type: "text",
    placeholder: "eleve@ecolapp.cd",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "Votre mot de passe",
    autoComplete: "current-password",
  },
];

const LoginSecondaire = () => {
  const ecole_id = parseInt(localStorage.getItem("ecole_id") || 0, 10);
  const direction = parseInt(localStorage.getItem("direction") || 0, 10);
  const naviguer = useNavigate();

  const [donneesForm, setDonneesForm] = useState({ identifier: "", password: "", ecole_id, direction });
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  const changerChamp = (evenement) => {
    const { name, value } = evenement.target;
    setDonneesForm((ancienneValeur) => ({ ...ancienneValeur, [name]: value }));
  };

  const validerFormulaire = () => {
    const nouvellesErreurs = {};
    const { identifier, password } = donneesForm;

    if (!identifier) {
      nouvellesErreurs.identifier = "Identifiant requis (email ou téléphone).";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) && !/^\+?[0-9]{10,15}$/.test(identifier)) {
      nouvellesErreurs.identifier = "Veuillez entrer un email valide ou un numéro de téléphone valide.";
    }

    if (!password) {
      nouvellesErreurs.password = "Mot de passe requis.";
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const soumettreFormulaire = async (evenement) => {
    evenement.preventDefault();
    setMessage("");
    setChargement(true);

    if (!validerFormulaire()) {
      setChargement(false);
      return;
    }

    try {
      const reponse = await axios.post("https://api.ecolapp.cd/api/login", donneesForm);

      if (reponse.data.status === 200) {
        localStorage.setItem("userId", reponse.data.userId);
        localStorage.setItem("auth_token", reponse.data.token);

        setMessage("Connexion réussie !");
        naviguer("/secondaire/profil_user");
      } else {
        setMessage(reponse.data.msg || "Identifiant ou mot de passe incorrect.");
      }
    } catch (erreur) {
      setMessage("Erreur lors de la connexion au serveur.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Secondaire | Connexion</title>
      </Helmet>
      <LoginRefonte
        sousTitre="Connectez-vous à votre espace secondaire."
        valeurs={donneesForm}
        erreurs={erreurs}
        message={message}
        chargement={chargement}
        champs={champsConnexion}
        lienCreation="/secondaire/alert_creation_compte"
        onChange={changerChamp}
        onSubmit={soumettreFormulaire}
      />
    </>
  );
};

export default LoginSecondaire;
