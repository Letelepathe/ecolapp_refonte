import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';

import Logo_ecolapp from "../../static/images/logo_ecolapp.jpg";

import './Sidebar.css';

 
const SidebarLeft = () => {

    
        const [openMenus, setOpenMenus] = useState({});
        
          const toggleMenu = (menu) => {
            setOpenMenus((prevState) => ({
              ...prevState,
              [menu]: !prevState[menu],
            }));
          };
        

    const [user, setUser] = useState(null);
    const id = localStorage.getItem("userId");
    const navigate = useNavigate();
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
                        navigate('/admin-general/login');
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
                navigate('/adminGeneral/login');
            }
      };
    
        fetchUserInfo();
        checkSession();
    }, [id, navigate]); 

    if (!user) return <div className="spinner"></div>;
    
    return (
        <div>
            <div className="sidebar pe-0 pb-0" style={{background: '#fff'}}>
                <nav className="navbar navbar-white" style={{background: '#fff'}}>
                    <Link to="#" className="navbar-brand mx-4 mb-3">
                        <h3 className="" style={{ fontWeight: 900, color:'#1769ff' }}>
                            <i className="bi bi-mortarboard-fill me-2"></i>ecolapp
                        </h3>
                    </Link>
                    <div className="d-flex align-items-center ms-4 mb-4 w-100">
                        <div className="position-relative">
                            <Link to='/admin-general/bureau_admin'>
                                <img 
                                    src={Logo_ecolapp} 
                                    alt="Profil" 
                                    className="rounded-circle me-lg-2" 
                                    style={{ width: '40px', height: '40px' }} 
                                />
                                <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                            </Link>
                        </div>
                        <Link to='/admin-general/bureau_admin'>
                            <div className="ms-3">
                                <h6 className="mb-0">Administration</h6>
                                <span id="status"></span>
                            </div>
                        </Link> 
                    </div>
                    <div className="navbar-nav w-100">
                        {user && (["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.fonction.name) || ["Administrateur", "Administratrice", "Super Administrateur", "Super Administratrice"].includes(user.role)) && (
                            <div className="menu">
                                <div className="menu-header text-primary" onClick={() => toggleMenu('menu1')}>
                                    <i className="bi bi-wallet-fill text-primary me-2 icon-blue"></i>Gestion Admin
                                    <span className={`arrow ${openMenus['menu1'] ? 'open' : ''}`}>▼</span>
                                </div>
                                <div className={`dropdown-content ${openMenus['menu1'] ? 'open' : ''}`}>
                                   <Link to="/admin-general/creer_admin_general" className="dropdown-item text-primary">
                                        <i className="bi bi-list-check me-2 icon-blue"></i>Créer admin
                                    </Link>
                                    <Link to="/admin-general/creer_super_admin_general" className="dropdown-item text-primary">
                                        <i className="bi bi-list-check me-2 icon-blue"></i>Créer super admin
                                    </Link>
                                    <Link to="/admin-general/suspendre_admin" className="dropdown-item text-primary">
                                        <i className="bi bi-list-check me-2 icon-blue"></i>Suspendre admin
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                          <div className="menu">
                            <div className="menu-header text-primary" onClick={() => toggleMenu('menu2')}>
                              <i className="bi bi-person-badge-fill text-primary me-2 icon-blue"></i>Provinces
                              <span className={`arrow ${openMenus['menu2'] ? 'open' : ''}`}>▼</span>
                            </div>
                            <div className={`dropdown-content ${openMenus['menu2'] ? 'open' : ''}`}>
                               <Link to="/admin-general/ajouter_province" className="dropdown-item text-primary">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter province
                                </Link>
                                <Link to="/admin-general/liste_province" className="dropdown-item text-primary">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Liste provinces
                                </Link>
                            </div>
                          </div>
                     
                          <div className="menu">
                            <div className="menu-header text-primary" onClick={() => toggleMenu('menu3')}>
                              <i className="bi bi-person-fill text-primary me-2 icon-blue"></i>Provinces éducat.
                              <span className={`arrow ${openMenus['menu3'] ? 'open' : ''}`}>▼</span>
                            </div>
                            <div className={`dropdown-content ${openMenus['menu3'] ? 'open' : ''}`}>
                               <Link to="/admin-general/ajouter_province_educationnelle" className="dropdown-item text-primary">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter province
                                </Link>
                                <Link to="/admin-general/liste_province_educationnelle" className="dropdown-item text-primary">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Liste provinces
                                </Link>
                            </div>
                          </div>
                     
                          <div className="menu">
                            <div className="menu-header text-primary" onClick={() => toggleMenu('menu4')}>
                              <i className="bi bi-eject-fill me-2 text-primary icon-blue"></i>Ecoles
                              <span className={`arrow ${openMenus['menu4'] ? 'open' : ''}`}>▼</span>
                            </div>
                            <div className={`dropdown-content ${openMenus['menu4'] ? 'open' : ''}`}>
                                <Link to="/admin-general/ajouter_ecole" className="dropdown-item text-primary">
                                    <i className="bi bi-plus-circle-fill me-2 icon-blue"></i>Ajouter école
                                </Link>
                                <Link to="/admin-general/liste_ecole" className="dropdown-item text-primary">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Liste écoles
                                </Link>
                                <Link to="/admin-general/creer_super_ecole" className="dropdown-item text-primary">
                                    <i className="bi bi-list-check me-2 icon-blue"></i>Créer super admin école
                                </Link>                                                        
                            </div>
                          </div>
                     
                    </div>
                   
                </nav>
            </div>
        </div>
   
);
}; 


export default SidebarLeft;
