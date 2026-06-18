import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { Helmet } from "react-helmet";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";


import Statistique from "./Statistique";



const BureauAdminGeneral = () =>{

    const ecole_id = localStorage.getItem('ecole_id');
    const direction = localStorage.getItem('direction');
   
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const id = localStorage.getItem("userId");
    
    const [counts, setCounts] = useState({
        nombre_admins_generaux: 0,
        nombre_provinces: 0,
        nombre_provinces_educationnelles: 0,
        nombre_ecoles: 0
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
                        navigate('/admin-general/profil_admin');
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
                navigate('/admin-general/login');
            }
      };
    
        fetchUserInfo();
        checkSession();
    }, [id, navigate]); 
    

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/user/countAdminGeneral/ecole/${ecole_id}/direction/${direction}`);
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
                <title>Administration générale</title>
               
            </Helmet>
            <div className="container-fluid position-relative bg-white d-flex p-0">
                <SidebarLeft />
        
                <div className="content">
                    <NavbarTop />
                    
                    <div className="container-fluid pt-4 px-4">
                        <div className="row g-4">
                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="/admin-general/liste_admins_generaux">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                        <i className="bi bi-person-circle fa-3x text-primary"></i>
                                        <div className="ms-3">
                                            <p className="mb-2">Admins</p>
                                            <h6 className="mb-0">{counts.nombre_admins_generaux}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="/admin-general/liste_province">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                        <i className="bi bi-map-fill fa-3x text-primary"></i> {/* Icone pour Provinces */}
                                        <div className="ms-3">
                                            <p className="mb-2">Provinces</p>
                                            <h6 className="mb-0">{counts.nombre_provinces}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="/admin-general/liste_province_educationnelle">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                        <i className="bi bi-flag-fill fa-3x text-primary"></i> {/* Icone pour Provinces éducationnelles */}
                                        <div className="ms-3">
                                            <p className="mb-2">Provinces éducationnelles</p>
                                            <h6 className="mb-0">{counts.nombre_provinces_educationnelles}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                                <Link to="/admin-general/liste_ecole">
                                    <div className="rounded d-flex align-items-center justify-content-between p-4 shadow-lg rounded" style={{color: '#1769ff', borderRadius: '15px'}}>
                                        <i className="bi bi-house-door-fill fa-3x text-primary"></i> {/* Icone pour Ecoles */}
                                        <div className="ms-3">
                                            <p className="mb-2">Ecoles</p>
                                            <h6 className="mb-0">{counts.nombre_ecoles}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 mb-2 container">
                      <Statistique/>
                    </div>
                  
                    <Footer />
                </div> 
            </div>
        </div>
    );
}
export default BureauAdminGeneral;