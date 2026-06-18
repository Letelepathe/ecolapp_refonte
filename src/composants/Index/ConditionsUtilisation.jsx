import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ConditionsUtilisation.css';
import Header2 from './Header2';
import Footer from './Footer';

// Importations des fichiers static_index

const ConditionsUtilisation = () => {
  return (
   <div>
    <Header2 />
      <div className="container my-5 conditions-container">
      <h2 className="text-center my-4 text-primary">Conditions d'Utilisation</h2>
      
      <div className="condition-section">
        <h4 className="mt-4">1. Acceptation des Termes</h4>
        <p>
          En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et 
          réglementations applicables, et convenez que vous êtes responsable de vous conformer aux lois locales. 
          Si vous êtes en désaccord avec ces termes, vous êtes prié de ne pas utiliser ce site.
        </p>
      </div>

      <div className="condition-section">
        <h4 className="mt-4">2. Modifications des Conditions</h4>
        <p>
          L'école se réserve le droit de modifier ces conditions à tout moment. Il est de votre responsabilité de 
          vérifier régulièrement les changements. En continuant à utiliser le site après les modifications, vous 
          acceptez les nouvelles conditions.
        </p>
      </div>

      <div className="condition-section">
        <h4 className="mt-4">3. Utilisation des Contenus</h4>
        <p>
          Les contenus de ce site, y compris les textes, images, et vidéos, sont protégés par les lois sur le 
          copyright. Toute utilisation non autorisée des contenus peut entraîner des sanctions légales.
        </p>
      </div>

      <div className="condition-section">
        <h4 className="mt-4">4. Propriété Intellectuelle</h4>
        <p>
          Tous les éléments de ce site (logos, textes, graphiques) sont la propriété exclusive de l'école, sauf 
          mention contraire. Toute reproduction ou distribution non autorisée est strictement interdite.
        </p>
      </div>

      <div className="condition-section">
        <h4 className="mt-4">5. Limitation de Responsabilité</h4>
        <p>
          L'école ne peut être tenue responsable des dommages directs ou indirects découlant de l'utilisation ou de 
          l'impossibilité d'utiliser le site. Nous nous efforçons de maintenir des informations précises, mais 
          certaines erreurs peuvent se produire.
        </p>
      </div>

      <div className="condition-section">
        <h4 className="mt-4">6. Juridiction et Loi Applicable</h4>
        <p>
          Les présentes conditions sont régies par les lois locales. En cas de litige, celui-ci sera soumis aux 
          tribunaux compétents du lieu de l'école.
        </p>
      </div>
     
      </div>
    <Footer />
   </div>
    
  );
};

export default ConditionsUtilisation;
