import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectAnnee = () => {
  function getValidIntegerFromQuery(param, defaultValue = 0) {
    const value = new URLSearchParams(window.location.search).get(param);
    const integerValue = parseInt(value, 10);
    return Number.isInteger(integerValue) ? integerValue : defaultValue;
  }

  const navigate = useNavigate();
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  const id_eleve = getValidIntegerFromQuery('eleve_id', 0);
  const [annees, setAnnees] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnee = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/annee/ecole/${ecole_id}/direction/${direction}`);
        setAnnees(response.data.anneeAll || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des années:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnee();
  }, [id_eleve, ecole_id, direction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnnee) {
      setErrors("Veuillez sélectionner une année !");
      return;
    }
    setErrors('');
    navigate(`/maternelle/resultat_annuel?eleve_id=${id_eleve}&annee_id=${selectedAnnee}`);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <div className='container'>
        <section className='section d-flex flex-column align-items-center justify-content-center py-4 min-vh-100'>
          <div className='col-lg-6 col-md-8 col-12'>
            <div className="card mb-3">
              <div className="card-body">
                <p className="text-center" style={{ fontWeight: 900, color: '#1769ff' }}>
                  Sélectionnez une année
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="Annee">Année scolaire</label>
                    <select
                      id="annee"
                      className="form-control"
                      value={selectedAnnee}
                      onChange={(e) => setSelectedAnnee(e.target.value)}
                    >
                      <option value="">-- Sélectionner une année --</option>
                      {annees.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors && <p className="text-danger">{errors}</p>}
                  <div className="d-grid">
                   <button className="btn btn-white" style={{background:'#1769ff', color:'#fff', padding:'10px', borderRadius:'25px'}} type="submit">Valider</button>
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

export default SelectAnnee;
