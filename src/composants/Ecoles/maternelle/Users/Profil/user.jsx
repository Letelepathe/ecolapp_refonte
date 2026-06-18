import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilUser = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setErrorMessage('Erreur lors de la récupération des données utilisateur.');
        }
      } catch (error) {
        setErrorMessage("Impossible de récupérer les informations de l'utilisateur.");
      }
    };

    fetchUserProfile();
  }, []);

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  if (!user) {
    return <div>Chargement des données utilisateur...</div>;
  }

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-body">
          <h3 className="card-title text-center">Profil Utilisateur</h3>
          <div className="text-center">
            {user.file ? (
              <img
                src={`http://localhost:8000/imgUser/${user.file}`}
                alt=""
                className="rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                   style={{ width: '150px', height: '150px', color: '#fff' }}>
                Pas d'image
              </div>
            )}
          </div>
          <div className="mt-4">
            <p><strong>Nom:</strong> {user.name}</p>
            <p><strong>Postnom:</strong> {user.last_name}</p>
            <p><strong>Prénom:</strong> {user.first_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Adresse:</strong> {user.address}</p>
            <p><strong>Téléphone:</strong> {user.phone}</p>
            <p><strong>Fonction:</strong> {user.fonction_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilUser;
