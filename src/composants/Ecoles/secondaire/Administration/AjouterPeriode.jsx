import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const AjouterPeriode = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [formData, setFormData] = useState({
    name: '',
    semestre_id: '',
    ecole_id: ecole_id,
    direction: direction
  });
  const [semestres, setSemestres] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSemestres = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/semestre/ecole/${ecole_id}/direction/${direction}`);
        setSemestres(response.data.semestreAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des semestres", error);
      }
    };
    fetchSemestres();
  }, [ecole_id, direction]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.periode = "La periode est requise";
    if (!formData.semestre_id) newErrors.periode = "Le semestre est requis";
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
      const response = await axios.post('https://api.ecolapp.cd/api/periode/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 200) {
        setSuccessMessage("Période ajoutée avec succès !");
        setErrors({});
        setFormData({ name: '', semestre_id: '', ecole_id: ecole_id, direction: direction });
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
                <div className='container d-flex align-items-center justify-content-between py-2'>
                 <h6 className="text-center u-style-951c0e5f">Ajouter Période</h6>
                 <Link to='/secondaire/liste_periode' className='btn  text-white'>Liste Périodes</Link>
                </div>
                <div className="card-body">
                  
                  <p className="text-center">Veuillez remplir les informations de la section ci-dessous.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="tranche">Période</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.periode}
                        onChange={handleInputChange}
                        required />
                      
                      {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="semestre_id">Semestre</label>
                      <select name="semestre_id" className="form-control" value={formData.semestre_id} onChange={handleInputChange} required>
                        <option value="">Sélectionner un semestre</option>
                        {semestres.map((semestre) =>
                        <option key={semestre.id} value={semestre.id}>{semestre.name}</option>
                        )}
                      </select>
                      {errors.semestre_id && <p className="text-danger">{errors.semestre_id}</p>}
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

export default AjouterPeriode;
