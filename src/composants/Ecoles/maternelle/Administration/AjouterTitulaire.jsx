import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterTitulaire = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [formData, setFormData] = useState({
    id_us: '',
    id_classe: '',
    id_option: '',
    ecole_id: ecole_id,
    direction: direction
  });

  const [enseignants, setEnseignants] = useState([]);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const enseignantsResponse = await axios.get(`https://api.ecolapp.cd/api/user/all/ecole/${ecole_id}/direction/${direction}`);
        setEnseignants(enseignantsResponse.data.enseignants);
        console.log(enseignantsResponse.data.enseignants);
      } catch (error) {
        setError("Erreur lors de la récupération des données. Vérifiez votre connexion au serveur.");
        console.error(error);
      }
    };

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
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des options:", error);
      }
    };

    fetchOptions();
    fetchClasses();
    fetchEnseignants();
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
    if (!formData.id_us) newErrors.id_us = "Veuillez sélectionner un enseignant.";
    if (!formData.id_classe) newErrors.id_classe = "Veuillez sélectionner une classe.";
    if (!formData.id_option) newErrors.id_option = "Veuillez sélectionner une option.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('https://api.ecolapp.cd/api/titulaire/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage(response.data.status_msg || "Titulaire ajouté avec succès !");
        setFormData({ id_us: '', id_classe: '', id_option: '', ecole_id: ecole_id, direction: direction });

      } else {
        setErrors({ form: response.data.error_msg || "Erreur inconnue." });
      }
    } catch (error) {
      setErrors({ form: "Erreur de connexion au serveur." });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className='content'>
        <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <div className='d-flex align-items-center justify-content-between'>
                   <Link to='/maternelle/liste_titulaire' className='btn btn-primary mt-2 mb-2'>Liste titulaires</Link>
                   <h6 className="text-center u-style-951c0e5f">Ajouter Titulaire</h6>
                  </div>
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>

                  <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="enseignant">Enseignants</label>
                      {error ?
                      <p className="text-danger">{error}</p> :

                      <select name="id_us" className="form-control"
                      value={formData.id_us} onChange={handleInputChange} required>
                          <option value="">Sélectionner un enseignant</option>
                          {enseignants.map((enseignant) =>
                        <option key={enseignant.id} value={enseignant.id}>
                              {enseignant.first_name} {enseignant.name}
                            </option>
                        )}
                        </select>
                      }
                      {errors.id_us && <p className="text-danger">{errors.id_us}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="id_classe">Classe</label>
                      <select name="id_classe" className="form-control" value={formData.id_classe} onChange={handleInputChange} required>
                        <option value="">Sélectionner une classe</option>
                        {classes.map((classe) =>
                        <option key={classe.id} value={classe.id}>{classe.name}</option>
                        )}
                      </select>
                      {errors.id_classe && <p className="text-danger">{errors.id_classe}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="id_option">Option</label>
                        <select name="id_option" className="form-control"
                      value={formData.id_option} onChange={handleInputChange} required>
                          <option value="">Sélectionner une option</option>
                          {options.map((option) =>
                        <option key={option.id} value={option.id}>{option.name}</option>
                        )}
                        </select>
                        {errors.id_option && <p className="text-danger">{errors.id_option}</p>}
                      </div>

                    <div className="d-grid">
                      <button className={`${`btn btn-primary w-100 ${isLoading ? "loading" : ""}`} style-fr-e5e80b65`} type="submit"
                      disabled={isLoading}>

                        
                          {isLoading ? "Traitement en cours..." : "Enregistrer"}
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

export default AjouterTitulaire;
