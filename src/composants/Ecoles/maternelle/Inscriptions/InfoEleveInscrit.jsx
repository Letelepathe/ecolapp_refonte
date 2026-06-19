import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import axios from 'axios';
import ImgDrapeau from "../../../../static/images/drapeau.png";
import ImgSymbole from "../../../../static/images/symb.png";

const InfoEleveInscritmaternelle = () => {
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


  const [eleve, setEleve] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchEleveInfo = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/inscription/${id}`);
        console.log("Réponse de l'API :", response.data.id);
        setEleve(response.data.inscription);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'élève:", error);
      }
    };

    fetchEleveInfo();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!eleve || eleve.message) {
    return <div className="u-style-72a68ac3">{eleve ? eleve.message : 'Chargement des informations...'}</div>;
  }

  if (!ecole) {
    return (
      <div className="spinner"></div>);

  }

  return (
    <main className="info-eleve-container">
      <div className="info-eleve-card">
        <div className="info-eleve-card-body">
          {/* En-tête */}
          <div className="info-eleve-header">
            <div className="info-eleve-row justify-content-between d-flex">
              <img src={ImgDrapeau} alt="logo collège" className="info-eleve-logo u-style-9ce04a60" />
              <div className='text-center'>
                <h3>ecolapp</h3>
                <h4>{ecole.name}</h4>
                <h6>Bulletin de demande d'inscription</h6>
              </div>
              <img src={ImgSymbole} alt="logo RDC" className="info-eleve-logo u-style-9ce04a60" />
            </div>
            <hr />
          </div>

          {/* Informations personnelles */}
          <fieldset className="info-eleve-fieldset text-center">
            <legend className="info-eleve-legend">Informations personnelles</legend>
            <div className="info-eleve-row">
              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Nom</label>
                <span className="info-eleve-value">{eleve.name}</span>
              </div>
              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Postnom</label>
                <span className="info-eleve-value">{eleve.first_name}</span>
              </div>
              <div className="info-eleve-col-12">
                <label className="info-eleve-label">Prénom</label>
                <span className="info-eleve-value">{eleve.last_name}</span>
              </div>
              <div className="info-eleve-col-12">
                <label className="info-eleve-label">Sexe</label>
                <span className="info-eleve-value">{eleve.sexe}</span>
              </div>
              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Lieu de naissance</label>
                <span className="info-eleve-value">{eleve.lieu_de_naissance}</span>
              </div>
              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Date de naissance</label>
                <span className="info-eleve-value">{eleve.date_naissance}</span>
              </div>
              <div className="info-eleve-col-12 text-center">
                <label className="info-eleve-label">Nationalité</label>
                <span className="info-eleve-value">{eleve.nationalite}</span>
              </div>
            </div>
          </fieldset>

          {/* Parcours scolaire */}
          <fieldset className="info-eleve-fieldset text-center">
            <legend className="info-eleve-legend">Parcours scolaire</legend>
            <div className="info-eleve-row">
              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Ecole de Provenance</label>
                <span className="info-eleve-value">{eleve.ecole_provenance}</span>
              </div>
              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Pourcentage</label>
                <span className="info-eleve-value">{eleve.percent} %</span>
              </div>

              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Option choisie</label>
                <span className="info-eleve-value">{eleve.option.name}</span>
              </div>
              <div className="info-eleve-col-6">
                <label className="info-eleve-label">Classe d'inscription</label>
                <span className="info-eleve-value">{eleve.classe.name}</span>
              </div>
            </div>
          </fieldset>

         
          {/* Footer */}
          <fieldset className="info-eleve-fieldset">
            <p className="info-eleve-legend">Année scolaire : {eleve.annee.name}</p>
          </fieldset>
        </div>
      </div>

      {/* Boutons */}
      <div className="text-center">
        <Link to="/maternelle" className="info-eleve-button info-eleve-">Quitter cette page</Link>
        <button onClick={handlePrint} className="info-eleve-button info-eleve- info-eleve-ml-3">Imprimer</button>
      </div>
    </main>);

};

export default InfoEleveInscritmaternelle;
