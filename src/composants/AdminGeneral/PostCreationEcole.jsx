import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
const PostCreationEcole = () => {

  const [ecole, setEcole] = useState(null);
  const { id_ecole } = useParams();

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

  if (!ecole) {
    return (
      <div className="spinner"></div>);

  }
  return (
    <main>
          <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100 d-flex">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body text-center">
                    <h1 className="text-center u-style-53b8215d">ecolapp</h1>
                    {ecole ?
                <>
                        <p>Ecole <Link to={`/ecole/choix_direction/${ecole.id}`} target='_blank' rel='noopener noreferrer' className="u-style-4789709b">{ecole.name}</Link> a été créé avec succès.</p>
                          <div className="photo-container w-100 mb-2 mt-2">
                                <img
                      src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`}
                      alt={`${ecole.name}`}
                      className="u-style-72a032cc" />




                    
                          </div>

                        <Link to={`/admin-general/creer_super_admin_ecole/${id_ecole}`} className="btn btn-white u-style-53600632">Créer super admin pour {ecole.name}</Link>
                      </> :

                <p>Chargement des informations...</p>
                }
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>);


};

export default PostCreationEcole;
