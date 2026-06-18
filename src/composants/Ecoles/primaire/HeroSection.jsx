import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const HeroSection = ({ ecole }) => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [options, setOptions] = useState([]);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
        setOptions(response.data.optionAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des options:", error);
      }
    };
    fetchOptions();
  }, [ecole_id, direction]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Met à jour la largeur de la fenêtre chaque fois que la taille de l'écran change
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup de l'événement lors du démontage du composant
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="hero section">
      <div className="container">
        <div className={`row justify-content-center text-center align-items-center hero-cycle-ligne ${windowWidth < 986 ? "hero-cycle-mobile" : "hero-cycle-desktop"}`}>
          {/* Hero Content */}
          <div className="col-lg-6 col-12">
            <div className="hero-content">
              <div className="photo-container-2 mb-4">
                  <img
                  src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`}

                  alt={`${ecole.name}`} className="u-style-ceffc432" />
                 
                <span></span>
              </div> 

              <h1 className="mb-4">
                <span className="style-fr-9e6da49f">
                  ecolapp
                </span><br />
                <span>{ecole.name}</span>

              </h1>

            </div>
          </div>

        
        </div>

        {/* Section Content */}
        <div className="text-center mt-2 mb-2">
          <div className="options-etudes-container row justify-content-center text-center align-items-center">
           
            <div className='col-lg-6 col-12 container'>
              <div className="shadow  justify-content-center align-items-center container py-4 u-style-420aab4e">
                <h3 className="options-title">Options d'études</h3>
                <ul className="options-list">
                    {options.map((option) =>
                  <li><i className="bi bi-check-circle-fill"></i> {option.name}</li>
                  )}
                </ul>
                <Link to="/primaire/inscription_primaire" className="btn btn-white w-100 u-style-c8d00b4f">Prendre Inscription</Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>);

};

export default HeroSection;
