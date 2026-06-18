import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from "react-feather";
import NavbarBottom from '../Index/NavbarBottom';

const Ecoles = () => {
  const [ecoles, setEcoles] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [provincesEducationnelles, setProvincesEducationnelles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEcole, setSelectedEcole] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedProvinceEducationnelle, setSelectedProvinceEducationnelle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ecolesResponse, provincesResponse, provincesEducationnellesResponse] = await Promise.all([
        axios.get('https://api.ecolapp.cd/api/ecole'),
        axios.get('https://api.ecolapp.cd/api/province'),
        axios.get('https://api.ecolapp.cd/api/provinceEducationnelle')]
        );

        setEcoles(ecolesResponse.data.ecoleAll || []);
        setProvinces(provincesResponse.data.provinceAll || []);
        setProvincesEducationnelles(provincesEducationnellesResponse.data.provinceEducationnelleAll || []);
        setLoading(false);
      } catch (error) {
        setError('Erreur de récupération des données');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectEcole = (id) => {
    setSelectedEcole(id);
  };

  // const handleSubmit = () => {
  //   if (selectedEcole) {
  //     navigate(`/ecole/choix_direction/${selectedEcole}`);
  //   } else {
  //     alert('Veuillez sélectionner une école');
  //   }
  // };

  const filteredProvincesEducationnelles = selectedProvince ?
  provincesEducationnelles.filter((provinceEducationnelle) =>
  provinceEducationnelle.province_id === parseInt(selectedProvince, 10)
  ) :
  provincesEducationnelles;

  const filteredEcoles = ecoles.filter((ecole) => {
    const matchesSearch = ecole.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ecole.adresse.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvinceEducationnelle = selectedProvinceEducationnelle ?
    ecole.province_educationnelle_id === parseInt(selectedProvinceEducationnelle, 10) :
    true;

    return matchesSearch && matchesProvinceEducationnelle;
  });

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 mt-0">
        <p className='text-danger text-center'>{error}</p>
      </div>);

  }

  const styles = {
    header: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#fff",
      zIndex: "10",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    container: {
      paddingTop: "70px",
      paddingBottom: "30px",
      minHeight: "100vh",
      backgroundColor: "#f8f9fa"
    }
  };

  return (
    <div style={styles.container}>
      <Helmet>
        <title>ecolapp | écoles</title>
      </Helmet>

      <div style={styles.header}>
        <button

          onClick={() => navigate(-1)} className="u-style-ce53d055">
          
          <ArrowLeft size={24} color="#0d66ff" />
        </button>
          <h5 className="m-0 text-primary fw-semibold">Ecoles</h5>
        <div className="u-style-97711f5c"></div>
      </div>
  
      <div className="bloc-ecole-3 d-flex justify-content-center align-items-center min-vh-100 mt-0">
        <div className="card bloc-ecole-1 p-4 w-100 u-style-dc271cfe">
          <div className="card-body">
            <h3 className="text-center mb-4">Rechercher une école</h3>
  
            <form>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Recherchez par nom"
                  value={searchQuery}
                  onChange={handleSearchChange} />
                
              </div>
  
              <div className="mb-3">
                <label className="form-label">Province</label>
                <select
                  className="form-select"
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedProvinceEducationnelle('');
                  }}
                  value={selectedProvince}>
                  
                  <option value="">Toutes les provinces</option>
                  {provinces.map((province) =>
                  <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  )}
                </select>
              </div>
  
              <div className="mb-4">
                <label className="form-label">Province Éducationnelle</label>
                <select
                  className="form-select"
                  onChange={(e) => setSelectedProvinceEducationnelle(e.target.value)}
                  value={selectedProvinceEducationnelle}>
                  
                  <option value="">Toutes les provinces éducationnelles</option>
                  {filteredProvincesEducationnelles.map((provinceEducationnelle) =>
                  <option key={provinceEducationnelle.id} value={provinceEducationnelle.id}>
                      {provinceEducationnelle.name}
                    </option>
                  )}
                </select>
              </div>
            </form>
  
            {filteredEcoles.length === 0 ?
            <div className="text-center text-muted">Aucune école trouvée.</div> :

            <div className="d-flex flex-column gap-3">
                {filteredEcoles.map((ecole) =>
              <Link
                key={ecole.id}
                to={`/ecole/choix_direction/${ecole.id}/${ecole.name.replace(/ /g, '+')}`}
                className="text-decoration-none">
                
                    <div
                  className="card p-3 shadow-sm u-style-571cf55a"




                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  
                      <h5 className="mb-1 text-primary">{ecole.name}</h5>
                      <p className="mb-0 text-muted">{ecole.adresse}</p>
                    </div>
                  </Link>
              )}
              </div>
            }
          </div>
        </div>
      </div>
  
      <NavbarBottom />
    </div>);


};

export default Ecoles;
