import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
const PreConnexion = () => {
 
  const [user, setUser] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);
        console.log("Réponse de l'API :", response.data.user);
        setUser(response.data.user);

      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'élève:", error);
      }
    };

    fetchUserInfo();
  }, [id]);

  return (
        <main>
          <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100 d-flex">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body text-center">
                    
                    {user ? (
                      <>
                        <h1 className="text-primary text-center">Bienvenue, {user.last_name} {user.name} !</h1>
                        <p>Votre compte a été créé avec succès. Nous sommes ravis de vous avoir parmi nous !</p>
                        <Link to="/primaire/bureau_admin" className="btn ">Retour au bureau admin</Link>
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

export default PreConnexion;
