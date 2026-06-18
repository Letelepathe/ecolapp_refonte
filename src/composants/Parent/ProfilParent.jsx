import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import './ProfilParent.css';

const ProfilParent = () => {
  const [parent, setParent] = useState(null);
  const parent_id = localStorage.getItem('parentId');

  useEffect(() => {
    const fetchParentInfo = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/parents/${parent_id}`);
        if (response.data.status === 200) {
          setParent(response.data.parent);
        } else {
          console.error("Erreur lors de la récupération des informations.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations:", error);
      }
    };

    fetchParentInfo();
  }, [parent_id]);

  const getNiveau = (direction) => {
    switch (direction) {
      case 3:
        return 'secondaire';
      case 2:
        return 'primaire';
      case 1:
        return 'maternelle';
      default:
        return '';
    }
  };

  if (!parent) {
    return <div className='spinner'></div>;
  }



  return (
    <div>
      <Helmet>
        <title>ecolapp | profil parent</title>
      </Helmet>
      <div className="container mt-4">
        <div className="row">

          {/* Bloc Parent à gauche */}
          <div className="col-md-12">
            <div className="bloc-profil-parent">
              <div className="profile-container">
                <div className="profile-block">
                  <img
                    src={`https://api.ecolapp.cd/public/imgParent/${parent.photo}`}
                    alt={`${parent.prenom}`}
                    className="profile-img"
                  />
                  <div className="text-center" style={{ color: '#1769ff', fontWeight: 'bold', fontSize: '20px' }}>
                    {parent.nom} {parent.postnom} {parent.prenom}
                  </div>
                </div>

                <div className="profile-block text-start">
                  <div className="info-item"><i className="bi bi-gender-male"></i> <strong>Sexe:</strong> {parent.sexe}</div>
                  <div className="info-item"><i className="bi bi-phone"></i> <strong>Téléphone:</strong> {parent.telephone}</div>
                  <div className="info-item"><i className="bi bi-map"></i> <strong>Adresse:</strong> {parent.adresse}</div>
                  <div className="info-item"><i className="bi bi-shield-lock"></i> <strong>Profession:</strong> {parent.profession}</div>
                </div>

                <div className="profile-block btn-block">
                  <Link to="/parent/deconnexion" className="btn btn-danger btn-custom">
                    <i className="bi bi-box-arrow-right"></i> Déconnexion
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc Enfants à droite */}
          <div className="col-md-12 mt-2">
            <div className="shadow bg-white" style={{borderRadius:'15px'}}>
            
              <div className="row py-2">
                <h4 className="mb-4 mt-4 text-center" style={{color:'#1769ff'}}>Enfants ({parent.eleves.length})</h4>
                {parent.eleves && parent.eleves.length > 0 ? (
                  parent.eleves.map((eleve, index) => (
                    <div key={index} className="col-md-4 mb-4">
                      <div className="bloc-profil-parent">
                        <div className="profile-container">
                          <div className="profile-block text-center">
                            <div className="profile-img-placeholder">
                              <i className="bi bi-person-circle" style={{ fontSize: '60px', color: '#1769ff' }}></i>
                            </div>
                            <div style={{ color: '#1769ff', fontWeight: 'bold', fontSize: '18px' }}>
                              {eleve.name} {eleve.last_name} {eleve.first_name}
                            </div>
                          </div>

                          <div className="profile-block text-start">
                            <div className="info-item"><i className="bi bi-gender-ambiguous"></i> <strong>Sexe:</strong> {eleve.sexe}</div>
                            <div className="info-item"><i className="bi bi-book"></i> <strong>Classe:</strong> {eleve.classe?.name || '-'}</div>
                            <div className="info-item"><i className="bi bi-diagram-3"></i> <strong>Option:</strong> {eleve.option?.name || '-'}</div>
                            <div className="info-item"><i className="bi bi-building"></i> <strong>École:</strong> {eleve.ecole?.name || '-'}</div>
                            <div className="info-item"><i className="bi bi-lock"></i> <strong>Matricule:</strong> {eleve.matricule || '-'}</div>
                          </div>

                          <div className="profile-block btn-block">
                        
                            <Link
                              to={`/${getNiveau(eleve.direction)}/panel_eleve/${eleve.id}/${eleve.ecole_id}/${eleve.direction}`}
                              className="btn btn-white btn-custom"
                              style={{ background: '#1769ff', color: '#fff', borderRadius: '25px' }}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <i className="bi bi-eye"></i> Suivi
                            </Link>

                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center text-muted">Aucun enfant trouvé.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilParent;
