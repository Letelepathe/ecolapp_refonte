import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterCoursEnseigne = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [formData, setFormData] = useState({
    users_id: '',
    cours_id: '',
    ecole_id: ecole_id,
    direction: direction
  });

  const [enseignants, setEnseignants] = useState([]);
  const [error, setError] = useState('');
  const [cours, setCours] = useState([]);
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

    const fetchCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cours/ecole/${ecole_id}/direction/${direction}`);
        setCours(response.data.coursAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes", error);
      }
    };

    fetchCours();
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
    if (!formData.users_id) newErrors.users_id = "Veuillez sélectionner un enseignant.";
    if (!formData.cours_id) newErrors.cours_id = "Veuillez sélectionner un cours.";
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
      const response = await axios.post('https://api.ecolapp.cd/api/coursens/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage(response.data.status_msg || "Cours ajouté avec succès !");
        setFormData({ users_id: '', cours_id: '', ecole_id: ecole_id, direction: direction });

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
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
      <div className='content'>
        <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  
                  <div className='d-flex align-items-center justify-content-between'>
                   <h6 className="text-center u-style-951c0e5f">Ajouter cours et titulaire</h6>
                   <Link to='/primaire/liste_cours_enseigne' className='btn  mt-2 mb-2'>Liste titulaires</Link>
                  </div>
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>
                  <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="enseignant">Enseignants</label>
                      {error ?
                      <p className="text-danger">{error}</p> :

                      <select name="users_id" className="form-control" value={formData.users_id} onChange={handleInputChange} required>
                          <option value="">Sélectionner un enseignant</option>
                          {enseignants.map((enseignant) =>
                        <option key={enseignant.id} value={enseignant.id}>{enseignant.first_name} {enseignant.name}</option>
                        )}
                        </select>
                      }
                      {errors.users_id && <p className="text-danger">{errors.users_id}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="cours_id">Cours</label>
                      <select name="cours_id" className="form-control" value={formData.cours_id} onChange={handleInputChange} required>
                        <option value="">Sélectionner un cours</option>
                        {cours.map((cour) =>
                        <option key={cour.id} value={cour.id}>Cours : Classe : {cour.classe.name} {cour.name} Option : {cour.option.name}</option>
                        )}
                      </select>
                      {errors.cours_id && <p className="text-danger">{errors.cours_id}</p>}
                    </div>
                   

                    <div className="d-grid">
                      <button className={`${`btn  w-100 ${isLoading ? "loading" : ""}`} style-fr-3c5afe6b`} type="submit"
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

export default AjouterCoursEnseigne;
