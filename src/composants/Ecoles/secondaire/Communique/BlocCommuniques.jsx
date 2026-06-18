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
    <section id="recent-blog-posts" className="recent-blog-posts" style={styles.section}>
      <div className="container" style={styles.container}>
        <header className="section-header" style={styles.header}>
          <h2 style={styles.title}>Récents communiqués</h2>
          <p style={styles.subtitle}>Consultez les derniers communiqués publiés</p>
        </header>
        <div className="row" style={styles.row}>
          {communiques.map((communique) =>
          <div className="col-lg-4" key={communique.id} style={styles.cardContainer}>
              <div className="post-box" style={styles.card}>
                <div className="post-img" style={styles.imageContainer}>
                  {renderFile(communique.file)}
                </div>
                <span className="post-date" style={styles.date}>
                  {new Date(communique.created_at).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}
                </span>
                <h3 className="post-title" style={styles.cardTitle}>{communique.title}</h3>
                <p style={styles.cardText}>{truncateText(communique.content, 80)}</p>
                <div className="text-center">
                  <Link className="btn btn-white text-white w-100 u-style-77fdd8b0" to={`/secondaire/details-communique/${communique.id}`}>Lire plus <i className="bi bi-arrow-right"></i> </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

const styles = {
  section: {
    padding: "60px 0",
    background: "#f8f9fa"
  },
  container: {
    maxWidth: "1140px",
    margin: "0 auto"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333"
  },
  subtitle: {
    fontSize: "16px",
    color: "#777"
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px"
  },
  cardContainer: {
    flex: "1 1 calc(33.333% - 20px)" // 3 cartes par ligne
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
  cardHover: {
    transform: "translateY(-10px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)"
  },
  imageContainer: {
    marginBottom: "15px",
    overflow: "hidden",
    borderRadius: "8px"
  },
  date: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
    display: "block"
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1769ff",
    marginBottom: "10px"
  },
  cardText: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px"
  },
  readMoreLink: {
    fontSize: "14px",
    color: "#1769ff",
    textDecoration: "none",
    fontWeight: "600"
  }
};

export default BlocCommunique;
