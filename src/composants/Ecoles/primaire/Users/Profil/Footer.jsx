import React from "react";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
const FooterUser = () => {
    const currentYear = new Date().getFullYear(); 
    const id = localStorage.getItem("userId");
    return(
        <div>
            <div class="container-fluid pt-4 px-4">
                <div class="bg-white shadow py-3 rounded-top p-4">
                    <div class="row">
                        <div class="col-12 col-sm-6 text-center text-sm-start">
                            &copy; <a href="https://www.ecolapp.com" target="_blank"rel="noopener noreferrer">ecolapp</a>, Tous droits réservés. <br/>
                        </div>
                        <div class="col-12 col-sm-6 text-center text-sm-end">
                            &copy;   <span class="small">{currentYear}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="navbarbot">
                        <div className="ico">
                            <Link to="/primaire/profil_user">
                            <i className="bi bi-house-door-fill"></i> 
                            <div className="icon-title">Accueil</div> 
                            </Link>
                        </div>
            
                        <div className="ico">
                            <Link to="/primaire/communiques">
                            <i className="bi bi-chat-text"></i> 
                            <div className="icon-title">Communiqués</div> 
                            </Link>
                        </div>
                        <div className="ico">
                            <Link to={`/primaire/mon_profil/${id}`}>
                            <i className="bi bi-person-circle"></i> 
                            <div className="icon-title">Mon profil</div>
                            </Link>
                        </div>
                        <div className="ico">
                            <Link to="/primaire/deconnexion">
                            <i className="bi bi-box-arrow-right"></i> 
                            <div className="icon-title">Déconnexion</div>
                            </Link>
                        </div>
                    </div>
            
            
        </div>
    );
}
export default FooterUser;