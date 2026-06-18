import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SelectTypeCoteDepot = () => {
   const navigate = useNavigate();
   const location = useLocation();
    const [selectedOption, setSelectedOption] = useState('');
    const [errors, setErrors] = useState('');
  
    function getValidIntegerFromQuery(param, defaultValue = 0) {
      const value = new URLSearchParams(location.search).get(param);
      const integerValue = parseInt(value, 10);
      return Number.isInteger(integerValue) ? integerValue : defaultValue;
    }
  
    const classeId = getValidIntegerFromQuery('classe_id', 0);
    const optionId = getValidIntegerFromQuery('option_id', 0);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setErrors("Veuillez sélectionner une option !");
      return;
    }
    setErrors('');
    if (selectedOption === 'periode') {
      navigate(`/maternelle/ajouter_cote_periode_by_enseignant?classe_id=${classeId}&option_id=${optionId}`);
    } else if (selectedOption === 'examen') {
      navigate(`/maternelle/ajouter_cote_examen_by_enseignant?classe_id=${classeId}&option_id=${optionId}`);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <div className="container">
        <section className="section d-flex flex-column align-items-center justify-content-center py-4 min-vh-100">
          <div className="col-lg-6 col-md-8 col-12">
            <div className="card mb-3">
              <div className="card-body">
                <h4 className="text-center" style={{ fontWeight: 900, color: '#1769ff' }}>
                  Sélectionnez une option 
                </h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="option">Type de cotes</label>
                    <select
                      id="option"
                      className="form-control"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <option value="">-- Sélectionner une option --</option>
                      <option value="periode">Cotes pour période</option>
                      <option value="examen">Cotes pour examen</option>
                    </select>
                  </div>
                  {errors && <p className="text-danger">{errors}</p>}
                  <div className="d-grid">
                    <button className="btn btn-primary" type="submit">
                      Continuer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SelectTypeCoteDepot;
