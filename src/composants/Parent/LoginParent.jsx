import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginRefonte from "../common/LoginRefonte";

const champsParent = [
  {
    name: "code",
    label: "Code parent",
    type: "text",
    placeholder: "Votre code parent",
    autoComplete: "one-time-code",
  },
  {
    name: "telephone",
    label: "Téléphone",
    type: "tel",
    placeholder: "+243...",
    autoComplete: "tel",
  },
];

const LoginParent = () => {
  const naviguer = useNavigate();

  const [donneesForm, setDonneesForm] = useState({ code: "", telephone: "" });
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const verifierSession = () => {
      try {
        const idParent = localStorage.getItem("parentId");

        if (idParent) {
          naviguer("/parent/profil_parent");
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

    if (!donneesForm.code) {
      nouvellesErreurs.code = "Le code est requis.";
    }

    if (!donneesForm.telephone) {
      nouvellesErreurs.telephone = "Le numéro de téléphone est requis.";
    } else if (!/^\+?[0-9]{9,15}$/.test(donneesForm.telephone)) {
      nouvellesErreurs.telephone = "Numéro de téléphone invalide.";
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
      const reponse = await axios.post("https://api.ecolapp.cd/api/parents/login", donneesForm);

      if (reponse.data.success) {
        localStorage.setItem("parentId", reponse.data.parent.id);
        localStorage.setItem("parentNom", reponse.data.parent.nom);

        setMessage("Connexion réussie !");
        naviguer("/parent/profil_parent");
      } else {
        setMessage(reponse.data.message || "Code ou téléphone incorrect.");
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
        <title>Parent | Connexion</title>
      </Helmet>
      <LoginRefonte
        sousTitre="Connectez-vous avec votre code parent et votre téléphone."
        valeurs={donneesForm}
        erreurs={erreurs}
        message={message}
        chargement={chargement}
        champs={champsParent}
        lienCreation="/parent/inscription_parent"
        onChange={changerChamp}
        onSubmit={soumettreFormulaire}
      />
    </>
  );
};

export default LoginParent;
