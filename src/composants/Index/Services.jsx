import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header2 from './Header2';
import Footer from './Footer';

const Avantages = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup de l'événement lors du démontage du composant
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Définition des styles
  const styles = {
    hero: {
      marginTop: windowWidth < 986 ? "-20px" : "30px",
    },
    sectionContent: {
      borderRadius: "15px",
      backgroundColor: "#ffffff",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      fontFamily: "'Roboto', sans-serif",
      color: "#333333",
      lineHeight: "1.8",
      fontSize: "16px",
    },
    heading: {
      fontWeight: "bold",
      color: "#0d83fd",
    },
    statContent: {
      fontWeight: "bold",
      color: "#0d83fd",
    },
    imageStyle: {
      objectFit: "cover",
      borderRadius: "10px",
      height: "400px",
      marginBottom: "10px",
    },
    btnPrimary: {
      padding: "12px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      textDecoration: "none",
      color: "#fff",
      backgroundColor: "#0d83fd",
      transition: "all 0.3s ease-in-out",
    },
  };

  return (
    <section id="hero" className="hero section " style={styles.hero}>
      <div className="container">
        <h2 data-aos="fade-up" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px', color: '#0d83fd' }}>
          Pourquoi choisir ecolapp ?
        </h2>
        <div className="row stats-row gy-4 mt-5">
          <div className="col-lg-3 col-md-6" data-aos="fade-right">
            <div className="stat-item" style={styles.sectionContent}>
              <div className="stat-icon" style={{ marginBottom: '15px' }}>
                <i className="bi bi-clipboard-data" style={{ fontSize: '2rem', color: '#0d83fd' }}></i>
              </div>
              <div className="stat-content">
                <h4 style={styles.heading}>Solution complète</h4>
                <p className="mb-0">
                  ecolapp centralise tous les aspects de la gestion scolaire et de l'apprentissage en ligne.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6" data-aos="fade-right">
            <div className="stat-item" style={styles.sectionContent}>
              <div className="stat-icon" style={{ marginBottom: '15px' }}>
                <i className="bi bi-activity" style={{ fontSize: '2rem', color: '#0d83fd' }}></i>
              </div>
              <div className="stat-content">
                <h4 style={styles.heading}>Accessibilité</h4>
                <p className="mb-0">
                  Utilisez ecolapp sur tous vos appareils, avec ou sans connexion Internet.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6" data-aos="fade-left">
            <div className="stat-item" style={styles.sectionContent}>
              <div className="stat-icon" style={{ marginBottom: '15px' }}>
                <i className="bi bi-eject" style={{ fontSize: '2rem', color: '#0d83fd' }}></i>
              </div>
              <div className="stat-content">
                <h4 style={styles.heading}>Facilité d'utilisation</h4>
                <p className="mb-0">Une interface intuitive pour les enseignants, les élèves et les parents.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6" data-aos="fade-left">
            <div className="stat-item" style={styles.sectionContent}>
              <div className="stat-icon" style={{ marginBottom: '15px' }}>
                <i className="bi bi-award" style={{ fontSize: '2rem', color: '#0d83fd' }}></i>
              </div>
              <div className="stat-content">
                <h4 style={styles.heading}>Soutien aux écoles</h4>
                <p className="mb-0">ecolapp facilite l'adoption de solutions numériques pour les écoles de toutes tailles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  return (
    <div>
      <Helmet>
        <title>ecolapp | services</title>
      </Helmet>
      <Header2 />
      <main id='main'>
        <section id="features-cards" className="bloc-service-index features-cards section">
          <div className="container">
            <h1 className="" style={{ color: '#1769ff', textAlign: 'center', fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem' }} data-aos="fade-down">Services</h1>
            <p className='text-center' data-aos="fade-up">La solution complète pour la gestion des établissements scolaires et l'apprentissage en ligne</p>
            <div className="row gy-4">
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-file" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Vérification bulletin</h4>
                  <p>
                    Souhaite-vous checker le bulletin d'un élève ? ecolapp vous permet de le faire pour n'importe quelle année.
                  </p>
                  <p>
                    <Link to='/bulletin/checking' className='btn btn-white w-100' style={{background:'#1769ff', color:'#fff', borderRadius:'25px'}}> Checker bulletin</Link>
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-journal-text" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Gestion des notes et génération de bulletins</h4>
                  <p>Les enseignants gèrent les notes des élèves directement sur l'application. ecolapp délibère automatiquement, calcule les pourcentages et génère les bulletins pour tous les niveaux. De plus, même après avoir quitté l'école, un élève peut toujours accéder à ses bulletins et les imprimer, garantissant une consultation permanente des notes des années passées.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-cloud-download" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Accès hors ligne</h4>
                  <p>Les élèves peuvent accéder à leurs cours, devoirs et documents pédagogiques même sans connexion Internet, grâce à la fonctionnalité hors ligne. Cela permet une continuité d'apprentissage, même dans des zones à faible couverture.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-person-plus" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Gestion des inscriptions</h4>
                  <p>ecolapp permet aux parents d'inscrire leurs enfants directement en ligne, centralisant toutes les informations administratives nécessaires. Cela simplifie le processus d'inscription pour les écoles et les familles.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-calendar-week" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4> Gestion des emplois du temps</h4>
                  <p>Les écoles peuvent créer et ajuster facilement les emplois du temps pour les élèves et les enseignants. Cela permet une planification optimale des cours et des ressources disponibles.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-stopwatch" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Suivi des absences et retards</h4>
                  <p>Les enseignants peuvent suivre les absences et les retards des élèves en temps réel. Les parents sont également informés immédiatement, avec la possibilité de justifier les absences directement via l'application.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-cash-coin" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Gestion des finances et paiements</h4>
                  <p>ecolapp offre une plateforme de communication directe entre l’école, les enseignants et les parents. Des notifications instantanées, des messages et des annonces peuvent être envoyés pour assurer une bonne collaboration.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-graph-up" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Suivi des performances</h4>
                  <p>La plateforme permet de gérer les frais de scolarité, les paiements des activités et les factures des parents, tout en offrant une transparence totale sur l'état des finances de l'établissement scolaire.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Création et gestion de cours en ligne</h4>
                  <p>Les enseignants peuvent créer et télécharger des contenus pédagogiques sous différents formats (vidéos, fichiers PDF, présentations, etc.), facilitant l'accès au matériel éducatif pour les élèves.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-question-circle" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Création de quiz interactifs</h4>
                  <p>Les enseignants peuvent concevoir des quiz interactifs pour évaluer les connaissances des élèves. Les résultats sont immédiatement disponibles, permettant aux enseignants de suivre les progrès individuels.</p>
                </div>
              </div>
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-bar-chart-line" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Suivi des performances des élèves</h4>
                  <p>Suivez les progrès des élèves grâce à des tableaux de bord clairs et précis, avec des analyses détaillées.</p>
                </div>
              </div>
              
              <div className="col-xl-3 col-md-6" data-aos="fade-up">
                <div className="feature-box blue" style={{ borderRadius: '15px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px', backgroundColor: '#fff' }}>
                  <i className="bi bi-display" style={{ fontSize: '2rem', color: '#0d83fd', marginBottom: '15px', display: 'block' }}></i>
                  <h4>Interface conviviale et intuitive</h4>
                  <p>L'interface d'ecolapp est simple et intuitive, permettant aux utilisateurs (enseignants, parents, élèves) de naviguer facilement à travers les différentes fonctionnalités. Cette accessibilité simplifie l'utilisation pour tous les acteurs de l'établissement scolaire.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Avantages />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
