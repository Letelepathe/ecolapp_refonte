import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Copyright from '../../Index/Copyright';
import Abonnement from './Abonnement';

const Footer = ({ ecole }) => {
  const [isScrollTopActive, setIsScrollTopActive] = useState(false);

  const toggleScrollTopVisibility = () => {
    if (window.scrollY > 300) {
      setIsScrollTopActive(true);
    } else {
      setIsScrollTopActive(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleScrollTopVisibility);
    return () => {
      window.removeEventListener('scroll', toggleScrollTopVisibility);
    };
  }, []);

  return (
    <div>
        <footer id="footer" className="footer position-relative light-background">
            <div className="container footer-top">
                <div className="row gy-4">
                    <div className="col-lg-4 col-md-6 footer-about">
                        <Link to="#" className="justify-content-center align-itesm-center">
                            <span className="">
                              <img
                    src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`}
                    alt={`${ecole.name}`} className="u-style-a62ea828" />






                  
                            </span>
                        </Link>
                        <div className="footer-contact pt-3">
                            <p>
                              <strong>Adresse :</strong> {ecole.adresse}
                            </p>
                            <p className="mt-3"><strong>Phone :</strong> <span><a href={`tel:${ecole.telephone}`} target="_blank" rel="noreferrer">{ecole.telephone}</a></span></p>
                            <p><strong>E-mail :</strong> <span><a href={`mailto:${ecole.email}`} target="_blank" rel="noopener noreferrer">{ecole.email}</a></span></p>
                        </div>
                        <div class="social-links d-flex mt-4">
                            {/* <Link to="#"><i className="bi bi-twitter-x"></i></Link>
                  <Link to="#"><i className="bi bi-facebook"></i></Link>
                  <Link to="#"><i className="bi bi-instagram"></i></Link>
                  <Link to="#"><i className="bi bi-linkedin"></i></Link> */}
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-3 footer-links">
                        <h4>Liens utiles</h4>
                        <ul>
                            <li><Link to="/apropos">A propos</Link></li>
                            <li><Link to="#">Aide</Link></li>
                            <li><Link to="#">Services</Link></li>
                            <li><Link to="/conditions">Conditions</Link></li>
                            <li><Link to="/politique">Politique</Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-3 footer-links">
                        <h4>Nos Services</h4>
                        <ul>
                            <li><Link to="#">Formations</Link></li>
                            <li><Link to="#">Suivi du parcours</Link></li>
                            <li><Link to="#">Promotion travaux</Link></li>
                            <li><Link to="#">Marketing</Link></li>
                            <li><Link to="#">Service après formations</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12 footer-newsletter">
                        <h4>Notre Newsletter</h4>
                        <p>Inscrivez-vous à notre newsletter pour pour ne manquer aucune promotion ou nouveauté</p>
                         <Abonnement />
                    </div>
                </div>
            </div>
            <div className="container copyright text-center mt-4">
                <Copyright />
                <div className="credits">
                    <p><span>Développé par</span> <a href="https://cria-unikin.net" target="_blank" rel="noopener noreferrer">Team-Cria</a></p>
                </div>
            </div>
        </footer>

        <div className="navbarbot">
            <div className="ico">
                <Link to="/">
                <i className="bi bi-house-door-fill"></i> 
                <div className="icon-title">Accueil</div> 
                </Link>
            </div>
            <div className="ico">
                <Link to="/primaire">
                <i className="bi bi-box-fill"></i> 
                <div className="icon-title">Primaire</div> 
                </Link>
            </div>
          
            <div className="ico">
              <Link to="/primaire/suivi_scolaire">
                <i className="bi bi-activity"></i>
                <div className="icon-title">Suivi scolaire</div>
              </Link>
            </div>

            <div className="ico">
                <Link to="/primaire/communiques">
                <i className="bi bi-chat-fill"></i> 
                <div className="icon-title">Communiqués</div> 
                </Link>
            </div>
        </div>


      <Link
        to="#"
        id="scroll-top"
        className={`scroll-top d-flex align-items-center justify-content-center ${isScrollTopActive ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}>
        
        <i className="bi bi-arrow-up-short"></i>
      </Link>
    </div>);

};

export default Footer;
