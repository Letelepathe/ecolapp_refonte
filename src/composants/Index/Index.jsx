import React, { useEffect } from 'react';
import AOS from 'aos';
import { Link } from 'react-router-dom';
import NavbarBottom from "./NavbarBottom";

import ImageEcole from '../../static/images/image_ecole.webp';


const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: true, 
    });
  }, []);

  return (
    <section className="her container-fluid text-center justify-content-center shadow py-3" 
      // style={{
      //   borderRadius: '0 0 20px 20px', 
      // }}
    >
      <h1 className="titre" data-aos="fade-up">ecolapp</h1>
      <p className="p" data-aos="fade-right">
        <span>ecolapp, gestion scolaire simplifiée et efficace.</span>
         <br />
        <span>
          Un outil tout-en-un pour les écoles, enseignants, élèves, et parents.
        </span>
      </p>
      <div className="photo-container">
        <div className="circle"></div>
        <img
          src={ImageEcole}
          alt="ecolapp"
          className="img-fluid-1 img_index"
          data-aos="zoom-in"
        />
      </div>
      
    </section>
  );
};

const Card = ({ icon, text, lien }) => {
  return (
    
      <div className="card">
        <div className="card-body">
          <h5 className="card-title"> <i className={`${icon}`} style={iconStyle}></i> </h5>
          <p className="card-text">{text}</p>
          <Link to={lien} className="btn btn-custom ms-3">Explorer</Link>
        </div>
      </div>
   
  );
};

const CardsSection = () => {
  return (
    <div className="section-cards container-fluid">
      <div className="row">
        
        <div className="col-lg-3 col-md-12 col-sm-12 mb-4 b">
          <div className="" style={titreStyle}>
           Ecoles
          </div>
          <Card
            icon="bi bi-mortarboard-fill icon"
            text=""
            lien="/ecoles"
          />
        </div>
        <div className="col-lg-3 col-md-6 mb-4 b">
          <div className="" style={titreStyle}>
           Parents
          </div>
          <Card
            icon="bi bi-person-fill icon"
            text=""
            lien="/parent"
          />
        </div>
        <div className="col-lg-3 col-md-12 col-sm-12 mb-4 b">
          <div className="" style={titreStyle}>
           A propos
          </div>
          <Card
            icon="bi bi-info-circle-fill icon"
            text=""
            lien="/apropos"
          />
        </div>
        <div className="col-lg-3 col-md-6 mb-4 b">
          <div className="" style={titreStyle}>
           Services
          </div>
          <Card
            icon="bi bi-flower1 icon"
            text=""
            lien="/services"
          />
        </div>
      </div>
    </div>
  );
};

const Copyright = () => {
    const currentYear = new Date().getFullYear(); 
  
    return (
      <footer>
        <p className='text-center'>
            &copy; <span>{currentYear}</span> 
            <strong className="px-1">ecolapp</strong> 
            <span>Tous droits réservés</span>
        </p>
      </footer>
    );
};



const Index = () => {
  return (
    <div className="bloc-index">
      <HeroSection />
      <CardsSection />
      <Copyright />
      <NavbarBottom />
     
    </div>
  );
};
const iconStyle = {
  fontSize: '30px',
  color: '#fff',
  textAlign:'center',
  backgroundColor:'#1769ff',
  borderRadius:'15px 15px 0 0',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  padding:'10px',
};

const titreStyle = {
  fontSize: '30px',
  color: '#fff',
  textAlign:'center',
  backgroundColor:'#1769ff',
  borderRadius:'15px 15px 0 0',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  padding:'10px',
};

export default Index; 
