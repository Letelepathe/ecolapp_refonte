import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';

const InscriptionParent = () => {
  const [formData, setFormData] = useState({
    nom: '',
    postnom: '',
    prenom: '',
    sexe: 'Homme',
    adresse: '',
    telephone: '',
    profession: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      photo: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Le nom est requis.';
    if (!formData.postnom) newErrors.postnom = 'Le postnom est requis.';
    if (!formData.prenom) newErrors.prenom = 'Le prénom est requis.';
    if (!formData.adresse) newErrors.adresse = 'L’adresse est requise.';
    if (!formData.telephone) {
      newErrors.telephone = 'Le téléphone est requis.';
    } else if (!formData.telephone.startsWith('243')) {
      newErrors.telephone = 'Le numéro doit commencer par 243.';
    }
    if (!formData.profession) newErrors.profession = 'La profession est requise.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/parents/create', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 200) {
        setSuccessMessage('Parent créé avec succès !');
        navigate(`/parent/pre_connexion_parent/${response.data.last_id}`);
      } else {
        setErrors({ form: response.data.error_msg || 'Erreur inconnue.' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error_msg || 'Erreur serveur.';
      setErrors({ form: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Helmet><title>Parent | Inscription</title></Helmet>
      <div className="bg-white">
        <div className="container">
          <section className="row d-flex flex-column align-items-center justify-content-center">
            <div className="col-lg-8 col-12 card my-5" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div className="card-body">
                <div className="pt-4 pb-2">
                  <h5 className="text-center" style={{ fontWeight: 900, color: '#1769ff', fontSize: '30px' }}>ecolapp</h5>
                  <p className="text-center small">Inscription du parent</p>
                </div>

                {errors.form && (
                  <div className="alert alert-danger text-center">{errors.form}</div>
                )}
                {successMessage && (
                  <div className="alert alert-success text-center">{successMessage}</div>
                )}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row g-3">

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="nom"
                        className="form-control"
                        placeholder="Nom"
                        value={formData.nom}
                        onChange={handleChange}
                      />
                      {errors.nom && <p className="text-danger">{errors.nom}</p>}
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="postnom"
                        className="form-control"
                        placeholder="Postnom"
                        value={formData.postnom}
                        onChange={handleChange}
                      />
                      {errors.postnom && <p className="text-danger">{errors.postnom}</p>}
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        name="prenom"
                        className="form-control"
                        placeholder="Prénom"
                        value={formData.prenom}
                        onChange={handleChange}
                      />
                      {errors.prenom && <p className="text-danger">{errors.prenom}</p>}
                    </div>

                    <div className="col-12">
                      <select
                        name="sexe"
                        className="form-control"
                        value={formData.sexe}
                        onChange={handleChange}
                      >
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        name="profession"
                        className="form-control"
                        placeholder="Profession"
                        value={formData.profession}
                        onChange={handleChange}
                      />
                      {errors.profession && <p className="text-danger">{errors.profession}</p>}
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="adresse"
                        className="form-control"
                        placeholder="Adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                      />
                      {errors.adresse && <p className="text-danger">{errors.adresse}</p>}
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="telephone"
                        className="form-control"
                        placeholder="Téléphone"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                      {errors.telephone && <p className="text-danger">{errors.telephone}</p>}
                    </div>

                    <div className="col-12">
                      <label>Photo (optionnelle)</label>
                      <input
                        type="file"
                        name="photo"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="col-12 mt-3">
                      <button
                        type="submit"
                        className={`btn btn-primary w-100 ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                        style={{ backgroundColor: '#1769ff', borderColor: '#1769ff' }}
                      >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                      </button>
                    </div>
                    <div className="col-12 text-center">
                      <p className="small mb-0">Vous avez déjà un compte ? <Link to="/parent/login" className="btn btn-success">Connectez-vous ici</Link></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InscriptionParent;
