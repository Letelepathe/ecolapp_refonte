import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { FiArrowRight, FiBookOpen, FiHome, FiUsers } from "react-icons/fi";

const directions = [
  { chemin: "maternelle", titre: "Maternelle", description: "Espace adapté aux premières classes.", icone: FiHome },
  { chemin: "primaire", titre: "Primaire", description: "Suivi scolaire et administratif du primaire.", icone: FiBookOpen },
  { chemin: "secondaire", titre: "Secondaire", description: "Gestion complète des classes secondaires.", icone: FiUsers },
];

const ChoixDirection = () => {
  const [ecole, setEcole] = useState(null);
  const [erreur, setErreur] = useState("");
  const { id_ecole, ecole_name } = useParams();

  useEffect(() => {
    localStorage.setItem("ecole_id", id_ecole);

    const chargerInfoEcole = async () => {
      try {
        const reponse = await axios.get(`https://api.ecolapp.cd/api/ecole/ecole_id/${id_ecole}`);
        setEcole(reponse.data.ecole);
      } catch {
        setErreur("Impossible de charger les informations de l'école.");
      }
    };

    chargerInfoEcole();
  }, [id_ecole]);

  if (erreur) {
    return <div className="page-ecoles-etat erreur">{erreur}</div>;
  }

  if (!ecole) {
    return <div className="spinner"></div>;
  }

  return (
    <main className="direction-page">
      <Helmet>
        <title>{ecole.name} | Directions</title>
      </Helmet>

      <section className="direction-hero">
        <div className="direction-image">
          <img src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`} alt={ecole.name} />
        </div>
        <div className="direction-texte">
          <span>École sélectionnée</span>
          <h1>{ecole.name}</h1>
          <p>{ecole.adresse || "Choisissez la direction scolaire à ouvrir pour continuer dans Ecolapp."}</p>
        </div>
      </section>

      <section className="direction-grille">
        {directions.map((direction) => {
          const Icone = direction.icone;

          return (
            <Link key={direction.chemin} to={`/${direction.chemin}?${ecole_name}`} className="direction-card">
              <span className="direction-card-icone">
                <Icone />
              </span>
              <strong>{direction.titre}</strong>
              <p>{direction.description}</p>
              <em>
                Explorer <FiArrowRight />
              </em>
            </Link>
          );
        })}
      </section>
    </main>
  );
};

export default ChoixDirection;
