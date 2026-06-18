import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from '../Users/Profil/NavbarTop';

const AjouterTravailByEnseignant = () => {
  const fileInputRef = useRef(null);

  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    id_cours: '',
    id_classe: '',
    id_option: '',
    file: null,
    ecole_id: ecole_id,
    direction: direction
  });
  const [cours, setCours] = useState([]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const userId = localStorage.getItem("userId"); // Récupérer l'userId depuis le localStorage
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursRes, classes, options] = await Promise.all([
        axios.get(`https://api.ecolapp.cd/api/coursens/enseignant/${userId}`),
        axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`),
        axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`)]
        );
        setCours(coursRes.data.cours);
        setClasses(classes.data.classesAll);
        setOptions(options.data.optionAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, [userId, ecole_id, direction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre) newErrors.titre = "Titre requis";
    if (!formData.description) newErrors.description = "Description requise";
    if (!formData.id_cours) newErrors.id_cours = "Cours requis";
    if (!formData.id_classe) newErrors.id_classe = "Classe requise";
    if (!formData.id_option) newErrors.id_option = "Option requise";
    if (!formData.file) newErrors.file = "Fichier requis";

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
    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('id_cours', formData.id_cours);
    data.append('id_classe', formData.id_classe);
    data.append('id_option', formData.id_option);
    data.append('id_enseignant', userId);
    data.append('file', formData.file);
    data.append('ecole_id', formData.ecole_id);
    data.append('direction', formData.direction);

    try {
      const response = await axios.post(
        'https://api.ecolapp.cd/api/coursFichier/create',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );

      if (response.data.status === 200) {
        setSuccessMessage("Cours ajouté avec succès !");
        setErrors({});
        setFormData({
          titre: '',
          description: '',
          id_cours: '',
          id_classe: '',
          id_option: '',
          file: null,
          ecole_id: ecole_id,
          direction: direction
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        console.log(response.data);
      } else {
        console.log(response.data);
        setErrors({ form: "Erreur lors de l'ajout du travail" });
      }
    } catch (error) {
      setErrors({ form: "Erreur de connexion au serveur" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <section className='section d-flex flex-column align-items-center justify-content-center py-4'>
          <div className='col-lg-6 col-md-8 col-12'>
            <div className='card mb-3'>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <Link className="btn btn-primary" to='/secondaire/liste_cours_by_enseignant'>Mes cours</Link>
                  <h6 className="text-center u-style-951c0e5f">Ajouter fichier cours</h6>
                </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-3">
                    <label htmlFor="titre" className="form-label">Titre</label>
                    <input type="text" name="titre" className="form-control" value={formData.titre} onChange={handleInputChange} />
                    {errors.titre && <p className="text-danger">{errors.titre}</p>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea name="description" className="form-control" value={formData.description} onChange={handleInputChange}></textarea>
                    {errors.description && <p className="text-danger">{errors.description}</p>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="id_cours">Cours</label>
                    <select id="id_cours" name="id_cours" className="form-control" value={formData.id_cours} onChange={handleInputChange}>
                      <option value="">Sélectionnez un cours</option>
                      {cours.map((c) =>
                      <option key={c.cour.id} value={c.cour.id}>{c.cour.name}</option>
                      )}
                    </select>
                    {errors.id_cours && <p className="text-danger">{errors.id_cours}</p>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="id_classe" className="form-label">Classe</label>
                    <select name="id_classe" className="form-control" value={formData.id_classe} onChange={handleInputChange}>
                      <option value="">Sélectionner une classe</option>
                      {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.name}</option>)}
                    </select>
                    {errors.id_classe && <p className="text-danger">{errors.id_classe}</p>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="id_option" className="form-label">Option</label>
                    <select name="id_option" className="form-control" value={formData.id_option} onChange={handleInputChange}>
                      <option value="">Sélectionner une option</option>
                      {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                    </select>
                    {errors.id_option && <p className="text-danger">{errors.id_option}</p>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="file">Fichier</label>
                    <input
                      type="file"
                      name="file"
                      className="form-control"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      ref={fileInputRef}
                      required />
                    
                    {errors.file && <p className="text-danger">{errors.file}</p>}
                  </div>

                  <button
                    className="btn btn-primary w-100 u-style-2167c5af"
                    type="submit"
                    disabled={isSubmitting}>






                    
                    {isSubmitting ? 'Enregistrement en cours...' : 'Ajouter'}
                  </button>
                  {successMessage && <p className="text-success text-center mt-3">{successMessage}</p>}
                  {errors.form && <p className="text-danger text-center mt-3">{errors.form}</p>}
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>);

};

export default AjouterTravailByEnseignant;
