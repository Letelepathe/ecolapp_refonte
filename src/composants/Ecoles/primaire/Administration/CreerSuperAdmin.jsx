import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const CreerSuperAdmin = () => {
  const [id_user, setIdUser] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    setIsSubmitting(true);

    try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/creerSuperAdmin/${id_user}`);
        
        if (response.data.success) {
            setErrorMessage(response.data.message); 
        } else {
            setErrorMessage(response.data.message); 
            setIdUser('');
            console.log(response.data);
        }
    } catch (error) {
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer plus tard.");
        setIdUser(''); 
    }finally {
      setIsSubmitting(false); 
    }
  };


  return (
    <div className="code-admin-container">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div style={{ marginTop: '150px' }} className="col-lg-6 text-center">
            <h2 className="mb-4" style={{color: '#1769ff'}}>Création Admin</h2><hr/>
            <form onSubmit={handleSubmit} className="code-form mt-4 p-4">
              <input
                type="text"
                name="id_user"
                className="form-control mb-3 code-input"
                placeholder="Saisir l'identifiant de l'utilisateur"
                value={id_user}
                onChange={(e) => setIdUser(e.target.value)}
              />
              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 submit-button">
               {isSubmitting ? 'Traitement en cours...' : 'Créer Admin'}
              </button> 
              {errorMessage && 
                <p className="text-danger mt-3">
                    {errorMessage} <br />
                <Link to='/primaire/bureau_admin' className='btn btn-primary'>Retour</Link>
                </p>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreerSuperAdmin;
