import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterTravail = () => {

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_remise: '',
    id_cours: '',
    id_classe: '',
    id_type_travail: '',
    file: '',
    direction: 3
  });
  const [cours, setCours] = useState([]);
  const [typesTravail, setTypesTravail] = useState([]);
  const [classes, setClasses] = useState([]);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursRes, typesTravailRes, classes] = await Promise.all([
        axios.get('http://localhost/ecole-app/apis/getCours'),
        axios.get('http://localhost/ecole-app/apis/getTypeTravail'),
        axios.get('http://localhost/ecole-app/apis/getClasses')]
        );
        setCours(coursRes.data);
        setTypesTravail(typesTravailRes.data);
        setClasses(classes.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre) newErrors.titre = "Titre requis";
    if (!formData.description) newErrors.description = "Description requise";
    if (!formData.date_remise) newErrors.date_remise = "Date de remise requise";
    if (!formData.id_cours) newErrors.id_cours = "Cours requis";
    if (!formData.id_classe) newErrors.id_classe = "Classe requise";
    if (!formData.id_type_travail) newErrors.id_type_travail = "Type de travail requis";
    if (!formData.file) newErrors.file = "Fichier requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('date_remise', formData.date_remise);
    data.append('id_cours', formData.id_cours);
    data.append('id_classe', formData.id_classe);
    data.append('id_type_travail', formData.id_type_travail);
    data.append('file', formData.file);

    try {
      const response = await axios.post(
        'http://localhost/ecole-app/apis/AjouterTravail',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );


      if (response.data.success) {
        setSuccessMessage("Travail ajouté avec succès !");
        setErrors({});
        setFormData({
          titre: '',
          description: '',
          date_remise: '',
          id_cours: '',
          id_classe: '',
          id_type_travail: '',
          file: ''
        });
        console.log(response.data);
      } else {
        console.log(response.data);
        setErrors({ form: "Erreur lors de l'ajout du travail" });
      }
    } catch (error) {
      setErrors({ form: "Erreur de connexion au serveur" });
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
       <div className="content">
        <NavbarTop />
        <section className='section d-flex flex-column align-items-center justify-content-center py-4'>
          <div className='col-lg-6 col-md-8 col-12'>
            <div className='card mb-3'>
              <div className="card-body">
                     <Link className="btn " to='/secondaire/liste_travail'>Liste des travaux</Link>
                    <h3 className="text-center u-style-951c0e5f">Ajouter travail</h3>
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
                        <label htmlFor="date_remise" className="form-label">Date de remise</label>
                        <input type="date" name="date_remise" className="form-control" value={formData.date_remise} onChange={handleInputChange} />
                        {errors.date_remise && <p className="text-danger">{errors.date_remise}</p>}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="id_cours" className="form-label">Cours</label>
                        <select name="id_cours" className="form-control" value={formData.id_cours} onChange={handleInputChange}>
                          <option value="">Sélectionner un cours</option>
                          {cours.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                        {errors.id_cours && <p className="text-danger">{errors.id_cours}</p>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="id_classe" className="form-label">Classe</label>
                        <select name="id_classe" className="form-control" value={formData.id_classe} onChange={handleInputChange}>
                          <option value="">Sélectionner un cours</option>
                          {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.nom_classe}</option>)}
                        </select>
                        {errors.id_classe && <p className="text-danger">{errors.id_classe}</p>}
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="id_type_travail" className="form-label">Type de travail</label>
                        <select name="id_type_travail" className="form-control" value={formData.id_type_travail} onChange={handleInputChange}>
                          <option value="">Sélectionner un type</option>
                          {typesTravail.map((type) => <option key={type.id} value={type.id}>{type.typeTravail}</option>)}
                        </select>
                        {errors.id_type_travail && <p className="text-danger">{errors.id_type_travail}</p>}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="file">Fichier</label>
                        <input
                      type="file"
                      name="file"
                      className="form-control"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      required />
                    
                        {errors.file && <p className="text-danger">{errors.file}</p>}
                      </div>
                      
                      <button type="submit" className="btn  w-100">Ajouter Travail</button>
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

export default AjouterTravail;
