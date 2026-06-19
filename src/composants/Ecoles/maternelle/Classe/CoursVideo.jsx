import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import SidebarLeft from "../Users/Profil/SidebarLeft";
import NavbarTop from "../Users/Profil/NavbarTop";
import PlyrComponent from "plyr-react";
const CoursVideo = () => {
  const [cours, setCours] = useState([]);
  const { id_classe, id_option, id_cours } = useParams();

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get(
          `https://api.ecolapp.cd/api/coursFichier/video/classe/${id_classe}/option/${id_option}/cours/${id_cours}`
        );
        setCours(response.data.cours);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours:", error);
      }
    };

    fetchCours();
  }, [id_classe, id_option, id_cours]);


  const getVideoType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case "mp4":
        return "video/mp4";
      case "avi":
        return "video/avi";
      case "mkv":
        return "video/x-matroska";
      case "mov":
        return "video/quicktime";
      case "wmv":
        return "video/x-ms-wmv";
      case "flv":
        return "video/x-flv";
      default:
        return "video/mp4"; 
    }
  };

  return (
    <div>
      <Helmet>
        <title>ecolapp | Cours Vidéos</title>
      </Helmet>
      <div className="container-fluid position-relative  d-flex p-0">
        <SidebarLeft />
        <div className="content">
          <NavbarTop />
          <div className="container py-4">
            <div className="justify-content-between align-items-center d-flex">
              <Link to={`/maternelle/ma_classe/${id_classe}/${id_option}`} className="btn ">
                Ma classe
              </Link>
              <h6 className="text-primary">Cours Vidéos</h6>
            </div>
            <div className="row">
              {cours.length > 0 ? (
                cours
                  .filter((cf) => {
                    const fileExtension = cf.fichier.split('.').pop().toLowerCase();
                    return ["mp4", "avi", "mkv", "mov", "wmv", "flv"].includes(fileExtension);
                  })
                  .map((cf) => (
                    <div key={cf.id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card  p-3 border-0 rounded-3">
                        <PlyrComponent
                          source={{
                            type: "video",
                            sources: [
                              {
                                src: `https://api.ecolapp.cd/public/Cours/${cf.fichier}`,
                                type: getVideoType(cf.fichier), 
                              },
                            ],
                          }}
                          options={{
                            controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "fullscreen"],
                            hideControls: false,
                          }}
                        />
                        <div className="card-body text-center">
                          <h5 className="card-title">{cf.titre}</h5>
                          <p>{cf.description}</p>
                          <p className="card-text text-muted">
                            <strong>Enseignant:</strong> {cf.enseignant.name} {cf.enseignant.last_name} {cf.enseignant.first_name}
                          </p>
                          <a href={`https://api.ecolapp.cd/public/Cours/${cf.fichier}`} className="btn " download>
                            Télécharger la vidéo
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-center text-muted">Aucune vidéo trouvée.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursVideo;
