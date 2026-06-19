import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const CreationCompte = () => {
  const ecole_id = parseInt(localStorage.getItem('ecole_id') || 0, 10);
  const direction = parseInt(localStorage.getItem('direction') || 0, 10);

  const [fonctions, setFonctions] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    first_name: '',
    sexe: 'Homme',
    address: '',
    phone: '',
    email: '',
    email_confirmation: '',
    password: '',
    password_confirmation: '',
    fonction_id: '',
    file: null,
    role: 'Membre',
    ecole_id: ecole_id,
    direction: direction
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFonctions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/fonction/ecole/${ecole_id}/direction/${direction}`);
        setFonctions(response.data.fonctionAll);
      } catch {
        console.log("Erreur lors de la récupération des fonctions");
      }
    };

    fetchFonctions();
  }, [ecole_id, direction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nom est requis.';
    if (!formData.last_name) newErrors.last_name = 'Nom de famille est requis.';
    if (!formData.first_name) newErrors.first_name = 'Prénom est requis.';
    if (!formData.address) newErrors.address = 'Adresse est requise.';
    if (!formData.phone) newErrors.phone = 'Téléphone est requis.';
    if (!formData.email) newErrors.email = 'Email est requis.';
    if (formData.email !== formData.email_confirmation)
    newErrors.email_confirmation = 'Les emails ne correspondent pas.';
    if (!formData.password) newErrors.password = 'Mot de passe est requis.';
    if (formData.password !== formData.password_confirmation)
    newErrors.password_confirmation = 'Les mots de passe ne correspondent pas.';

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
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/register', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === 200) {
        setSuccessMessage('Compte créé avec succès !');
        setFormData({
          name: '',
          last_name: '',
          first_name: '',
          sexe: 'Homme',
          address: '',
          phone: '',
          email: '',
          email_confirmation: '',
          password: '',
          password_confirmation: '',
          fonction_id: '',
          file: null,
          role: 'Membre',
          ecole_id: ecole_id,
          direction: direction
        });
        setErrors({});
        navigate(`/primaire/pre_connexion/${response.data.last_id}`);
      } else {
        setErrors({ form: response.data.error_msg || 'Erreur inattendue.' });
      }
      console.log(response.data.last_id);
    } catch (error) {
      console.error('Erreur API:', error.response?.data || error);
      let errorMsg = 'Impossible de créer le compte pour le moment.';
      if (
      error.response &&
      error.response.data &&
      typeof error.response.data.error_msg === 'string')
      {
        errorMsg = error.response.data.error_msg;
      }
      setErrors({ form: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>primaire | Création compte</title>
       
      </Helmet>
      <div className="">
        <div className="container">
          <section className="row section register d-flex flex-column align-items-center justify-content-center">
            <div className="col-lg-8 col-12 card mb-3">
              <div className="card-body">
                <h2 className="text-center fs-4 u-style-951c0e5f">
                  Réjoindre ecolapp
                </h2>
                <p className="text-center small">
                  Veuillez décliner votre identité pour créer un compte
                </p>
                <form onSubmit={handleSubmit} className="user_activity" encType="multipart/form-data">
                  <div className="row g-3">
                  {errors.form &&
                    <div className="bg-danger text-white text-center py-2">
                      {typeof errors.form === 'object' ? JSON.stringify(errors.form, null, 2) : errors.form}
                    </div>
                    }

                    <div className="col-6">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Nom"
                        value={formData.name}
                        onChange={handleChange} />
                      
                      {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        placeholder="Postnom"
                        value={formData.last_name}
                        onChange={handleChange} />
                      
                      {errors.last_name && <p className="text-danger">{errors.last_name}</p>}
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        placeholder="Prénom"
                        value={formData.first_name}
                        onChange={handleChange} />
                      
                      {errors.first_name && <p className="text-danger">{errors.first_name}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="sexe">Sexe</label>
                      <select
                        name="sexe"
                        className="form-control"
                        value={formData.sexe}
                        onChange={handleChange}>
                        
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    </div>

                    <div className="col-lg-6 col-12">
                      <label htmlFor="sexe">Rôle</label>
                      <select
                        name="role"
                        className="form-control"
                        value={formData.role}
                        onChange={handleChange}>
                        
                        <option value="Membre">Membre</option>
                        <option value="Administrateur">Administrateur</option>
                        <option value="Super Administrateur">Super Administrateur</option>
                      </select>
                    </div>

                    <div className="col-lg-6 col-12">
                        <label htmlFor="fonction_id">Fonction</label>
                        <select name="fonction_id" className="form-control" value={formData.fonction_id} onChange={handleChange} required>
                          <option value="">Sélectionner une fonction</option>
                          {fonctions.map((fonction) =>
                        <option key={fonction.id} value={fonction.id}>{fonction.name}</option>
                        )}
                        </select>
                        {errors.fonction_id && <p className="text-danger">{errors.fonction_id}</p>}
                      </div>

                    <div className="col-12">
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Adresse"
                        value={formData.address}
                        onChange={handleChange} />
                      
                      {errors.address && <p className="text-danger">{errors.address}</p>}
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        placeholder="Téléphone"
                        value={formData.phone}
                        onChange={handleChange} />
                      
                      {errors.phone && <p className="text-danger">{errors.phone}</p>}
                    </div>

                    <div className="col-6">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange} />
                      
                      {errors.email && <p className="text-danger">{errors.email}</p>}
                    </div>
                    <div className="col-6">
                      <input
                        type="email"
                        name="email_confirmation"
                        className="form-control"
                        placeholder="Confirmez Email"
                        value={formData.email_confirmation}
                        onChange={handleChange} />
                      
                      {errors.email_confirmation &&
                      <p className="text-danger">{errors.email_confirmation}</p>
                      }
                    </div>

                    <div className="col-6">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange} />
                      
                      {errors.password && <p className="text-danger">{errors.password}</p>}
                    </div>
                    <div className="col-6">
                      <input
                        type="password"
                        name="password_confirmation"
                        className="form-control"
                        placeholder="Confirmez Mot de passe"
                        value={formData.password_confirmation}
                        onChange={handleChange} />
                      
                      {errors.password_confirmation &&
                      <p className="text-danger">{errors.password_confirmation}</p>
                      }
                    </div>

                    <div className="col-12">
                      <input
                        type="file"
                        name="file"
                        className="form-control"
                        onChange={handleFileChange} />
                      
                    </div>

                    <div className="col-12">
                      <button
                        className={`${`btn btn-white w-100 ${isLoading ? "loading" : ""}`} style-fr-dd64956e`}

                        type="submit"
                        disabled={isLoading}>
                        
                        {isLoading ? "Inscription en cours..." : "S'inscire"}
                      </button>
                    </div>

                    {successMessage &&
                    <p className="text-success text-center mt-2">{successMessage}</p>
                    }

                    <div className="col-12 text-center">
                      
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);

};

export default CreationCompte;
