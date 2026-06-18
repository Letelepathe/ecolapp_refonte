import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const LoginParent = () => {
  const [formData, setFormData] = useState({ code: '', telephone: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const redirection = useNavigate();
   useEffect(() => {
          const checkAuthentication = async () => {
              try {
                  const id_parent = localStorage.getItem('parentId');
  
                  if (id_parent) {
                    redirection('/parent/profil_parent');
                  }
              } catch (error) {
                  console.error('Erreur lors de la vérification de session:', error);
              }
          };
          checkAuthentication();
    }, [redirection]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code) {
      newErrors.code = "Le code est requis.";
    }
    if (!formData.telephone) {
      newErrors.telephone = "Le numéro de téléphone est requis.";
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.telephone)) {
      newErrors.telephone = "Numéro de téléphone invalide.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/parents/login', formData);

      if (response.data.success) {
        localStorage.setItem('parentId', response.data.parent.id);
        localStorage.setItem('parentNom', response.data.parent.nom);

        setMessage("Connexion réussie !");
        navigate('/parent/profil_parent');
      } else {
        setMessage(response.data.message || "Code ou téléphone incorrect.");
      }
    } catch (error) {
      setMessage("Erreur lors de la connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Parent | Connexion</title>
      </Helmet>
      <main className="bg-white">
        <div className="container-fluid p-sm-3 p-0">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-4 col-md-8 d-flex flex-column align-items-center justify-content-center">
              <div className="card bg-white shadow mb-3 w-100">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="text-center" style={{ fontWeight: 900, color: '#1769ff', fontSize: '30px' }}>ecolapp</h5>
                    <p className="text-center small">Connectez-vous avec votre code et téléphone</p>
                  </div>
                  <form onSubmit={handleSubmit} className="row g-3 needs-validation user_activity">
                    {message && <div className="bg-danger text-white text-center py-2">{message}</div>}
                    <div className="col-12">
                      <input
                        type="text"
                        name="code"
                        className="form-control"
                        placeholder="Code du parent"
                        value={formData.code}
                        onChange={handleChange}
                        style={{ padding: '25px' }}
                      />
                      {errors.code && <p className="text-danger">{errors.code}</p>}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="telephone"
                        className="form-control"
                        placeholder="Numéro de téléphone"
                        value={formData.telephone}
                        onChange={handleChange}
                        style={{ padding: '25px' }}
                      />
                      {errors.telephone && <p className="text-danger">{errors.telephone}</p>}
                    </div>
                    <div className="col-12">
                      <button
                        className={`btn btn-primary w-100 ${isLoading ? "loading" : ""}`}
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                      </button>
                    </div>
                    <div className="col-12 text-center">
                      <p className="small mb-0">Nouveau ici ? <Link to="/parent/inscription_parent" className="btn btn-success">Créer un compte</Link></p>
                    </div>
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

export default LoginParent;
