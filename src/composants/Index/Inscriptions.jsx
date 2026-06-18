import React from "react";
import { Link } from "react-router-dom";



const Inscriptions = () => {
  return (
    <div style={{ marginTop: '120px', display: 'flex', justifyContent: 'center' }}>
      <section id="features-cards" className="features-cards section">
        <h2 style={{textAlign: 'center', fontWeight:900, color:'#1769ff'}}>Inscriptions</h2>
        <div className="container">
          <div className="row gy-4" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>

            {/* Maternelle */}
            <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
              <div className="feature-box blue" style={cardStyle}>
                <div className="icon flex-shrink-0" style={iconStyle}>
                  <i className="bi bi-eject icon"></i>
                </div>
                <h4 className="title">Maternelle</h4>
                <p className="description" style={descStyle}>
                  Un cadre chaleureux et éducatif pour bien débuter.
                </p>
                <Link to="/maternelle/inscription_maternelle" className="btn" style={btnStyle}>
                  S'inscrire maintenant
                </Link>
              </div>
            </div>

            {/* Primaire */}
            <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
              <div className="feature-box blue" style={cardStyle}>
                <div className="icon flex-shrink-0" style={iconStyle}>
                  <i className="bi bi-eject icon"></i>
                </div>
                <h4 className="title">Primaire</h4>
                <p className="description" style={descStyle}>
                  Une éducation de qualité pour un avenir prometteur.
                </p>
                <Link to="/primaire/inscription_primaire" className="btn" style={btnStyle}>
                  S'inscrire maintenant
                </Link>
              </div>
            </div>

            {/* Secondaire */}
            <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
              <div className="feature-box blue" style={cardStyle}>
                <div className="icon flex-shrink-0" style={iconStyle}>
                  <i className="bi bi-eject icon"></i>
                </div>
                <h4 className="title">Secondaire</h4>
                <p className="description" style={descStyle}>
                  Un parcours scolaire structuré pour la réussite.
                </p>
                <Link to="/secondaire/inscription_secondaire" className="btn" style={btnStyle}>
                  S'inscrire maintenant
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}


const cardStyle = {
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  background: '#f8f9fa',
  width: '100%',
  maxWidth: '350px'
};

const iconStyle = {
  fontSize: '30px',
  color: '#1769ff',
  marginBottom: '10px'
};

const descStyle = {
  fontSize: '14px',
  color: '#555'
};

const btnStyle = {
  padding: '12px',
  borderRadius: '30px',
  background: '#1769ff',
  color: '#fff',
  textDecoration: 'none',
  display: 'inline-block',
  width: '100%',
  marginTop: '10px'
};

export default Inscriptions;
