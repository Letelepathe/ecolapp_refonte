import React, { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterModePaiement = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  const [formData, setFormData] = useState({
    name: '',
    ecole_id : ecole_id,
    direction : direction,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Le mode de paiement est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);
    
     if (!validateForm()){
      setIsSubmitting(false); 
      return;
    }

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/mode_paiement/create', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status === 200) {
        setSuccessMessage("Mode de paiement ajouté avec succès !");
        setErrors({});
        setFormData({ name: '', ecole_id : ecole_id, direction : direction });
        
      } else {
        setErrorMessage(response.data.erroList);
        console.log(response.data);
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur.");
    }finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
     <SidebarLeft />
      <div className="content">
      <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <div className='align-items-center justify-content-between d-flex'>
                   <Link to='/maternelle/liste_mode_paiement' className='btn btn-primary'>Liste mode paiement</Link>
                   <h6 className="text-center" style={{ fontWeight: 900, color: '#1769ff' }}>Ajouter Mode de paiement</h6>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="mode">Mode</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-primary" disabled={isSubmitting} type="submit" style={{ backgroundColor: '#1769ff', border: 'none', padding: '10px', borderRadius: '5px' }}>
                      {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
                      </button>
                    </div>

                    {successMessage && <p className="text-success text-center mt-2">{successMessage}</p>}
                    {errorMessage && <p className="text-danger text-center mt-2">{errorMessage}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AjouterModePaiement;
