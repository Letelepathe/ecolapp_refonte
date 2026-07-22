import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

const PreConnexionParent = () => {
  const [parent, setParent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchParentInfo = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/parents/${id}`);
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
  }, [id]);

  if (!parent) {
    return (
      <div className="spinner"></div>);

  }

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100 d-flex">
          <div className="col-lg-8">
            <div className="card ">
              <div className="card-body text-center">
                <div className="profile-block">
                  <img
                    src={`https://api.ecolapp.cd/public/imgParent/${parent.photo}`}
                    alt={`${parent.prenom}`}
                    className="profile-img rounded-circle u-style-b2414eff" />






                  
                </div>
                <div className="pt-4 pb-2">
                  <h5 className="text-center text-primary fw-bold u-style-630faec2">ecolapp</h5>
                </div>

                <p className="text-center text-primary fw-bold u-style-4ef9d2a6">
                  Bienvenue, {parent.prenom} {parent.nom} !
                </p>
                <div
                  className="code-container rounded p-3 my-4 u-style-73309d34">



                  
                  <p className="text-warning fw-bold u-style-7f09016c">
                    🔑 Votre Code : <span className="u-style-264028a9">{parent.code}</span>
                  </p>
                  <p className="text-muted fst-italic">
                    Veuillez noter ce code. Vous en aurez besoin pour vous connecter.
                  </p>
                </div>
                <p className="text-muted">Votre compte a été créé avec succès. Nous sommes ravis de vous avoir parmi nous !</p>
                <Link
                  to="/parent/login"
                  className="btn  rounded-pill px-4 py-2">
                  
                  Connectez-vous ici
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>);

};

export default PreConnexionParent;
