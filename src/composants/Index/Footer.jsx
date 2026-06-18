import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Copyright from './Copyright';
import NavbarBottom from './NavbarBottom';

const Footer = () => {
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
      behavior: 'smooth',
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
                    
                    
                </div>
            </div>
            <div className="container copyright text-center mt-4">
                <Copyright />
                <div className="credits">
                    <p><span>Développé par</span> <a href="https://rudless.com/" target="_blank" rel="noopener noreferrer">Team-Cria</a></p>
                </div>
            </div>
        </footer> 

      <NavbarBottom/>

      <Link 
        href="#" 
        id="scroll-top" 
        className={`scroll-top d-flex align-items-center justify-content-center ${isScrollTopActive ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}
      >
        <i className="bi bi-arrow-up-short"></i>
      </Link>
    </div>
  );
};

export default Footer;
