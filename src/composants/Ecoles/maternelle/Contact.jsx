import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import Footer from './Footer';
import FormConctact from './FormContact';

function Contact() {

  const navigate = useNavigate();
  const ecole_id = localStorage.getItem('ecole_id');
  const [ecole, setEcole] = useState(null);

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
      
  return (
    <div>
        <Helmet>
            <title>Maternelle | Conctat</title>
        </Helmet>
        <div>
            <FormConctact ecole={ecole}/>
            <Footer ecole={ecole}/>
        </div>
    </div>
  )
}

export default Contact;