import React from "react";
import { Link } from "react-router-dom";
const NavbarBottom = () => {
    return (
          <div className="navbarbot">
              <div className="ico">
                <Link to="/">
                  <i className="bi bi-house-fill"></i>
                  <div className="icon-title">Accueil</div>
                </Link>
              </div>
              <div className="ico">
                <Link to="/ecoles">
                  <i className="bi bi-mortarboard-fill"></i>
                  <div className="icon-title">Ecoles</div>
                </Link>
              </div>
              <div className="ico">
                <Link to="/parent">
                  <i className="bi bi-person-fill"></i>
                  <div className="icon-title">Parents</div>
                </Link>
              </div>
              <div className="ico">
                <Link to="/services">
                  <i className="bi bi-flower1"></i>
                  <div className="icon-title">Services</div>
                </Link>
              </div>
              
              
              <div className="ico">
                <Link to="/apropos">
                  <i className="bi bi-info-circle-fill"></i>
                  <div className="icon-title">A propos</div>
                </Link>
              </div>
          </div>
      
    );
  };
export default NavbarBottom; 