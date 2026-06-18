import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterAnnee = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [annee, setAnnee] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeAnnee = (e) => {
    setAnnee(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    if (!annee) {
      setErrorMessage('L\'année scolaire est requise');
      setIsSubmitting(false);
      return;
    }



    try {
      const response = await axios.post('https://api.ecolapp.cd/api/annee/create',
      { name: annee, ecole_id: ecole_id, direction: direction },
      { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.status === 200) {
        setSuccessMessage('Année scolaire ajoutée avec succès!');
        setAnnee('');

      } else {
        setErrorMessage(response.data.message || 'Une erreur est survenue, veuillez réessayer');
      }
    } catch (error) {
      setErrorMessage('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="section d-flex flex-column align-items-center justify-content-center py-4">
          <div className="col-lg-6 col-md-8 col-12">
            <div className="card mb-3">
              <div className="card-body">
                <div className='justify-content-between align-items-center d-flex'>
                  <Link to='/maternelle/liste_annee_scolaire' className='btn btn-primary'>Liste années</Link>
                  <h6 className="text-center u-style-951c0e5f">
                    Ajouter année scolaire
                  </h6>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="annee">Année Scolaire</label>
                    <input
                        type="text"
                        className="form-control"
                        id="annee"
                        value={annee}
                        onChange={handleChangeAnnee}
                        placeholder="2023-2024" />
                      
                  </div>
                  
                  {errorMessage && <p className="text-danger">{errorMessage}</p>}
                  {successMessage && <p className="text-success">{successMessage}</p>}
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 mt-2 mb-2">
                  {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   </div>);

};

export default AjouterAnnee;
