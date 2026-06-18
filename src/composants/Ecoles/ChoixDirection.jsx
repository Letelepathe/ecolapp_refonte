import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
const ChoixDirection = () => {

  const [ecole, setEcole] = useState(null);
  const { id_ecole, ecole_name } = useParams();

  useEffect(() => {
    const fetchInfoEcole = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/ecole/ecole_id/${id_ecole}`);
        setEcole(response.data.ecole);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations:", error);
      }
    };

    fetchInfoEcole();
  }, [id_ecole]);

  if (!ecole) {
    return (
      <div className="spinner"></div>);

  }
  // Stocker id de l''ecole dans le localStorage
  localStorage.setItem('ecole_id', id_ecole);

  return (
    <div className="u-style-4c53c2ce">
           <section className="bg-light">
             
             <div className="container">
               <div className="row gy-4 u-style-63b79a97">
                  <h2 className="u-style-3959a91c">
                   {ecole.name}
                  </h2>
                  <div className="justify-content-center text-center align-items-center">
                    <img
                src={`https://api.ecolapp.cd/public/Ecoles/${ecole.photo_profil}`}
                alt="ecolapp"
                className="img-fluid-1 img_index" />
              
                  </div>
                 {/* Maternelle */}
                 <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
                   <div className="feature-box blue" style={cardStyle}>
                     <div className="icon flex-shrink-0" style={iconStyle}>
                       <i className="bi bi-eject icon"></i>
                     </div>
                     <h4 className="title">Maternelle</h4>
                    
                     <Link to={`/maternelle?${ecole_name}`} className="btn" style={btnStyle}>
                       Explorer
                     </Link>
                   </div>
                 </div>
     
                 {/* Primaire */}
                 <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
                   <div className="feature-box blue" style={cardStyle}>
                     <div className="icon flex-shrink-0" style={iconStyle}>
                       <i className="bi bi-eject icon"></i>
                     </div>
                     <h4 className="title">Primaire</h4>
                     
                     <Link to={`/primaire?${ecole_name}`} className="btn" style={btnStyle}>
                       Explorer
                     </Link>
                   </div>
                 </div>
     
                 {/* Secondaire */}
                 <div className="col-xl-4 col-lg-4 col-md-6 d-flex justify-content-center text-center align-items-center">
                   <div className="feature-box blue" style={cardStyle}>
                     <div className="icon flex-shrink-0" style={iconStyle}>
                       <i className="bi bi-eject icon"></i>
                     </div>
                     <h4 className="title">Secondaire</h4>
                    
                     <Link to={`/secondaire?${ecole_name}`} className="btn" style={btnStyle}>
                       Explorer
                     </Link>
                   </div>
                 </div>
     
               </div>
             </div>
           </section>
         </div>);


};

const cardStyle = {
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  background: '#f8f9fa',
  width: '100%',
  maxWidth: '350px'
};

const iconStyle = {
  fontSize: '30px',
  color: '#1769ff',
  marginBottom: '10px'
};



const btnStyle = {
  padding: '12px',
  borderRadius: '30px',
  background: '#1769ff',
  color: '#fff',
  textDecoration: 'none',
  display: 'inline-block',
  width: '100%',
  marginTop: '10px'
};
export default ChoixDirection;
