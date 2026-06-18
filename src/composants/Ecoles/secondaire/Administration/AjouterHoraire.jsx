import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterHoraire = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    classe_id: '',
    option_id: '',
    annee_id: '',
    ecole_id : ecole_id,
    direction : direction,
  });

  // Liste des classes, options et années
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Récupérer les classes
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`);
        setClasses(response.data.classesAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes", error);
      }
    };

    const fetchAnnees = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/annee/ecole/${ecole_id}/direction/${direction}`);
        setAnnees(response.data.anneeAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des années", error);
      }
    };

    // Récupérer les options
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
        setOptions(response.data.optionAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des options", error);
      }
    };

    
    fetchAnnees();
    fetchClasses();
    fetchOptions();

  }, [ecole_id, direction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Titre requis";
    if (!formData.image) newErrors.image = "Image requise";
    if (!formData.classe_id) newErrors.classe_id = "Classe requise";
    if (!formData.option_id) newErrors.option_id = "Option requise";
    if (!formData.annee_id) newErrors.annee_id = "Année requise";

    
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

    // Utiliser FormData pour l'envoi
    const data = new FormData();
    data.append("title", formData.title);
    data.append("image", formData.image); // Fichier image
    data.append("classes_id", formData.classe_id);
    data.append("options_id", formData.option_id);
    data.append("annee_id", formData.annee_id);
    data.append("ecole_id", formData.ecole_id);
    data.append("direction", formData.direction);
  
    try {
      const response = await axios.post(
        'https://api.ecolapp.cd/api/horaire/create',
        data,  
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (response.data.statut === 200) {
        setSuccessMessage("Horaire ajouté avec succès !");
        setFormData({
          title: '',
          image: '',
          classe_id: '',
          option_id: '',
          annee_id: '',
          ecole_id : ecole_id,
          direction : direction,
        });
        setErrors({});
 
      } else {
        console.log("Erreur reçue:", response.data);
        setErrorMessage(response.data.msg || "Une erreur s'est produite.");
      }
    } catch (error) {
      console.log("Erreur de requête:", error);
      setErrorMessage("Erreur de connexion au serveur.");
    }finally {
      setIsSubmitting(false); 
    }
  };
  
  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft/>
      <main className="content">
        <NavbarTop/>
        <div className="container mt-2">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <Link to='/secondaire/liste_horaire' className='text-center btn btn-warning text-white'>Liste horaires</Link>
                <div className="card-body">
                  <h3 className="text-center" style={{ fontWeight: 900, color: '#1769ff' }}>Ajouter Horaire</h3>
                  <p className="text-center">Veuillez remplir les informations de l'horaire ci-dessous.</p>
                  <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="mb-3">
                      <label htmlFor="titre">Titre</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.title && <p className="text-danger">{errors.title}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="image">Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        required
                      />
                      {errors.image && <p className="text-danger">{errors.image}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="classe_id">Classe</label>
                      <select
                        name="classe_id"
                        className="form-control"
                        value={formData.classe_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionner une classe</option>
                        {classes.map((classe) => (
                          <option key={classe.id} value={classe.id}>
                            {classe.name}
                          </option>
                        ))}
                      </select>
                      {errors.classe_id && <p className="text-danger">{errors.classe_id}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="option_id">Option</label>
                      <select
                        name="option_id"
                        className="form-control"
                        value={formData.option_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionner une option</option>
                        {options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      {errors.option_id && <p className="text-danger">{errors.option_id}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="option_id">Années scolaires</label>
                      <select
                        name="annee_id"
                        className="form-control"
                        value={formData.annee_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionner une année</option>
                        {annees.map((annee) => (
                          <option key={annee.id} value={annee.id}>
                            {annee.name}
                          </option>
                        ))}
                      </select>
                      {errors.annee_id && <p className="text-danger">{errors.annee_id}</p>}
                    </div>

                   
                    <div className="d-grid">
                     <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: '#1769ff',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '5px',
                        }}
                      >
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
    </div>
  );
};

export default AjouterHoraire;
