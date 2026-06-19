import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';
import { useUserStore } from '../../../store/useUserStore';

const NavbarTop = () => {
  const { user, setUser } = useUserStore();



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
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

  }, [setUser]);

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

  return user ?
  <nav className="navbar my-navbar navbar-expand  navbar-white px-4 py-0 u-style-9a9493a9">
            <Link to="#" className="sidebar-toggler flex-shrink-0" onClick={toggleSidebar}>
                <FaBars className="u-style-43ef163a" />
            </Link>
            <div className="d-block d-lg-none d-md-flex ms-4 u-style-76ed9a07">
                <Link to="#">
                    <h3 className="mt-1 u-style-951c0e5f">
                        ecolapp 
                    </h3>
                </Link>
            </div>
            <div className="navbar-nav align-items-center ms-auto">
                {/* Icone de profil */}
                <div className="nav-item dropdown">
                    <Link to="/primaire/profil_user" className="nav-link">
                        <i className="bi bi-person-circle me-lg-2  u-style-a408f68a"></i>
                    </Link>
                </div>

                <div className="nav-item dropdown">
                    <Link to="/primaire/forum" className="nav-link">
                        <i className="bi bi-chat-fill me-lg-2  u-style-a408f68a"></i>
                    </Link>
                </div>
               
               
                {/* Dropdown du profil utilisateur */}
                <div className="nav-item dropdown">
                    <Link to="#" className="nav-link" data-bs-toggle="dropdown">
                        <img
            src={`https://api.ecolapp.cd/public/imgUser/${user.file}`}
            alt="Profil"
            className="rounded-circle me-lg-2 u-style-582d54f9" />

          
                        <span className="d-none d-lg-inline-flex">{user.first_name}</span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                        <Link to={`/primaire/mon_profil/${user.id}`} className="dropdown-item">
                            <i className="bi bi-person-circle text-primary"></i> Mon profil
                        </Link>
                        <Link to="/primaire/deconnexion" className="dropdown-item">
                            <i className="bi bi-box-arrow-right text-warning"></i> Déconnexion
                        </Link>
                    </div>
                </div>
       
                <div className="nav-item dropdown d-none">
                    <Link to="#" className="nav-link sidebar-toggler-right" onClick={toggleSidebarRight}>
                        <FaBars className="u-style-43ef163a" />
                    </Link>
                </div>
            </div>
        </nav> :

  <div className="d-flex justify-content-center align-items-center u-style-2a120f7e">
            <p className="spinner"></p>
        </div>;

};

export default NavbarTop;
