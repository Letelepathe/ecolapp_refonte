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

  if(!ecole){
    return(
      <div className="spinner"></div>
    );
  }
  return (
        <main>
          <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100 d-flex">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body text-center">
                    <h1 className="text-center" style={{ fontWeight: 900, color: '#1769ff', fontSize: '30px' }}>ecolapp</h1>
                    {ecole ? (
                      <>
                        <p>Ecole <Link to={`/ecole/choix_direction/${ecole.id}`} target='_blank' rel='noopener noreferrer' style={{color:'#1769ff', fontWeight: 'bold'}}>{ecole.name}</Link> a été créé avec succès.</p>
                          <div className="photo-container w-100 mb-2 mt-2">
                                <img
                                  src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`}
                                  alt={`${ecole.name}`}
                                  className=""
                                  style={{
                                    objectFit: 'cover',
                                    border: '3px dashed #1769ff'
                                  }}
                                />
                          </div>

                        <Link to={`/admin-general/creer_super_admin_ecole/${id_ecole}`} className="btn btn-white" style={{background: '#1769ff', borderRadius: '5px', color: '#fff'}}>Créer super admin pour {ecole.name}</Link>
                      </>
                    ) : (
                      <p>Chargement des informations...</p>
                    )}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
  );
  
};

export default PostCreationEcole;
