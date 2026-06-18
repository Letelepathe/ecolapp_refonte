import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
const AccueilInscriptionsecondaire = () => {
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

  if (!eleve || eleve.message) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            {eleve ? (
              <p className="text-center text-info">{eleve.message}</p>
            ) : (
              <p className="spinner"></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100 d-flex">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h1 className="text-primary text-center">Bienvenue, {eleve.last_name} {eleve.name} !</h1>
                <p className="text-center">
                  Votre demande d'inscription a été soumise avec succès. Veuillez vous rendre à la direction 
                  dans les 48 heures accompagné(e) d'un responsable et muni de votre dossier et Bulletin de demande d'inscription imprimé pour confirmer votre inscription.
                </p>
                {/* <p className="text-center">
                  Voici votre code de confirmation : 
                  <span className="text-primary"> {eleve.confirmekey}</span>
                </p> */}
                <p className="text-center">
                  Nous sommes ravis de vous accueillir dans notre établissement. Merci pour votre confiance !
                </p>
                <div className="text-center">
                  <Link to={`/secondaire/info_eleve_inscrit_secondaire/${id}`} className="btn btn-primary ml-3">
                    Voir et imprimer mon bulletin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccueilInscriptionsecondaire;
