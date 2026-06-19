import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import { Link } from "react-router-dom";
import { FiBookOpen, FiCheckCircle, FiHelpCircle, FiMessageSquare, FiTrendingUp, FiUserPlus } from "react-icons/fi";

const HeroAccueilEcole = ({ ecole, cycle, titreCycle, inscriptionPath }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    const chargerOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecoleId}/direction/${direction}`);
        setOptions(response.data.optionAll || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des options:", error);
      }
    };

    chargerOptions();
  }, [ecoleId, direction]);

  const cartes = [
    { to: inscriptionPath, label: "Inscription", detail: "Commencer une demande", icon: FiUserPlus },
    { to: `/${cycle}/suivi_scolaire`, label: "Suivi scolaire", detail: "Parcours, notes et présence", icon: FiTrendingUp },
    { to: `/${cycle}/communiques`, label: "Communiqués", detail: "Actualités de l'école", icon: FiMessageSquare },
    { to: "/apropos", label: "FAQ", detail: "Aide et informations", icon: FiHelpCircle },
  ];

  return (
    <section className="ecole-accueil" data-aos="fade-up">
      <div className="ecole-accueil-hero">
        <div className="ecole-accueil-copy" data-aos="fade-right">
          <span className="dashboard-pill">Cycle {titreCycle}</span>
          <h1>{ecole.name}</h1>
          <p>
            Un espace scolaire moderne pour suivre les cours, les communiqués,
            les inscriptions et l'évolution des élèves.
          </p>
          <div className="ecole-accueil-actions">
            <Link to={inscriptionPath} className="btn">
              Prendre inscription
            </Link>
            <Link to={`/${cycle}/suivi_scolaire`} className="btn">
              Suivi scolaire
            </Link>
          </div>
        </div>

        <div className="ecole-accueil-photo" data-aos="zoom-in">
          <img src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`} alt={ecole.name} />
        </div>
      </div>

      <div className="ecole-accueil-grid">
        {cartes.map((carte) => {
          const Icone = carte.icon;
          return (
            <Link to={carte.to} className="ecole-accueil-card" key={carte.to} data-aos="fade-up">
              <span>
                <Icone />
              </span>
              <h3>{carte.label}</h3>
              <p>{carte.detail}</p>
            </Link>
          );
        })}
      </div>

      <section className="ecole-options-card" data-aos="fade-up">
        <div>
          <FiBookOpen />
          <h2>Options d'études</h2>
        </div>
        <ul>
          {options.length > 0 ? (
            options.map((option) => (
              <li key={option.id || option.name}>
                <FiCheckCircle />
                <span>{option.name}</span>
              </li>
            ))
          ) : (
            <li>
              <FiCheckCircle />
              <span>Les options seront bientôt disponibles.</span>
            </li>
          )}
        </ul>
      </section>
    </section>
  );
};

export default HeroAccueilEcole;
