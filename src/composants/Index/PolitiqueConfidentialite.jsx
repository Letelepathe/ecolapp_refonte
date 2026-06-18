import React from 'react';
import Header2 from './Header2';
import Footer from './Footer';

// Importations des fichiers static_index

const PolitiqueConfidentialite = () => {
  return (
    <div>
      <Header2 />
      <div className="container my-5 privacy-container">
        <h2 className="text-center my-4 text-primary">Politique de Confidentialité</h2>
        
        <div className="privacy-section">
          <h4 className="mt-4">1. Collecte des Informations</h4>
          <p>
            Nous recueillons des informations personnelles lorsque vous vous inscrivez sur notre site, remplissez un 
            formulaire ou utilisez nos services. Ces informations incluent votre nom, votre adresse e-mail, et 
            d'autres détails pertinents pour l'utilisation de nos services.
          </p>
        </div>

        <div className="privacy-section">
          <h4 className="mt-4">2. Utilisation des Données</h4>
          <p>
            Les informations collectées sont utilisées pour personnaliser votre expérience, améliorer notre site, et 
            vous fournir un support plus efficace. Nous ne partageons pas vos données sans votre consentement explicite.
          </p>
        </div>

        <div className="privacy-section">
          <h4 className="mt-4">3. Protection des Données</h4>
          <p>
            Nous prenons des mesures de sécurité appropriées pour protéger vos données contre l'accès non autorisé. 
            Toutefois, aucune méthode de transmission de données sur Internet n'est sécurisée à 100%.
          </p>
        </div>

        <div className="privacy-section">
          <h4 className="mt-4">4. Partage des Informations</h4>
          <p>
            Vos données personnelles ne seront pas vendues, échangées ou transférées sans votre consentement, sauf en 
            cas de demande légale ou pour protéger nos droits.
          </p>
        </div>

        <div className="privacy-section">
          <h4 className="mt-4">5. Cookies</h4>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez configurer votre navigateur 
            pour refuser les cookies, mais cela pourrait affecter certaines fonctionnalités du site.
          </p>
        </div>

        <div className="privacy-section">
          <h4 className="mt-4">6. Modifications de la Politique</h4>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute 
            modification sera affichée sur cette page, et nous vous encourageons à la consulter régulièrement.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
