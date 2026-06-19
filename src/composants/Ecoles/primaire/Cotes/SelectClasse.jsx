import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";
const SelectClasse = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getClasses.php');
        setClasses(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClasse) {
      setErrors("Veuillez sélectionner une classe !");
      return;
    }
    setErrors('');
    navigate(`/primaire/ajouter_cote?classe_id=${selectedClasse}`);
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
                        <option key={classe.id} value={classe.id}>{classe.nom_classe}</option>
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

export default SelectClasse;
