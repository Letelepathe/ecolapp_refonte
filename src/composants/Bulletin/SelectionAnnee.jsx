import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const SelectionAnnee = () => {

  const navigate = useNavigate();

  const { eleve_id, ecole_id, direction } = useParams();
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
  }, [eleve_id, ecole_id, direction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnnee) {
      setErrors("Veuillez sélectionner une année !");
      return;
    }
    setErrors('');
    navigate(`/bulletin/eleve/${eleve_id}/annee/${selectedAnnee}/ecole/${ecole_id}/direction/${direction}`);
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
                <p className="text-center u-style-951c0e5f">
                  Sélectionnez une année
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="Annee">Année scolaire</label>
                    <select
                      id="annee"
                      className="form-control"
                      value={selectedAnnee}
                      onChange={(e) => setSelectedAnnee(e.target.value)}>
                      
                      <option value="">-- Sélectionner une année --</option>
                      {annees.map((a) =>
                      <option key={a.id} value={a.id}>{a.name}</option>
                      )}
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

export default SelectionAnnee;
