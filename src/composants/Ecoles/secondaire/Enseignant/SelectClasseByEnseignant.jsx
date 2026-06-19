import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from '../Users/Profil/NavbarTop';
const SelectClasseByEnseignant = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [errors, setErrors] = useState('');

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

    const fetchoptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
        setOptions(response.data.optionAll);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des options:", error);
      }
    };

    fetchClasses();
    fetchoptions();
  }, [ecole_id, direction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClasse) {
      setErrors("Veuillez sélectionner une classe !");
      return;
    }
    if (!selectedOption) {
      setErrors("Veuillez sélectionner une option !");
      return;
    }

    setErrors('');
    navigate(`/secondaire/select_type_cote_depot?classe_id=${selectedClasse}&option_id=${selectedOption}`);
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className='container'>
          <section className='section d-flex flex-column align-items-center justify-content-center py-4 min-vh-100'>
            <div className='col-lg-6 col-md-8 col-12'>
              <div className="card mb-3">
                <div className="card-body">
                  <h4 className="text-center u-style-951c0e5f">
                    Gestion notes/Ajouter notes
                  </h4> 
                  <form onSubmit={handleSubmit}>
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
                      <button className="btn " type="submit">Valider</button>
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

export default SelectClasseByEnseignant;
