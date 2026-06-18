import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const DetailsCommunique = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  const { id } = useParams();
  const [communique, setCommunique] = useState(null);
  const [otherCommuniques, setOtherCommuniques] = useState([]);

  useEffect(() => {
    const fetchCommuniqueById = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/communique/${id}`);
        setCommunique(response.data.id);
      } catch (error) {
        console.error("Erreur lors de la récupération du communiqué", error);
      }
    };

    const fetchOtherCommuniques = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/communique/ecole/${ecole_id}/direction/${direction}`);
        setOtherCommuniques(response.data.communiqueAll.filter((item) => item.id !== parseInt(id)));
      } catch (error) {
        console.error("Erreur lors de la récupération des autres communiqués", error);
      }
    };

    fetchCommuniqueById();
    fetchOtherCommuniques();
  }, [id, ecole_id, direction]);

  if (!communique) {
    return <p className="spinner"></p>;
  }

  const renderFile = (file) => {
    if (!file) return <span>Aucun fichier</span>;

    const fileExtension = file.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return (
        <img
          src={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
          alt="Communiqué visuel"
          className="img-fluid rounded mt-3"
        />
      );
    }
    if (fileExtension === 'pdf') {
      return (
        <a
          href={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-3"
        >
          Voir PDF
        </a>
      );
    }
    return (
      <a
        href={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary mt-3"
      >
        Télécharger le fichier
      </a>
    );
  };

  return (
    <div className="container my-5">
      <div className="row">
        {/* Bouton retour */}
        <div className="col-12">
          <Link to="/maternelle/communiques" className="btn btn-primary text-white mb-4">
            <i className="bi bi-arrow-left"></i>
          </Link>
        </div>

        {/* Contenu principal */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="card-title text-center">{communique.title}</h1>
              <p className="text-muted text-center">
                {new Date(communique.created_at).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="card-text">{communique.content}</p>
              {renderFile(communique.file)}
            </div>
          </div>
        </div>

        {/* Autres communiqués */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4">Autres Communiqués</h4>
              {otherCommuniques.map((item) => (
                <div key={item.id} className="d-flex align-items-start mb-3">
                  <Link
                    to={`/maternelle/details-communique/${item.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <img
                      src={`https://api.ecolapp.cd/public/imgCommunique/${item.file}`}
                      alt={item.title}
                      className="img-thumbnail me-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div>
                    <h6 className="mb-1">                  
                        {item.title}                    
                    </h6>
                    <p className="text-muted small mb-1">
                      {new Date(item.created_at).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="small mb-0">
                      {item.content.length > 50
                        ? `${item.content.substring(0, 50)}...`
                        : item.content}
                    </p>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsCommunique;
