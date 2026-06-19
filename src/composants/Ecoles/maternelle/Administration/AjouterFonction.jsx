import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterFonction = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    ecole_id: ecole_id,
    direction: direction
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.fonction = "La Fonction est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/fonction/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Fonction ajoutée avec succès !");
        setErrors({});
        setFormData({ name: '', ecole_id: ecole_id, direction: direction });

      } else {
        setErrorMessage(response.data.msg);
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
      <main className="content">
        <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-6 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                <Link to='/maternelle/liste_fonction' className='btn  mb-2 mt-2'>Liste fonctions</Link>
                  <h3 className="text-center u-style-951c0e5f">Ajouter Fonction</h3>
                  <p className="text-center">Veuillez remplir les informations ci-dessous.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="tranche">Fonction</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required />
                      
                      {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>
                    

                    <div className="d-grid">
                      <button className="btn  u-style-2167c5af" disabled={isSubmitting} type="submit">
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
    </div>);

};

export default AjouterFonction;
