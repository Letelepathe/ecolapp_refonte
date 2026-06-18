import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";

const SelectCoursPeriodeConsulteCote = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classeId = searchParams.get("classe_id");

  const [cours, setCours] = useState([]);
  const [periodes, setPeriodes] = useState([]);
  const [selectedCours, setSelectedCours] = useState('');
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get(`http://localhost/ecole-app/apis/getCoursByClasse?classe_id=${classeId}`);
        setCours(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error);
      }
    };

    const fetchPeriodes = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getPeriode');
        setPeriodes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des périodes:', error);
      }
    };

    fetchCours();
    fetchPeriodes();
  }, [classeId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCours || !selectedPeriode) {
      setErrors("Veuillez sélectionner un cours et une période !");
      return;
    }
    setErrors('');
    navigate(`/secondaire/liste_cote?classe_id=${classeId}&periode_id=${selectedPeriode}&cours_id=${selectedCours}`);
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
                  <h4 className="text-center u-style-951c0e5f">
                    Sélectionnez un cours et une période
                  </h4>
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
                        <option key={c.id} value={c.id}>{c.nom}</option>
                        )}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="periode">Période</label>
                      <select
                        id="periode"
                        className="form-control"
                        value={selectedPeriode}
                        onChange={(e) => setSelectedPeriode(e.target.value)}>
                        
                        <option value="">-- Sélectionner une période --</option>
                        {periodes.map((p) =>
                        <option key={p.id} value={p.id}>{p.periode}</option>
                        )}
                      </select>
                    </div>
                    {errors && <p className="text-danger">{errors}</p>}
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

export default SelectCoursPeriodeConsulteCote;
