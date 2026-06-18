import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlocCommunique = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [communiques, setCommuniques] = useState([]);

  useEffect(() => {
    const fetchCommuniques = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/communique/ecole/${ecole_id}/direction/${direction}`);
        setCommuniques(response.data.communiqueAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des communiqués", error);
      }
    };

    fetchCommuniques();
  }, [ecole_id, direction]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Fonction pour rendre les fichiers image ou PDF
  const renderFile = (file) => {
    if (!file) return <span>Aucun fichier</span>;

    const fileExtension = file.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return (
        <img
          src={`http://api.ecolapp.cd/public/imgCommunique/${file}`}
          alt="Communiqué visuel" className="u-style-b58deaab" />);








    }
    if (fileExtension === 'pdf') {
      return (
        <a
          href={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="file-link">
          
          Voir PDF
        </a>);

    }
    return (
      <a
        href={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="file-link">
        
        Télécharger le fichier
      </a>);

  };

  return (
    <section id="recent-blog-posts" className="recent-blog-posts style-fr-00e19a73">
      <div className="container style-fr-dacd5588">
        <header className="section-header style-fr-ac799bd9">
          <h2 className="style-fr-acd75b9c">Récents communiqués</h2>
          <p className="style-fr-ea117482">Consultez les derniers communiqués publiés</p>
        </header>
        <div className="row style-fr-bbaeca6d">
          {communiques.map((communique) =>
          <div className="col-lg-4 style-fr-3748295c" key={communique.id}>
              <div className="post-box style-fr-c372ca69">
                <div className="post-img style-fr-5fa9ca31">
                  {renderFile(communique.file)}
                </div>
                <span className="post-date style-fr-1c16f4b5">
                  {new Date(communique.created_at).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}
                </span>
                <h3 className="post-title style-fr-95da088d">{communique.title}</h3>
                <p className="style-fr-23c224ff">{truncateText(communique.content, 80)}</p>
                <div className="text-center">
                  <Link className="btn btn-white text-white w-100 u-style-77fdd8b0" to={`/maternelle/details-communique/${communique.id}`}>Lire plus <i className="bi bi-arrow-right"></i> </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};








































































export default BlocCommunique;
