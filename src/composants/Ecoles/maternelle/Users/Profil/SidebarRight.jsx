import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SidebarRight = () => {
  const [admins, setAdmins] = useState([]);
  const [horaires, setHoraires] = useState([]);

  useEffect(() => {
    // Appel API pour récupérer les horaires
    const fetchHoraires = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getHoraire.php');
        setHoraires(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires", error);
      }
    };

    // Appel API pour récupérer les administrateurs
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getAdmins.php');
        setAdmins(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des administrateurs", error);
      }
    };

    fetchHoraires();
    fetchAdmins();
  }, []);

  return (
    <div>
            <div className="sidebar-right pe-0 pb-0">
                <nav className="navbar  navbar-white">
                    <Link to='#' className="navbar-brand mx-4 mb-3">
                        <h3 className="u-style-951c0e5f">
                            <i className="icon me-2"></i>Ecole-App
                        </h3>
                    </Link>
                    <div className="navbar-nav w-100">
                        <div className="container">
                            <div className="col-lg-12 col-12">
                                <div className="h-100  rounded mb-3 p-0">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <p className="mb-0 text-primary">Responsables disponibles</p>
                                    </div>

                                    {/* Liste des administrateurs */}
                                    {admins && admins.length > 0 ?
                  admins.map((admin, index) =>
                  <div className="d-flex align-items-center border-bottom py-3" key={index}>
                                                <img
                      src={`http://localhost/ecole-app/membres/avatars/${admin.avatar || 'default.jpg'}`}
                      className="rounded-circle flex-shrink-0 u-style-94f8a038"
                      alt="Profil" />

                    
                                                <div className="w-100 ms-3">
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h6 className="mb-0">{admin.prenom} {admin.nom}</h6>
                                                    </div>
                                                    <span>
                                                        <Link to={`/maternelle/mon_profil/${admin.id}`} className="btn ">Voir le profil</Link>
                                                    </span>
                                                </div>
                                            </div>
                  ) :

                  <p>Aucun administrateur disponible.</p>
                  }
                                </div>

                                {/* Section des horaires */}
                                <section id="recent-blog-posts" className="recent-blog-posts">
                                    <header className="section-header">
                                        <h2>Horaires</h2>
                                    </header>
                                    <div className="row">
                                        {horaires.map((horaire) =>
                    <div className="col-lg-12" key={horaire.id}>
                                                <div className="post-box">
                                                    <div className="post-img">
                                                        <img src={`http://localhost/ecole-app/Horaires/${horaire.image}`} className="img-fluid" alt="" />
                                                    </div>
                                                    <span className="post-date">{horaire.titre}</span>
                                                </div>
                                            </div>
                    )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>);

};

export default SidebarRight;
