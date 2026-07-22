import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterCours = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [formData, setFormData] = useState({
    name: '',
    ponderation: '',
    classes_id: '',
    options_id: '',
    ecole_id: ecole_id,
    direction: direction
  });

  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`);
        setClasses(response.data.classesAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes", error);
      }
    };

    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
        setOptions(response.data.optionAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des options", error);
      }
    };

    fetchClasses();
    fetchOptions();
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
    if (!formData.name) newErrors.name = "Intitulé requis";
    if (!formData.ponderation) newErrors.ponderation = "Pondération requise";
    if (!formData.classes_id) newErrors.classes_id = "Classe requise";
    if (!formData.options_id) newErrors.options_id = "Option requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await axios.post('https://api.ecolapp.cd/api/cours/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Cours ajouté avec succès !");
        setErrors({});
        setFormData({
          name: '',
          ponderation: '',
          classes_id: '',
          options_id: '',
          ecole_id: ecole_id,
          direction: direction
        });
      } else {
        setErrors({ form: "Une erreur s'est produite" });
      }
    } catch (error) {
      setErrors({ form: "Erreur de connexion au serveur" });
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
                  <Link to='/secondaire/liste_cours' className='btn  mt-2 mb-2'>Liste cours</Link>
                  <h3 className="text-center u-style-951c0e5f">Ajouter Cours</h3>
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="name">Intitulé</label>
                      <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                      {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="ponderation">Pondération</label>
                      <input type="number" name="ponderation" className="form-control" value={formData.ponderation} onChange={handleInputChange} required />
                      {errors.ponderation && <p className="text-danger">{errors.ponderation}</p>}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="classes_id">Classe</label>
                      <select name="classes_id" className="form-control" value={formData.classes_id} onChange={handleInputChange} required>
                        <option value="">Sélectionner une classe</option>
                        {classes.map((classe) =>
                        <option key={classe.id} value={classe.id}>{classe.name}</option>
                        )}
                      </select>
                      {errors.classes_id && <p className="text-danger">{errors.classes_id}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="options_id">Option</label>
                      <select name="options_id" className="form-control" value={formData.options_id} onChange={handleInputChange} required>
                        <option value="">Sélectionner une option</option>
                        {options.map((option) =>
                        <option key={option.id} value={option.id}>{option.name}</option>
                        )}
                      </select>
                      {errors.options_id && <p className="text-danger">{errors.options_id}</p>}
                    </div>
                    <div className="d-grid">
                      <button className="btn " disabled={isSubmitting} type="submit">
                      {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
                      </button>
                    </div>
                    {successMessage && <p className="text-success text-center mt-2">{successMessage}</p>}
                    {errors.form && <p className="text-danger text-center mt-2">{errors.form}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);

};

export default AjouterCours;
