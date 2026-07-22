import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const UserInfo = () => {
  const { id } = useParams();
  const [user, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        console.log(response.data);

        if (response.status === 200) {
          setUserInfo(response.data);
        } else {
          setError(response.data.status_msg);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des informations de l'utilisateur.");
      }
    };


    fetchUser();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
            <div className="profile">
                <div className="profile-cover">
                    
                </div>
                <div className="profile-details">
                    <div className="profile-image">
                        <img src={`https://api.ecolapp.cd/public/imgUser/${user.file}`} alt="Profil" className="u-style-2f8d99ec" />
                       
                    </div>
                    <div className="profile-details-info">
                        <h2 className="u-style-1b959d56">{user.first_name} {user.name}</h2>
                      
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                

                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="apropos" role="tabpanel" aria-labelledby="pills-home-tab">
                        <div className="row">
                            <div className="col-sm-3"><h6 className="mb-0">Nom</h6></div>
                            <div className="col-sm-9"><p className="text-muted mb-0">{user.name}</p></div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3"><h6 className="mb-0">Postnom</h6></div>
                            <div className="col-sm-9"><p className="text-muted mb-0">{user.last_name}</p></div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3"><h6 className="mb-0">Prénom</h6></div>
                            <div className="col-sm-9"><p className="text-muted mb-0">{user.first_name}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3"><h6 className="mb-0">Sexe</h6></div>
                            <div className="col-sm-9"><p className="text-muted mb-0">{user.sexe}</p></div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3"><h6 className="mb-0">E-mail</h6></div>
                            <div className="col-sm-9"><p className="text-muted mb-0"><a href={`mailto:${user.email}`}>{user.email}</a></p></div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3"><h6 className="mb-0">Téléphone</h6></div>
                            <div className="col-sm-9"><p className="text-muted mb-0">{user.phone}</p></div>
                        </div>
                       
                        <div className="row">
                            <div className="col-sm-3"><h6 className="mb-0">Adresse</h6></div>
                            <div className="col-sm-9"><p className="text-muted mb-0">{user.address}</p></div>
                        </div>
                        <hr />
                        
                        <hr />
                        
                    </div>

                   
                </div>
            </div>
        </div>);

};

export default UserInfo;
