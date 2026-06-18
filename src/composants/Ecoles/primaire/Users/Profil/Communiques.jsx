import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Communiques = () => {
  const ecole_id = parseInt(localStorage.getItem('ecole_id') || 0, 10);
  const direction = parseInt(localStorage.getItem('direction') || 0, 10);
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
          src={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
          className="img-fluid w-100 u-style-a38c38cd"
          alt="Communiqué visuel" />);



    }
    if (fileExtension === 'pdf') {
      return (
        <a
          href={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary">
          
          Voir PDF
        </a>);

    }
    return (
      <a
        href={`https://api.ecolapp.cd/public/imgCommunique/${file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary">
        
        Télécharger le fichier
      </a>);

  };

  return (
    <section id="recent-blog-posts" className="recent-blog-posts">
      <div className="container">
        <h3 className="text-primary text-center">Récents communiqués</h3>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 }
          }}>
          
          {communiques.map((communique) =>
          <SwiperSlide key={communique.id}>
              <div className="post-box card">
                <div className="post-img">
                  {renderFile(communique.file)} 
                </div>
                <div className="py-3 container">
                  <span className="post-date">
                    {new Date(communique.created_at).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                  })}
                  </span>
                  <h6 className="post-title">{communique.title}</h6>
                  <p>{truncateText(communique.content, 30)}</p>
                  <Link
                  to={`/primaire/details-communique/${communique.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-100">
                  
                    Lire plus <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>);

};

export default Communiques;
