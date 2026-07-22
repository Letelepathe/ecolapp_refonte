import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import BlocCommuniques from './Communique/BlocCommuniques';
const Communiques = () => {
      const [ecole, setEcole] = useState(null);
      const id_ecole = localStorage.getItem('ecole_id');
    
      useEffect(() => {
        const fetchInfoEcole = async () => {
          try {
            const response = await axios.get(`https://api.ecolapp.cd/api/ecole/ecole_id/${id_ecole}`);
            setEcole(response.data.ecole);
          } catch (error) {
            console.error("Erreur lors de la récupération des informations:", error);
          }
        };
    
        fetchInfoEcole();
      }, [id_ecole]);
    
      if(!ecole){
        return (
            <div className="spinner"></div>
        );
      }
  

  return (
    <div>
      <Helmet>
        <title>ecolapp | communiqués</title>
      </Helmet>
      <Header />
      <main className="main">

        <div className="page-title light-background">
          <div className="container">
            <h1>Communiqués</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><Link to='/secondaire'>Accueil</Link></li>
                <li className="current">Communiqués</li>
              </ol>
            </nav>
          </div>
        </div>

        <section id="service-details" className="service-details section">

          <div className="container">

            <div className="row gy-5">

              <div className="col-lg-4">

                <div className="service-box">
                  
                </div>

                <div className="service-box">
                  
                </div>

                <div className="help-box d-flex flex-column justify-content-center align-items-center">
                  <i className="bi bi-headset help-icon"></i>
                  <h4>Avez-vous une question?</h4>
                  <p className="d-flex align-items-center mt-2 mb-0"><i className="bi bi-telephone me-2"></i> <span><a href={`tel:${ecole.telephone}`} target="_blank" rel="noreferrer">{ecole.telephone}</a></span></p>
                  <p className="d-flex align-items-center mt-1 mb-0"><i className="bi bi-envelope me-2"></i> <a href={`mailto:${ecole.email}`} target="_blank" rel="noopener noreferrer">{ecole.email}</a></p>
                </div>

              </div>

              <div className="col-lg-8 ps-lg-5">
               <BlocCommuniques/>
              </div>

            </div>

          </div>

        </section>

      </main>
      <Footer ecole={ecole} />
 </div>
  );
};

export default Communiques;
