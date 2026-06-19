import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from '../Users/Profil/NavbarTop';

const SelectPeriodeConsulteCote = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classeId = searchParams.get("classe_id");
  const optionId = searchParams.get("option_id");
  const coursId = searchParams.get("cours_id");

  const [periodes, setPeriodes] = useState([]);

  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [errors, setErrors] = useState('');


  useEffect(() => {


    const fetchPeriodes = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/periode/ecole/${ecole_id}/direction/${direction}`);
        setPeriodes(response.data.periodeAll);
        console.log(response.data.periodeAll);
      } catch (error) {
        console.error('Erreur lors de la récupération des périodes:', error);
      }
    };

    fetchPeriodes();
  }, [ecole_id, direction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPeriode) {
      setErrors("Veuillez sélectionner  une période !");
      return;
    }
    setErrors('');
    navigate(`/secondaire/liste_cote_periode_classe_by_enseignant?classe_id=${classeId}&option_id=${optionId}&periode_id=${selectedPeriode}&cours_id=${coursId}`);
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
                    Notes
                  </h4>
                  <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                      <label htmlFor="periode">Période</label>
                      <select
                        id="periode"
                        className="form-control"
                        value={selectedPeriode}
                        onChange={(e) => setSelectedPeriode(e.target.value)}>
                        
                        <option value="">-- Sélectionner une période --</option>
                        {periodes.map((p) =>
                        <option key={p.id} value={p.id}>{p.name}</option>
                        )}
                      </select>
                    </div>
                    {errors && <p className="text-danger">{errors}</p>}
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

export default SelectPeriodeConsulteCote;
