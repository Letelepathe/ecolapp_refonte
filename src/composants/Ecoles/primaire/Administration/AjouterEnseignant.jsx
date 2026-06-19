import React, { useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterEnseignant = () => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    postnom: '',
    prenom: '',
    sexe: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Nom requis";
    if (!formData.postnom) newErrors.postnom = "Postnom requis";
    if (!formData.prenom) newErrors.prenom = "Prénom requis";
    if (!formData.sexe) newErrors.sexe = "Sexe requis";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost/ecole-app/apis/AjouterEnseignant.php', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setSuccessMessage("Enseignant ajouté avec succès !");
        setErrors({});
        setFormData({
          nom: '',
          postnom: '',
          prenom: '',
          sexe: ''
        });
        // navigate('/primaire/liste_enseignant'); 
      } else {
        setErrors({ form: response.data.message });
        console.log(response.data);
      }
    } catch (error) {
      setErrors({ form: "Erreur de connexion au serveur" });
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
              <Link className="btn  mb-2" to='/primaire/liste_enseignant'>Liste enseignants</Link>
              <div className="card mb-3">
                
                <div className="card-body">
                  <h3 className="text-center u-style-951c0e5f">Ajouter Enseignant</h3>
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>

                  <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="nom">Nom</label>
                      <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleInputChange} required />
                      {errors.nom && <p className="text-danger">{errors.nom}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="postnom">Postnom</label>
                      <input type="text" name="postnom" className="form-control" value={formData.postnom} onChange={handleInputChange} required />
                      {errors.postnom && <p className="text-danger">{errors.postnom}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="prenom">Prénom</label>
                      <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleInputChange} required />
                      {errors.prenom && <p className="text-danger">{errors.prenom}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="sexe">Sexe</label>
                      <select name="sexe" className="form-control" value={formData.sexe} onChange={handleInputChange} required>
                        <option value="">Sélectionner le sexe</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                      {errors.sexe && <p className="text-danger">{errors.sexe}</p>}
                    </div>
                   

                    <div className="d-grid">
                      <button className="btn  u-style-2167c5af" type="submit">Ajouter enseignant</button>
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

export default AjouterEnseignant;
