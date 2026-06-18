import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from '../Users/Profil/NavbarTop';

const SelectClasseConsulteCoteByEnseignant = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const navigate = useNavigate();
  const [cours, setCours] = useState([]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedCours, setSelectedCours] = useState('');
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [errors, setErrors] = useState('');
  const users_id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/coursens/enseignant/${users_id}`);
        setCours(response.data.cours);
        console.log(response.data.status);
      } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error);
      }
    };
    fetchCours();
  }, [users_id]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`);
        setClasses(response.data.classesAll);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes:", error);
      }
    };

    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
        setOptions(response.data.optionAll);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des options:", error);
      }
    };

    fetchClasses();
    fetchOptions();

  }, [ecole_id, direction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClasse) {
      setErrors("Veuillez sélectionner une classe !");
      return;
    }
    setErrors('');
    navigate(`/secondaire/select_type_cote_consulte?cours_id=${selectedCours}&classe_id=${selectedClasse}&option_id=${selectedOption}`);
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className='container'>
          <section className='section d-flex flex-column align-items-center justify-content-center py-4 min-vh-100'>
            <div className='col-lg-6 col-md-8 col-12'>
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="text-center u-style-951c0e5f">
                    Notes
                  </h6>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="cours">Cours</label>
                      <select
                        id="cours"
                        className="form-control"
                        value={selectedCours}
                        onChange={(e) => setSelectedCours(e.target.value)}>
                        
                        <option value="">-- Sélectionner un cours --</option>
                        {cours.map((c) =>
                        <option key={c.cour.id} value={c.cour.id}>{c.cour.name}</option>
                        )}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="classe">Classe</label>
                      <select
                        id="classe"
                        className="form-control"
                        value={selectedClasse}
                        onChange={(e) => setSelectedClasse(e.target.value)}>
                        
                        <option value="">-- Sélectionner une classe --</option>
                        {classes.map((classe) =>
                        <option key={classe.id} value={classe.id}>{classe.name}</option>
                        )}
                      </select>
                      {errors && <p className="text-danger">{errors}</p>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="option">Option</label>
                      <select
                        id="option"
                        className="form-control"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}>
                        
                        <option value="">-- Sélectionner une option --</option>
                        {options.map((option) =>
                        <option key={option.id} value={option.id}>{option.name}</option>
                        )}
                      </select>
                      {errors && <p className="text-danger">{errors}</p>}
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary" type="submit">Valider</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);

};

export default SelectClasseConsulteCoteByEnseignant;
