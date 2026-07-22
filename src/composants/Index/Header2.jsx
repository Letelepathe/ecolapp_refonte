import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleMobileNavToggle = () => {
    setMobileNavActive(!mobileNavActive);
    document.body.classList.toggle('mobile-nav-active', !mobileNavActive);
  };

  const closeMobileNav = () => {
    setMobileNavActive(false);
    document.body.classList.remove('mobile-nav-active');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      document.body.classList.toggle('scrolled', window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="header" className={`d-xl-block d-md-block d-none header align-items-center fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-lg d-flex align-items-center justify-content-between">
        <a href="index" className="logo d-flex align-items-center">
          <h1 className="sitename u-style-951c0e5f">ecolapp</h1>
        </a>
        <nav id="navmenu" className={`navmenu ${mobileNavActive ? 'mobile-nav-active' : ''}`}>
          <ul>
            <li><Link to="/" className="active" onClick={closeMobileNav}>Accueil</Link></li>
            <li><Link to="/apropos" onClick={closeMobileNav}>À Propos</Link></li>
            <li><Link to="/services" onClick={closeMobileNav}>Services</Link></li>
            <li><Link to="/ecoles" onClick={closeMobileNav}>Ecoles</Link></li>
           
            {/* <li className="dropdown d-lg-block d-none">
                <Link to="#">
                  <span>Etablissements</span> <i className="bi bi-chevron-down toggle-dropdown"></i>
                </Link>
                <ul>
                  <li><Link to="/maternelle" onClick={closeMobileNav}>Maternelle</Link></li>
                  <li><Link to="/primaire" onClick={closeMobileNav}>Primaire</Link></li>
                  <li><Link to="/secondaire" onClick={closeMobileNav}>Secondaire</Link></li>
                </ul>
               </li> */}
            {/* <li><Link to="/contact" onClick={closeMobileNav}>Contact</Link></li> */}
          </ul>
          <span className="mobile-nav-toggle d-xl-none" onClick={handleMobileNavToggle}>
            <i className={`${`bi ${mobileNavActive ? 'bi-x' : 'bi-list'}`} style-fr-8fda81e7`}></i>
          </span>
        </nav>
        
      </div>
      
      
    </header>);

};

export default Header;
