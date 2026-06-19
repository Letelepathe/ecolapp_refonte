import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";
const AjouterOption = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [formData, setFormData] = useState({
    name: '',
    section_id: '',
    ecole_id: ecole_id,
    direction: direction
  });
  const [sections, setSections] = useState([]); // Liste des sections
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/section/ecole/${ecole_id}/direction/${direction}`);
        setSections(response.data.sectionsAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des sections:", error);
        setErrorMessage("Erreur lors de la récupération des sections.");
      }
    };

    fetchSections();
  }, [ecole_id, direction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Le nom de l'option est requis";
    if (!formData.section_id) newErrors.section_id = "La section est requise";
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
      const response = await axios.post('https://api.ecolapp.cd/api/option/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Option ajoutée avec succès !");
        setErrors({});
        setFormData({ name: '', section_id: '', ecole_id: ecole_id, direction: direction });

      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
    <SidebarLeft />
     <div className="content">
     <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <div className='d-flex align-items-center justify-content-between'>
                   <Link to='/secondaire/liste_option' className="btn  text-white">Liste option</Link>
                   <h6 className="text-center u-style-951c0e5f">Ajouter Option</h6>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="option">Nom de l'option</label>
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
                      <label htmlFor="sectionId">Section</label>
                      <select
                        name="section_id"
                        className="form-control"
                        value={formData.section_id}
                        onChange={handleInputChange}
                        required>
                        
                        <option value="">Sélectionner une section</option>
                        {sections.map((section) =>
                        <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        )}
                      </select>
                      {errors.sectionId && <p className="text-danger">{errors.section_id}</p>}
                    </div>

                    <div className="d-grid">
                      <button className="btn  u-style-2167c5af" disabled={isSubmitting} type="submit">
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

export default AjouterOption;
