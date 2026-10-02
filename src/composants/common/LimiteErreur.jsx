import React from "react";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

class LimiteErreur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erreur: null };
  }

  static getDerivedStateFromError(erreur) {
    return { erreur };
  }

  componentDidCatch(erreur, informations) {
    console.error("Erreur d’affichage Ecolapp", erreur, informations);
  }

  render() {
    if (!this.state.erreur) return this.props.children;
    return <main className="limite-erreur" role="alert" aria-live="assertive">
      <section className="limite-erreur-carte">
        <span className="limite-erreur-icone" aria-hidden="true"><FiAlertTriangle /></span>
        <span className="limite-erreur-surtitre">Ecolapp</span>
        <h2>Impossible d’afficher cette page</h2>
        <p>Une donnée n’a pas pu être affichée correctement. Vos informations restent intactes.</p>
        <div className="limite-erreur-actions">
          <button className="btn limite-erreur-reessayer" type="button" onClick={() => window.location.reload()}><FiRefreshCw /> Réessayer</button>
          <button className="btn limite-erreur-accueil" type="button" onClick={() => { window.location.href = "/"; }}><FiHome /> Accueil</button>
        </div>
        <small>Si le problème persiste, contactez l’administrateur de votre école.</small>
      </section>
    </main>;
  }
}

export default LimiteErreur;
