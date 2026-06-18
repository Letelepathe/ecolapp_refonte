import React from "react";
import { useParams } from 'react-router-dom';

import { Helmet } from "react-helmet";



import SidebarLeft from "./SidebarLeft";

import NavbarTop from './NavbarTop';
import FooterUser from "./Footer";



import UserInfo from "./UserInfo";

const MonProfil = () => {
  const { userId } = useParams(); 
  console.log(userId);

  return (
    <div>
      <Helmet>
        <title>maternelle | Profil utilisateur</title>
        <meta name="description" content="Profil utilisateur." />
  
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
      </Helmet>

      <div className="container-fluid position-relative bg-white d-flex p-0">
  
        <SidebarLeft />
  
        <div className="content">
          <NavbarTop />
          <div className="section">
            

            <UserInfo />

          </div>
          <FooterUser />
        </div>
      </div>
    </div>
  );
};

export default MonProfil;
