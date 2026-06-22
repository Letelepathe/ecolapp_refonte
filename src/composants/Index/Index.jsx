import React, { useEffect, useState } from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
import { FiBookOpen, FiInfo, FiUsers, FiZap } from "react-icons/fi";
import NavbarBottom from "./NavbarBottom";
import ImageEcole from "../../static/images/image_ecole.webp";

const HeroSection = () => (
  <section className="index-refonte text-center" data-aos="fade-up">
    <div className="index-hero-copy">
      <h1>ecolapp</h1>
      <p>
        <strong>ecolapp, gestion scolaire simplifiée et efficace.</strong>
        <span>Un outil tout-en-un pour les écoles, enseignants, élèves, et parents.</span>
      </p>
    </div>

    <div className="index-hero-wheel" >
      <div className="index-wheel-dots" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="index-hero-photo">
        <img src={ImageEcole} alt="ecolapp" />
      </div>
    </div>
  </section>
);

const cartes = [
  {
    icon: FiBookOpen,
    title: "Écoles",
    text: "Accéder aux établissements et aux cycles.",
    lien: "/ecoles",
  },
  {
    icon: FiUsers,
    title: "Parents",
    text: "Suivre les informations scolaires de vos enfants.",
    lien: "/parent",
  },
  {
    icon: FiInfo,
    title: "À propos",
    text: "Découvrir la mission et les réponses utiles.",
    lien: "/apropos",
  },
  {
    icon: FiZap,
    title: "Services",
    text: "Explorer les outils et fonctionnalités ecolapp.",
    lien: "/services",
  },
];

const CardSection = () => (
  <section className="index-card-section" data-aos="fade-up">
    <div className="index-card-intro">
      <span className="dashboard-pill">Bienvenue</span>
      <h2>Choisissez votre espace</h2>
      <p>Tout est regroupé dans une grille claire, rapide et agréable.</p>
    </div>

    <div className="index-card-grid">
      {cartes.map((carte) => {
        const Icone = carte.icon;
        return (
          <article className="index-card" key={carte.title}>
            <span className="index-card-icon">
              <Icone />
            </span>
            <h3>{carte.title}</h3>
            <p>{carte.text}</p>
            <Link to={carte.lien} className="btn">
              Explorer
            </Link>
          </article>
        );
      })}
    </div>
  </section>
);

const Index = () => {
  const [afficherHero, setAfficherHero] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });

    const timer = window.setTimeout(() => setAfficherHero(false), 5800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="bloc-index w-100">
      {afficherHero ? <HeroSection /> : <CardSection />}
      {/* <NavbarBottom /> */}
    </div>
  );
};

export default Index;
