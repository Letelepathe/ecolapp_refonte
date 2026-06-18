import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const NavbarBottom = () => {
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
     
      <div className="navbarbot u-style-9eb582cb">
        <div className="ico">
          <Link to="/">
            <i className="bi bi-house-fill"></i>
            <div className="icon-title">Accueil</div>
          </Link>
        </div>
        <div className="ico">
          <Link to="/services">
            <i className="bi bi-flower1"></i>
            <div className="icon-title">Services</div>
          </Link>
        </div>
       <div className="ico">
          <Link to="/ecoles">
            <i className="bi bi-mortarboard-fill"></i>
            <div className="icon-title">Ecoles</div>
          </Link>
        </div>
        <div className="ico">
          <Link to="/apropos">
            <i className="bi bi-info-circle-fill"></i>
            <div className="icon-title">A propos</div>
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

export default NavbarBottom;
