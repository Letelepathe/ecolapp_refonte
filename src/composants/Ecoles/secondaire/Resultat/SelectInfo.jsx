import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SelectInfo = () => {
  const navigate = useNavigate();
  const { id_eleve } = useParams();
  const [selectedOption, setSelectedOption] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setErrors("Veuillez sélectionner une option !");
      return;
    }
    setErrors('');
    if (selectedOption === 'periodique') {
      navigate(`/secondaire/consulter_resultat_periodique?eleve_id=${id_eleve}`);
    } else if (selectedOption === 'semestriel') {
      navigate(`/secondaire/consulter_resultat_semestriel?eleve_id=${id_eleve}`);
    } else if (selectedOption === 'annuel') {
      navigate(`/secondaire/consulter_resultat_annuel?eleve_id=${id_eleve}`);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <div className="container">
        <section className="section d-flex flex-column align-items-center justify-content-center py-4 min-vh-100">
          <div className="col-lg-6 col-md-8 col-12 bg-white shadow">
            <div className="card mb-3">
              <div className="card-body">
                <p className="text-center u-style-951c0e5f">
                  Sélectionnez une option de consultation
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="option">Type de résultat</label>
                    <select
                      id="option"
                      className="form-control"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}>
                      
                      <option value="">-- Sélectionner une option --</option>
                      <option value="periodique">Résultats périodiques</option>
                      <option value="semestriel">Résultats semestriels</option>
                      <option value="annuel">Résultats Annuels</option>
                    </select>
                  </div>
                  {errors && <p className="text-danger">{errors}</p>}
                  <div className="d-grid">
                   <button className="btn btn-white u-style-eae60df9" type="submit">Valider</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>);

};

export default SelectInfo;
