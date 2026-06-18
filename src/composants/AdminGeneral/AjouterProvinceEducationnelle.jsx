import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterProvinceEducationnelle = () => {
  const [formData, setFormData] = useState({
    name: '',
    province_id: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://api.ecolapp.cd/api/province");
        setProvinces(response.data.provinceAll || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des provinces", error);
      }
    };
    fetchProvinces();
  }, []);

  // Gestion des changements dans les inputs
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom de la province éducationnelle est requis.";
    if (!formData.province_id) newErrors.province_id = "La province est requise.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
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
      const response = await axios.post('https://api.ecolapp.cd/api/province-educationnelle/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Province éducationnelle ajoutée avec succès !");
        setErrors({});
        setFormData({ name: '', province_id: '' });
      } else {
        setErrorMessage(response.data.status_msg || "Une erreur est survenue.");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errorsList || {});
        setErrorMessage("Erreur de validation des données.");
      } else {
        setErrorMessage("Erreur de connexion au serveur.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <main className="content">
        <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className='container d-flex align-items-center justify-content-between py-2'>
                  <h6 className="text-center u-style-951c0e5f">Ajouter Province Éducationnelle</h6>
                  <Link to='/admin-general/liste_province_educationnelle' className='btn btn-warning text-white'>Liste Provinces Éducationnelles</Link>
                </div>
                <div className="card-body">
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name">Nom de la Province Éducationnelle</label>
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
                      <label htmlFor="province_id">Province</label>
                      <select
                        name="province_id"
                        className="form-control"
                        value={formData.province_id}
                        onChange={handleInputChange}
                        required>
                        
                        <option value="">Sélectionner une province</option>
                        {provinces.map((province) =>
                        <option key={province.id} value={province.id}>{province.name}</option>
                        )}
                      </select>
                      {errors.province_id && <p className="text-danger">{errors.province_id}</p>}
                    </div>

                    <div className="d-grid">
                      <button className="btn btn-primary" disabled={isSubmitting} type="submit">
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
      </main>
    </div>);

};

export default AjouterProvinceEducationnelle;
