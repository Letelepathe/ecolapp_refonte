import React, { useEffect } from 'react';
import AOS from 'aos';
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header2 from './Header2';

const Infos = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <main id='main'>
      <section id="features-cards" className="bloc-apropos-index features-cards section">
        <div className="container">
          <h1 className="u-style-14505968" data-aos="fade-up">A propos</h1>
          <p className="text-center u-style-8e1e36d5" data-aos="zoom-in">La solution complète pour la gestion des établissements scolaires et l'apprentissage en ligne</p>
          <div className="row gy-4">
            <div className="col-xl-4 col-md-6" data-aos="fade-right">
              <div className="feature-box blue u-style-5425ede8">
                <i className="bi bi-bullseye u-style-1a8a3181"></i>
                <h4>Notre Mission</h4>
                <p>ecolapp a été conçu pour révolutionner l'éducation en simplifiant la gestion scolaire et en facilitant l'apprentissage en ligne. Nous mettons à disposition des écoles et des établissements éducatifs une plateforme intuitive et tout-en-un, permettant une gestion efficace et une expérience éducative optimale pour les enseignants, les élèves et les parents.</p>
              </div>
            </div>
            <div className="col-xl-4 col-md-6" data-aos="fade-left">
              <div className="feature-box blue u-style-5425ede8">
                <i className="bi bi-binoculars u-style-1a8a3181"></i>
                <h4>Notre Vision</h4>
                <p>Nous imaginons un avenir où toutes les écoles, qu'elles soient petites ou grandes, publiques ou privées, peuvent bénéficier d'outils numériques de pointe pour améliorer l’éducation. ecolapp aspire à devenir la référence mondiale en matière de solutions numériques éducatives, permettant à chaque établissement d'optimiser sa gestion administrative et de favoriser un apprentissage interactif et dynamique.</p>
              </div>
            </div>
            <div className="col-xl-4 col-md-6" data-aos="zoom-in">
              <div className="feature-box blue u-style-5425ede8">
                <i className="bi bi-people u-style-1a8a3181"></i>
                <h4>Notre Équipe</h4>
                <p>Notre équipe est composée de professionnels passionnés par l'éducation et la technologie. Ensemble, nous travaillons sans relâche pour développer des solutions innovantes qui répondent aux besoins changeants des établissements scolaires à travers le monde. Nous mettons un point d'honneur à écouter les besoins des enseignants, des parents et des élèves afin de constamment améliorer nos services.</p>
                <Link to='https://cria-unikin.net' target="_blank" rel="noopener noreferrer" className="u-style-414c3570">Voir plus</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>);

};

const Apropos = () => {
  return (
    <div>
      <Header2 />
      <div className="bloc-index">
        <Infos />
      </div>
      <Footer />
    </div>);

};

export default Apropos;
