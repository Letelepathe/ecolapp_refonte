import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUp, FiBookOpen, FiHome, FiMail, FiMapPin, FiMessageSquare, FiPhone, FiUser } from "react-icons/fi";

const liensCycle = (cycle) =>
  cycle
    ? [
        { to: `/${cycle}`, label: "Accueil", icon: FiHome },
        { to: `/${cycle}/suivi_scolaire`, label: "Suivi", icon: FiBookOpen },
        { to: `/${cycle}/communiques`, label: "Communiqués", icon: FiMessageSquare },
        { to: `/${cycle}/profil_user`, label: "Profil", icon: FiUser },
      ]
    : [
        { to: "/", label: "Accueil", icon: FiHome },
        { to: "/ecoles", label: "Écoles", icon: FiBookOpen },
        { to: "/services", label: "Services", icon: FiMessageSquare },
        { to: "/apropos", label: "FAQ", icon: FiUser },
      ];

const FooterRefonte = ({ cycle, ecole, variant = "site" }) => {
  const annee = new Date().getFullYear();
  const liens = liensCycle(cycle);
  const nom = ecole?.name || "ecolapp";

  const remonter = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className={`ecolapp-footer ${variant}`}>
        <div className="ecolapp-footer-grid">
          <div className="ecolapp-footer-brand">
            <span className="ecolapp-footer-logo">
              <FiBookOpen />
            </span>
            <div>
              <h3>{nom}</h3>
              <p>Une expérience scolaire fluide, claire et connectée.</p>
            </div>
          </div>

          <div className="ecolapp-footer-links">
            <h4>Navigation</h4>
            {liens.map((item) => {
              const Icone = item.icon;
              return (
                <Link key={item.to} to={item.to}>
                  <Icone />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="ecolapp-footer-contact">
            <h4>Contact</h4>
            {ecole?.adresse && (
              <p>
                <FiMapPin />
                <span>{ecole.adresse}</span>
              </p>
            )}
            {ecole?.telephone && (
              <a href={`tel:${ecole.telephone}`}>
                <FiPhone />
                <span>{ecole.telephone}</span>
              </a>
            )}
            {ecole?.email && (
              <a href={`mailto:${ecole.email}`}>
                <FiMail />
                <span>{ecole.email}</span>
              </a>
            )}
          </div>
        </div>

        <div className="ecolapp-footer-bottom">
          <span>&copy; {annee} ecolapp. Tous droits réservés.</span>
          <a href="https://cria-unikin.net" target="_blank" rel="noopener noreferrer">
            Team-Cria
          </a>
        </div>
      </footer>

      <nav className="ecolapp-mobile-nav">
        {liens.map((item) => {
          const Icone = item.icon;
          return (
            <Link key={item.to} to={item.to}>
              <Icone />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link to="#" className="ecolapp-scroll-top" onClick={remonter}>
        <FiArrowUp />
      </Link>
    </>
  );
};

export default FooterRefonte;
