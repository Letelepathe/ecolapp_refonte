import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
const AjouterMotif = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [devises, setDevises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    montant: '',
    devise_id: '',
    ecole_id: ecole_id,
    direction: direction
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDevises = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/devise/direction/3');
        setDevises(response.data.deviseAll);
      } catch {
        console.log("Erreur lors de la récupération des devises");
      }
    };
    fetchDevises();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Le motif est requis";
    if (!formData.montant) newErrors.montant = "Montant requis";
    if (!formData.devise_id) newErrors.devise_id = "Devise requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/motif/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Motif ajouté avec succès !");
        setErrors({});
        setFormData({ name: '', montant: '', devise_id: '', ecole_id: ecole_id, direction: direction });

      } else {
        setErrorMessage(response.data.erroList);
        console.log(response.data);
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur.");
    } finally {
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
                  <div className='justify-content-between align-items-center d-flex'>
                   <h6 className="text-center u-style-951c0e5f">Ajouter Motif de Paiement</h6>
                   <Link to='/maternelle/liste_motif' className='btn btn-warning text-white'>Liste motifs</Link>
                  </div>
                  
                  <p className="text-center">Veuillez remplir le motif de paiement ci-dessous.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="motif">Motif</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required />
                      
                      {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="motif">Montant</label>
                      <input
                        type="number"
                        name="montant"
                        className="form-control"
                        value={formData.montant}
                        onChange={handleInputChange}
                        required />
                      
                      {errors.montant && <p className="text-danger">{errors.montant}</p>}
                    </div>

                    <div className="mb-3">
                      <label>Devise</label>
                      <select
                        name="devise_id"
                        className="form-control"
                        value={formData.devises_id}
                        onChange={handleInputChange}>
                        
                        <option value="">Sélectionner une devise</option>
                          {devises.map((devise) =>
                        <option key={devise.id} value={devise.id}>
                                {devise.name} 
                              </option>
                        )}
                      </select>
                          {errors.devise_id && <p className="text-danger">{errors.devise_id}</p>}
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-primary u-style-2167c5af" disabled={isSubmitting} type="submit">
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
    </div>);

};

export default AjouterMotif;
