import React from "react";
import { Link } from "react-router-dom";



const Inscriptions = () => {
  return (
    <div className="u-style-3f3e684d">
      <section id="features-cards" className="features-cards section">
        <h2 className="u-style-3959a91c">Inscriptions</h2>
        <div className="container">
          <div className="row gy-4 u-style-1846cfac">

            {/* Maternelle */}
            <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
              <div className="feature-box blue style-fr-fbd0039b">
                <div className="icon flex-shrink-0 style-fr-227f2e79">
                  <i className="bi bi-eject icon"></i>
                </div>
                <h4 className="title">Maternelle</h4>
                <p className="description style-fr-75fcd199">
                  Un cadre chaleureux et éducatif pour bien débuter.
                </p>
                <Link to="/maternelle/inscription_maternelle" className="btn style-fr-9b133a49">
                  S'inscrire maintenant
                </Link>
              </div>
            </div>

            {/* Primaire */}
            <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
              <div className="feature-box blue style-fr-fbd0039b">
                <div className="icon flex-shrink-0 style-fr-227f2e79">
                  <i className="bi bi-eject icon"></i>
                </div>
                <h4 className="title">Primaire</h4>
                <p className="description style-fr-75fcd199">
                  Une éducation de qualité pour un avenir prometteur.
                </p>
                <Link to="/primaire/inscription_primaire" className="btn style-fr-9b133a49">
                  S'inscrire maintenant
                </Link>
              </div>
            </div>

            {/* Secondaire */}
            <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
              <div className="feature-box blue style-fr-fbd0039b">
                <div className="icon flex-shrink-0 style-fr-227f2e79">
                  <i className="bi bi-eject icon"></i>
                </div>
                <h4 className="title">Secondaire</h4>
                <p className="description style-fr-75fcd199">
                  Un parcours scolaire structuré pour la réussite.
                </p>
                <Link to="/secondaire/inscription_secondaire" className="btn style-fr-9b133a49">
                  S'inscrire maintenant
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>);

};

































export default Inscriptions;
