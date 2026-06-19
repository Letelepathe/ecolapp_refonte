import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjouterMembreEffectif = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    postnom: '',
    prenom: '',
    sexe: '',
    fonction: ''
  });
  const [fonctions, setFonctions] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFonctions = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getFonction.php');
        setFonctions(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des fonctions:", error);
      }
    };

    fetchFonctions();
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
    if (!formData.nom) newErrors.nom = "Nom requis.";
    if (!formData.postnom) newErrors.postnom = "Postnom requis.";
    if (!formData.prenom) newErrors.prenom = "Prénom requis.";
    if (!formData.sexe) newErrors.sexe = "Sexe requis.";
    if (!formData.fonction) newErrors.fonction = "Fonction requise.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        'http://localhost/ecole-app/apis/AjouterMembreEffectif.php',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setSuccessMessage("Membre effectif ajouté avec succès !");
        setErrors({});
        setFormData({
          nom: '',
          postnom: '',
          prenom: '',
          sexe: '',
          fonction: ''
        });
        setTimeout(() => navigate('/secondaire/liste_membre_effectif'), 1500);
      } else {
        setErrors({ form: response.data.message || "Erreur lors de l'ajout du membre effectif." });
      }
    } catch (error) {
      setErrors({ form: "Erreur de connexion au serveur." });
    }
  };

  return (
    <div>
      <main className=''>
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <h3 className="text-center u-style-951c0e5f">Ajouter Membre Effectif</h3>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="nom">Nom</label>
                      <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleInputChange} />
                      {errors.nom && <p className="text-danger">{errors.nom}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="postnom">Postnom</label>
                      <input type="text" name="postnom" className="form-control" value={formData.postnom} onChange={handleInputChange} />
                      {errors.postnom && <p className="text-danger">{errors.postnom}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="prenom">Prénom</label>
                      <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleInputChange} />
                      {errors.prenom && <p className="text-danger">{errors.prenom}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="sexe">Sexe</label>
                      <select name="sexe" className="form-control" value={formData.sexe} onChange={handleInputChange}>
                        <option value="">Sélectionner le sexe</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                      {errors.sexe && <p className="text-danger">{errors.sexe}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fonction">Fonction</label>
                      <select name="fonction" className="form-control" value={formData.fonction} onChange={handleInputChange}>
                        <option value="">Sélectionner une fonction</option>
                        {fonctions.map((fonction) =>
                        <option key={fonction.id} value={fonction.fonction}>
                            {fonction.fonction}
                          </option>
                        )}
                      </select>
                      {errors.fonction && <p className="text-danger">{errors.fonction}</p>}
                    </div>

                    <button type="submit" className="btn  w-100">Ajouter Membre Effectif</button>
                    {successMessage && <p className="text-success mt-2">{successMessage}</p>}
                    {errors.form && <p className="text-danger mt-2">{errors.form}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>);

};

export default AjouterMembreEffectif;
