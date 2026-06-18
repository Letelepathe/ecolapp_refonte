import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';



const LoginAdmin = () => {
 
   const redirection = useNavigate();
     useEffect(() => {
            const checkAuthentication = async () => {
                try {
                    const adminId = localStorage.getItem('adminId');
    
                    if (adminId) {
                      redirection('/admin-general/profil_admin');
                    }
                } catch (error) {
                    console.error('Erreur lors de la vérification de session:', error);
                }
            };
            checkAuthentication();
      }, [redirection]);

  const ecole_id = 0;
  const direction = 0;
  
  const [formData, setFormData] = useState({ identifier: '', password: '', ecole_id : ecole_id, direction: direction }); 
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const validateForm = () => {
    const newErrors = {};
    const { identifier, password } = formData;

    if (!identifier) {
      newErrors.identifier = "Identifiant requis (email ou téléphone).";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) && !/^\+?[0-9]{10,15}$/.test(identifier)) {
      newErrors.identifier = "Veuillez entrer un email valide ou un numéro de téléphone valide.";
    }

    if (!password) {
      newErrors.password = "Mot de passe requis.";
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
        const response = await axios.post('https://api.ecolapp.cd/api/admin/login', formData);

        if (response.data.status === 200) {
            // Stocker l'ID de l'utilisateur et le token JWT dans localStorage
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('adminId', response.data.userId);
            localStorage.setItem('auth_token', response.data.token);

            localStorage.setItem('ecole_id', formData.ecole_id); 
            localStorage.setItem('direction', formData.direction);

            setMessage("Connexion réussie !");
            navigate('/admin-general/profil_admin');
        } else {
            setMessage(response.data.msg || "Identifiant ou mot de passe incorrect.");
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
        <title>admin | login</title>
      </Helmet>
      <main className="bg-white">
        <div className="container-fluid p-sm-3 p-0">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-4 col-md-8 d-flex flex-column align-items-center justify-content-center">
              <div className="card bg-white shadow mb-3 w-100">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="text-center" style={{ fontWeight: 900, color: '#1769ff', fontSize: '30px' }}>ecolapp</h5>
                    <p className="text-center small">Veuillez vous identifier pour vous connecter</p>
                  </div>
                  <form onSubmit={handleSubmit} className="row g-3 needs-validation user_activity">
                    {message && <div className="bg-danger text-white text-center py-2">{message}</div>}
                    <div className="col-12">
                      <input
                        type="text"
                        name="identifier"
                        className="form-control"
                        placeholder="Email ou Téléphone"
                        value={formData.identifier}
                        onChange={handleChange}
                        
                      />
                      {errors.identifier && <p className="text-danger">{errors.identifier}</p>}
                    </div>
                    <div className="col-12">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                       
                      />
                      {errors.password && <p className="text-danger">{errors.password}</p>}
                    </div>
                    <div className="col-12">
                      <button className={`btn btn-primary w-100 ${isLoading ? "loading" : ""}`} type="submit"
                       disabled={isLoading}
                      >
                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                      </button>
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

export default LoginAdmin;
