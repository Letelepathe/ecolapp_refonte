import React from "react";

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
    return <main className="ecran-chargement" role="alert">
      <section className="ecran-chargement-carte">
        <h2>Impossible d’afficher cette page</h2>
        <p>Une donnée du profil n’a pas pu être affichée correctement.</p>
        <button className="btn" type="button" onClick={() => window.location.reload()}>Réessayer</button>
      </section>
    </main>;
  }
}

export default LimiteErreur;
