import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginRefonte from "../common/LoginRefonte";

const champsAdmin = [
  {
    name: "identifier",
    label: "Email ou téléphone",
    type: "text",
    placeholder: "admin@ecolapp.cd",
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

const LoginAdmin = () => {
  const naviguer = useNavigate();
  const ecole_id = 0;
  const direction = 0;

  const [donneesForm, setDonneesForm] = useState({ identifier: "", password: "", ecole_id, direction });
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const verifierSession = () => {
      try {
        const adminId = localStorage.getItem("adminId");

        if (adminId) {
          naviguer("/admin-general/profil_admin");
        }
      } catch (erreur) {
        console.error("Erreur lors de la vérification de session:", erreur);
      }
    };

    verifierSession();
  }, [naviguer]);

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
      const reponse = await axios.post("https://api.ecolapp.cd/api/admin/login", donneesForm);

      if (reponse.data.status === 200) {
        localStorage.setItem("userId", reponse.data.userId);
        localStorage.setItem("adminId", reponse.data.userId);
        localStorage.setItem("auth_token", reponse.data.token);
        localStorage.setItem("ecole_id", donneesForm.ecole_id);
        localStorage.setItem("direction", donneesForm.direction);

        setMessage("Connexion réussie !");
        naviguer("/admin-general/profil_admin");
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
        <title>Admin général | Connexion</title>
      </Helmet>
      <LoginRefonte
        sousTitre="Connectez-vous à l'espace d'administration générale."
        valeurs={donneesForm}
        erreurs={erreurs}
        message={message}
        chargement={chargement}
        champs={champsAdmin}
        onChange={changerChamp}
        onSubmit={soumettreFormulaire}
      />
    </>
  );
};

export default LoginAdmin;
