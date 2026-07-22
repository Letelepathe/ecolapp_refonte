import React, { useEffect, useState } from "react";
import Helmet from 'react-helmet';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import HeroSection from './HeroSection';
import FormContact from './FormContact';

 
const Accueil = () => {
  const navigate = useNavigate();
  const [ecole, setEcole] = useState(null);
    const ecole_id = localStorage.getItem('ecole_id');
   
    useEffect(() => {
      const fetchInfoEcole = async () => {
        try {
          const response = await axios.get(`https://api.ecolapp.cd/api/ecole/ecole_id/${ecole_id}`);
          setEcole(response.data.ecole);
        } catch (error) {
          console.error("Erreur lors de la récupération des informations:", error);
        }
      };

      const checkEcoleId = () => {
        if (!ecole_id) {
           navigate('/ecoles');
        }
      };  
  
      checkEcoleId();
      fetchInfoEcole();
    }, [ecole_id, navigate]);
  
    if(!ecole){
      return (
          <div className="spinner"></div>
      );
    }

    localStorage.setItem('direction', 3);

  return (
    <div>
      <Helmet>
        <title>ecolapp | {ecole.name}</title>
      </Helmet>
      <main className="main">
        <Header />
        <HeroSection ecole={ecole}/>
        <FormContact ecole={ecole}/>
        
      </main>
   
      <Footer ecole={ecole}/>
    </div>
  )
}

export default Accueil;