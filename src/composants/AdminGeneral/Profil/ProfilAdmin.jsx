import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProfilAdmin.css';

const ProfilAdmin = () => {
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

    if(!user){
        return(
        <div className='spinner'></div>
    );
    }
    return(
        <div>
            <div className="bloc-profil-admin">
                <div className="profile-container">
            
                    <div className="profile-block">
                        <img src={`https://api.ecolapp.cd/public/imgUser/${user.file}`} alt={`${user.name}`} className="profile-img"/>
                        <div className="text-center" style={{ color: '#1769ff', fontWeight: 'bold', fontSize: '20px' }}>
                            {user.first_name} {user.name} 
                        </div>
                    </div>

         
                    <div className="profile-block text-start">
                        <div className="info-item"><i className="bi bi-envelope"></i> <strong>Email:</strong> <Link to={`mailto:${user.email}`}>{user.email}</Link> </div>
                        <div className="info-item"><i className="bi bi-phone"></i> <strong>Téléphone:</strong> <Link to={`tel:${user.phone}`}>{user.phone}</Link> </div>
                        <div className="info-item"><i className="bi bi-map"></i> <strong>Adresse:</strong> {user.address} </div>
                        <div className="info-item"><i className="bi bi-shield-lock"></i> <strong>Rôle:</strong> {user.role} </div>
                    </div>

                    <div className="profile-block btn-block">
                        <Link to="/admin-general/bureau_admin" className="btn btn-primary btn-custom"><i className="bi bi-house-door"></i> Accéder au Bureau Admin</Link>
                        <Link to="/admin-general/deconnexion" className="btn btn-danger btn-custom"><i className="bi bi-box-arrow-right"></i> Déconnexion</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProfilAdmin;