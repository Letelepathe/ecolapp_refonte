import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const NavbarTop = () => {
    const [user, setUser] = useState(null);
 
 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('https://api.ecolapp.cd/api/user', {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 
                    },
                });
                if (response.status === 200) {
                    setUser(response.data); 
                } else {
                    console.log(response.data); 
                }
            } catch (error) {
                console.log("Erreur lors de la récupération des informations.");
            }
        };

        
      
          
        fetchUser();
       
    }, []); 

    const toggleSidebar = (event) => {
        event.preventDefault();
        document.querySelector('.sidebar')?.classList.toggle('open');
        document.querySelector('.content')?.classList.toggle('open');
    };

    const toggleSidebarRight = (event) => {
        event.preventDefault();
        document.querySelector('.sidebar-right')?.classList.toggle('open-right');
        document.querySelector('.content')?.classList.toggle('open-right');
    };

    return user ? (
        <nav className="navbar my-navbar navbar-expand bg-white navbar-white px-4 py-0" style={{ position: 'sticky', top: 0, zIndex: 1020 }}>
            <Link to="#" className="sidebar-toggler flex-shrink-0" onClick={toggleSidebar}>
                <i className="fa fa-bars" style={{ color: '#1769ff' }}></i>
            </Link>
            <div className="d-block d-lg-none d-md-flex ms-4" style={{  borderRadius: '8px' }}>
                <Link to="#">
                    <h3 className="mt-1" style={{ fontWeight: 900, color: '#1769ff' }}>
                        ecolapp
                    </h3>
                </Link>
            </div>
            <div className="navbar-nav align-items-center ms-auto">
                

                <div className="nav-item dropdown">
                    <Link to="/secondaire/bureau_admin" className="nav-link">
                        <i className="bi bi-grid me-lg-2 shadow" style={{ background: '#fff', borderRadius: '50px', color: '#1769ff', fontSize: '23px' }}></i>
                        <span className="badge bg-warning badge-number"></span>
                    </Link>
                </div>

               {/* Icone de profil */}
               <div className="nav-item dropdown">
                    <Link to="/secondaire/profil_user" className="nav-link">
                        <i className="bi bi-person-circle me-lg-2 shadow" style={{ background: '#fff', borderRadius: '50px', color: '#1769ff', fontSize: '23px' }}></i>
                    </Link>
                </div>
               
                {/* Dropdown du profil utilisateur */}
                <div className="nav-item dropdown">
                    <Link to="#" className="nav-link" data-bs-toggle="dropdown">
                        <img 
                            src={`https://api.ecolapp.cd/public/imgUser/${user.file}`}
                            alt="Profil" 
                            className="rounded-circle me-lg-2" 
                            style={{ width: '40px', height: '40px', objectFit:'cover' }} 
                        />
                        <span className="d-none d-lg-inline-flex">{user.first_name}</span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                        <Link to={`/secondaire/mon_profil/${user.id}`} className="dropdown-item">
                            <i className="bi bi-person-circle text-primary"></i> Mon profil
                        </Link>
                        <Link to="/secondaire/deconnexion" className="dropdown-item">
                            <i className="bi bi-box-arrow-right text-warning"></i> Déconnexion
                        </Link>
                    </div>
                </div>
       
                <div className="nav-item dropdown d-none">
                    <Link to="#" className="nav-link sidebar-toggler-right" onClick={toggleSidebarRight}>
                        <i className="fa fa-bars" style={{ color: '#1769ff' }}></i>
                    </Link>
                </div>
            </div>
        </nav>
    ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <p className='spinner'></p>
        </div>
    );
};

export default NavbarTop;
