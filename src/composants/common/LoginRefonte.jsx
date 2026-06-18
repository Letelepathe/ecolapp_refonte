import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiKey, FiLock, FiMail, FiPhone } from "react-icons/fi";
import imageLogin from "../../static/images/image_ecole.webp";

const iconesChamps = {
  identifier: FiMail,
  password: FiLock,
  telephone: FiPhone,
  code: FiKey,
};

const LoginRefonte = ({
  titre = "Se connecter",
  sousTitre = "Accédez à votre espace Ecolapp.",
  valeurs,
  erreurs = {},
  message,
  chargement,
  champs,
  lienCreation,
  texteCreation = "Créer un compte",
  texteAide = "Nouveau ici ?",
  onChange,
  onSubmit,
}) => {
  const messageSucces = message?.toLowerCase().includes("réuss");

  return (
    <main className="login-refonte-page">
      <section className="login-refonte-carte">
        <div className="login-refonte-formulaire">
          <Link to="/" className="login-refonte-logo" aria-label="Retour à l'accueil">
            <span className="login-refonte-logo-icone">e</span>
            <span>ecolapp</span>
          </Link>

          <div className="login-refonte-entete">
            <p className="login-refonte-sur-titre">Bienvenue</p>
            <h1>{titre}</h1>
            <p>{sousTitre}</p>
          </div>

          <form onSubmit={onSubmit} className="login-refonte-form">
            {message && (
              <div className={`login-refonte-message ${messageSucces ? "succes" : "erreur"}`}>
                {message}
              </div>
            )}

            {champs.map((champ) => {
              const Icone = iconesChamps[champ.name] || FiMail;

              return (
                <div className="login-refonte-champ" key={champ.name}>
                  <label htmlFor={champ.name}>{champ.label}</label>
                  <div className="login-refonte-input">
                    <Icone />
                    <input
                      id={champ.name}
                      type={champ.type}
                      name={champ.name}
                      placeholder={champ.placeholder}
                      value={valeurs[champ.name]}
                      onChange={onChange}
                      autoComplete={champ.autoComplete}
                    />
                  </div>
                  {erreurs[champ.name] && <p className="login-refonte-erreur">{erreurs[champ.name]}</p>}
                </div>
              );
            })}

            <button className="login-refonte-bouton" type="submit" disabled={chargement}>
              <span>{chargement ? "Connexion en cours..." : "Se connecter"}</span>
              <FiArrowRight />
            </button>

            {lienCreation && (
              <p className="login-refonte-creation">
                {texteAide} <Link to={lienCreation}>{texteCreation}</Link>
              </p>
            )}
          </form>
        </div>

        <aside className="login-refonte-visuel">
          <img src={imageLogin} alt="Élèves dans une école" />
          <div className="login-refonte-voile" />
          <div className="login-refonte-texte">
            <h2>À chaque élève, une découverte !</h2>
            <span>ecolapp</span>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default LoginRefonte;
