import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Assurez-vous d'importer axios

const Header = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const [user, setUserInfo] = useState(null);
  const [error, setError] = useState(null); // Ajout d'un état pour gérer les erreurs
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        if (response.status === 200) {
          setUserInfo(response.data);
        } else {
          setError(response.data.status_msg);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des informations de l'utilisateur.");
      }
    };

    fetchUser();
  }, []);

  const handleMobileNavToggle = () => {
    setMobileNavActive(!mobileNavActive);
    document.body.classList.toggle('mobile-nav-active', !mobileNavActive);
  };

  const closeMobileNav = () => {
    setMobileNavActive(false);
    document.body.classList.remove('mobile-nav-active');
  };

  useEffect(() => {
    const checkSession = () => {
      const userId = localStorage.getItem('userId');
      const Direction = localStorage.getItem('direction');
      if (user && userId && Number(Direction) === 3 && user.ecole_id === Number(ecole_id)) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    };

    checkSession();

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      document.body.classList.toggle('scrolled', window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]); // Ajouter user comme dépendance

  return (
    <header id="header" className={`header align-items-center fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-fl d-flex align-items-center justify-content-between">
        <Link to='/' className="logo d-flex align-items-center">
          <h1 className="sitename" style={{ fontWeight: 900, color: '#1769ff' }}>ecolapp</h1>
        </Link>
        <nav id="navmenu" className={`navmenu ${mobileNavActive ? 'mobile-nav-active' : ''}`}>
          <ul>
            <li><Link to="/" className="active" onClick={closeMobileNav}>Accueil</Link></li>
            <li><Link to="/maternelle" onClick={closeMobileNav}>Maternelle</Link></li>
            <li><Link to="/apropos" onClick={closeMobileNav}>À Propos</Link></li>
            <li><Link to="/services" onClick={closeMobileNav}>Services</Link></li>
            <li><Link to="/maternelle/inscription_maternelle" onClick={closeMobileNav}>Inscription</Link></li>
            <li className="dropdown d-lg-block d-none">
              <Link to="#">
                <span>Etablissements</span> <i className="bi bi-chevron-down toggle-dropdown"></i>
              </Link>
              <ul>
                <li><Link to="/maternelle" onClick={closeMobileNav}>Maternelle</Link></li>
                <li><Link to="/primaire" onClick={closeMobileNav}>Primaire</Link></li>
                <li><Link to="/maternelle" onClick={closeMobileNav}>maternelle</Link></li>
              </ul>
            </li>
            <li><Link to="/maternelle/contact" onClick={closeMobileNav}>Contact</Link></li>
          </ul>
          <span className="mobile-nav-toggle d-xl-none" onClick={handleMobileNavToggle}>
            <i className={`bi ${mobileNavActive ? 'bi-x' : 'bi-list'}`} style={{color:'#1769ff'}}></i>
          </span>
        </nav>
        {authenticated ? (
          <>
            <Link className="btn-getstarted" to="/maternelle/profil_user" onClick={closeMobileNav}>
              <i className='bi bi-person-circle'></i>
            </Link>
            <Link className="btn-getstarted" to="/maternelle/deconnexion" onClick={closeMobileNav}>
              <i className='bi bi-box-arrow-right'></i>
            </Link>
          </>
        ) : (
          <Link className="btn-getstarted" to="/maternelle/login" onClick={closeMobileNav}>Se connecter</Link>
        )}
      </div>

      <div className="container-fluid py-2 mt-1 d-none d-lg-block" style={{ background: '#1769ff' }}>
        <div className="card-body d-flex align-items-center justify-content-between text-center">
          <Link to="/apropos" target="_blank" className="fw-700 mb-0 font-xssss text-white">
            <i className="bi bi-person-circle"></i> <span>Assistance</span>
          </Link>
          <div className="d-flex align-items-center">
            <Link to="/maternelle/suivi_scolaire" className="text-white d-none d-md-block ms-3" onClick={closeMobileNav}>
              <i className="bi bi-door-open"></i> <span>Suivi scolaire</span>
            </Link>
            <Link to="/services" className="text-white d-none d-md-block ms-3" onClick={closeMobileNav}>
              <i className="bi bi-tools"></i> <span>Services</span>
            </Link>
            <Link to="/apropos" className="text-white d-none d-md-block ms-3" onClick={closeMobileNav}>
              <i className="bi bi-question-circle"></i> <span>FAQ</span>
            </Link>
            <Link to="/maternelle/communiques" className="text-white ms-3" onClick={closeMobileNav}>
              <i className="bi bi-chat-text"></i> <span>Communiqués</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
