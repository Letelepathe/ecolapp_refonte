import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { Helmet } from "react-helmet";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import Infos from './Infos';

import Admins from "../Users/Profil/Admins";
import ListeAbonne from './ListeAbonne';

import Statistique from "./Statistique";



const BureauAdminsecondaire = () =>{
    const ecole_id = localStorage.getItem('ecole_id');
    const direction = localStorage.getItem('direction');

  
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const id = localStorage.getItem("userId");
    
    const [counts, setCounts] = useState({
        nombre_utilisateurs: 0,
        nombre_enseignants: 0,
        nombre_eleves: 0,
        nombre_communiques: 0
    });

     
    

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/user/${id}`);
                if (response.data.status === 200) {
                    setUser(response.data.user);
    
                    // Vérifie la fonction et le rôle après la mise à jour de l'état
                    const allowedFunctions = [
                        "Administrateur",
                        "Administratrice",
                        "Super Administrateur",
                        "Super Administratrice"
                    ];
    
                    if (
                        !allowedFunctions.includes(response.data.user.fonction?.name) &&
                        !allowedFunctions.includes(response.data.user.role)
                    ) {
                        navigate('/secondaire/profil_user');
                    }
                } else {
                    console.error("Statut inattendu :", response.data.status);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
            }
        };

        const checkSession = () => {
            const id = localStorage.getItem("userId");
            if (!id) {
                navigate('/secondaire/login');
            }
      };
    
        fetchUserInfo();
        checkSession();
    }, [id, navigate]); 
    

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/user/countAdmin/ecole/${ecole_id}/direction/${direction}`);
                setCounts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };
        fetchCounts();
    }, [ecole_id, direction])

    

    if (!user) return <div className="spinner"></div>;

    return(
        <div>
            <Helmet>
                <title>secondaire | Admin</title>
            </Helmet>
            <div className="container-fluid position-relative bg-white d-flex p-0">
                <SidebarLeft />
        
                <div className="content">
                    <NavbarTop />
                    
                    <div className="container-fluid pt-4 px-4">
                        <div className="row g-4">
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="#">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                        <i className="bi bi-person-circle fa-3x text-primary"></i>
                                        <div className="ms-3">
                                            <p className="mb-2">Utilisateurs</p>
                                            <h6 className="mb-0">{counts.nombre_utilisateurs}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                           
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="#">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                        <i className="bi bi-people-fill fa-3x text-primary"></i>
                                        <div className="ms-3">
                                            <p className="mb-2">Enseignants</p>
                                            <h6 className="mb-0">{counts.nombre_enseignants}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="#">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                        <i className="bi bi-person-fill fa-3x text-primary"></i>
                                        <div className="ms-3">
                                            <p className="mb-2">Elèves</p>
                                            <h6 className="mb-0">{counts.nombre_eleves}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                           
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="#">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                       <i className="bi bi-chat fa-3x text-primary"></i>
                                        <div className="ms-3">
                                            <p className="mb-2">Communiqués</p>
                                            <h6 className="mb-0">{counts.nombre_communiques}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mb-2 container">
                      <Statistique/>
                    </div>
                   

                    <Infos />
                    <div className="container mt-3">
                        
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <div className="bg-white shadow rounded d-flex align-items-center justify-content-between p-4">
                                <Admins />
                                </div>
                            </div>
                           
                            <div className="col-lg-6 col-12">
                                <div className="bg-white shadow rounded d-flex align-items-center justify-content-between p-4">
                                <ListeAbonne />
                                </div>
                            </div>
                        </div>
                        
                       
                    </div>
                   
                    <Footer />
                </div> 
            </div>
        </div>
    );
}
export default BureauAdminsecondaire;