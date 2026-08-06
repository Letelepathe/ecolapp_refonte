import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImgDrapeau from "../../../../static/images/drapeau.png";
import ImgSymbole from "../../../../static/images/symb.png";
import EcranChargement from "../../../common/EcranChargement";

const Inscriptionsecondaire = () => {
  const [ecole, setEcole] = useState(null);
  const [requetesInitiales, setRequetesInitiales] = useState(3);
  const [erreurInitiale, setErreurInitiale] = useState("");
  const requeteInitialeTerminee = () => setRequetesInitiales((nombre) => Math.max(0, nombre - 1));
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  useEffect(() => {
    const fetchInfoEcole = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/ecole/ecole_id/${ecole_id}`, { timeout: 15000 });
        setEcole(response.data.ecole);
      } catch (error) {
        setErreurInitiale("Les informations de l’école sont momentanément indisponibles.");
      } finally {
        requeteInitialeTerminee();
      }
    };

    fetchInfoEcole();
  }, [ecole_id]);



  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    ecole_provenance: '',
    percent: '',
    classes_id: '',
    options_id: '',
    sexe: 'Homme',
    date_naissance: '',
    lieu_de_naissance: '',
    nationalite: '',
    adresse: '',
    code_parent: '',
    terms: false,
    ecole_id: ecole_id,
    direction: direction
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`, { timeout: 15000 });
        setOptions(response.data.optionAll);
        console.log(response.data);
      } catch (error) {
        setErreurInitiale("Les options d’inscription n’ont pas pu être chargées.");
      } finally {
        requeteInitialeTerminee();
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`, { timeout: 15000 });
        setClasses(response.data.classesAll);
        console.log(response.data);
      } catch (error) {
        setErreurInitiale("Les classes d’inscription n’ont pas pu être chargées.");
      } finally {
        requeteInitialeTerminee();
      }
    };

    fetchOptions();
    fetchClasses();
  }, [ecole_id, direction]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nom requis";
    if (!formData.first_name) newErrors.first_name = "Prénom requis";
    if (!formData.last_name) newErrors.last_name = "Postnom requis";
    if (!formData.ecole_provenance) newErrors.ecole_provenance = "École de provenance requise";
    if (!formData.percent) newErrors.percent = "Pourcentage requis";

    if (!formData.classes_id) newErrors.classes_id = "Classe d'inscription requise";

    if (!formData.date_naissance) newErrors.date_naissance = "Date de naissance requise";
    if (!formData.lieu_de_naissance) newErrors.lieu_de_naissance = "Lieu de naissance requis";
    if (!formData.nationalite) newErrors.nationalite = "Nationalité requise";

    if (!formData.adresse) newErrors.adresse = "Adresse requise";
    if (!formData.code_parent) newErrors.code_parent = "Code requis";

    if (!formData.terms) newErrors.terms = "Vous devez accepter les conditions et règlements";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://api.ecolapp.cd/api/inscription/create",
      formData,
      { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.status === 200) {
        setSuccessMessage("Inscription réussie !");
        setErrors({});

        setFormData({
          name: '',
          first_name: '',
          last_name: '',
          ecole_provenance: '',
          percent: '',
          classes_id: '',
          options_id: '',
          sexe: 'Homme',
          date_naissance: '',
          lieu_de_naissance: '',
          nationalite: '',
          adresse: '',
          code_parent: '',
          terms: false,
          ecole_id: ecole_id,
          direction: direction
        });

        navigate(`/secondaire/accueil_inscription_secondaire/${response.data.last_id}`);
      } else {
        setErrors({ form: response.data.errorList || "Une erreur est survenue lors de l'inscription." });
        console.log(response.data.error_msg);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ form: error.response.data.errorList || "Erreur lors de la soumission du formulaire." });
      } else {
        setErrors({ form: "Erreur de connexion au serveur" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (requetesInitiales > 0) return <EcranChargement titre="Préparation du formulaire d’inscription" message="Nous chargeons l’école, les classes et les options disponibles." />;
  if (erreurInitiale || !ecole) return <EcranChargement erreur={erreurInitiale || "Le formulaire d’inscription est indisponible."} onReessayer={() => window.location.reload()} />;

  return (
    <div>
      <Helmet>
        <title>{ecole.name} | inscription</title>
      </Helmet>
      <main className=''>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-8 col-md-12 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="justify-content-between d-flex">
                    <img src={ImgDrapeau} alt="logo" className="u-style-4335d984" />
                    <div className="text-center">
                      <h3 className="text-center u-style-951c0e5f">ecolapp</h3>
                      <h4 className="text-center u-style-4789709b">{ecole.name}</h4>
                      <h6 className="text-center u-style-4789709b">Bulletin de demande d'inscription</h6><hr />
                    </div>                
                    <img src={ImgSymbole} alt="logo" className="u-style-4335d984" />
                  </div>
                  <p className="text-center">Veuillez remplir le formulaire ci-dessous attentivement.</p>

                  <form className="needs-validation inscription" onSubmit={handleSubmit} noValidate>
                    <div className="row">
                      <div className="col-12 col-lg-6">
                        <label htmlFor="name">Nom</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                        {errors.name && <p className="text-danger">{errors.name}</p>}
                      </div>
                      <div className="col-12 col-lg-6">
                        <label htmlFor="last_name">Postnom</label>
                        <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleInputChange} required />
                        {errors.last_name && <p className="text-danger">{errors.last_name}</p>}
                      </div>
                      <div className="col-12">
                        <label htmlFor="first_name">Prénom</label>
                        <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleInputChange} required />
                        {errors.first_name && <p className="text-danger">{errors.first_name}</p>}
                      </div>
                      <div className="col-12">
                          <label htmlFor="sexe">Genre</label>
                          <select name="sexe" className="form-control" onChange={handleInputChange} value={formData.sexe}>
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                          </select>
                      </div>
                      <div className="col-lg-6 col-12">
                          <label htmlFor="date_naissance">Date de naissance</label>
                          <input type="date" name="date_naissance" className="form-control" value={formData.date_naissance} onChange={handleInputChange} required />
                          {errors.date_naissance && <p className="text-danger">{errors.date_naissance}</p>}
                        </div>
                      <div className="col-lg-6 col-12">
                          <label htmlFor="lieu_de_naissance">Lieu de naissance</label>
                          <input type="text" name="lieu_de_naissance" className="form-control" value={formData.lieu_de_naissance} onChange={handleInputChange} required />
                          {errors.lieu_de_naissance && <p className="text-danger">{errors.lieu_de_naissance}</p>}
                      </div>

                      <div className="col-12">
                          <label htmlFor="nationalite">Nationalité</label>
                          <input type="text" name="nationalite" className="form-control" value={formData.nationalite} onChange={handleInputChange} required />
                          {errors.nationalite && <p className="text-danger">{errors.nationalite}</p>}
                      </div>

                      <div className="col-12">
                          <label htmlFor="adresse">Adresse</label>
                          <input type="text" name="adresse" className="form-control" value={formData.adresse} onChange={handleInputChange} required />
                          {errors.adresse && <p className="text-danger">{errors.adresse}</p>}
                      </div>
                      
                      <div className="col-12 col-lg-6">
                        <label htmlFor="ecole_provenance">École de provenance</label>
                        <input type="text" name="ecole_provenance" className="form-control" value={formData.ecole_provenance} onChange={handleInputChange} required />
                        {errors.ecole_provenance && <p className="text-danger">{errors.ecole_provenance}</p>}
                      </div>
                      <div className="col-12 col-lg-6">
                        <label htmlFor="percent">Pourcentage</label>
                        <input type="number" max='2' name="percent" className="form-control" value={formData.percent} onChange={handleInputChange} required />
                        {errors.percent && <p className="text-danger">{errors.percent}</p>}
                      </div>
                      
                      <div className="col-12 col-lg-6">
                        <label htmlFor="classes_id">Classe d'inscription</label>
                        <select name="classes_id" className="form-control" onChange={handleInputChange} value={formData.classes_id} required>
                          <option value="">Sélectionner une classe</option>
                          {classes.map((classe) =>
                          <option key={classe.id} value={classe.id}>{classe.name}</option>
                          )}
                        </select>
                        {errors.classes_id && <p className="text-danger">{errors.classes_id}</p>}
                      </div>
                      <div className="col-12 col-lg-6">
                        <label htmlFor="options_id">Option d'étude (Optionnelle pour 7ème et 8ème)</label>
                        <select name="options_id" className="form-control" onChange={handleInputChange} value={formData.options_id} required>
                          <option value="">Sélectionner une option</option>
                          {options.map((option) =>
                          <option key={option.id} value={option.id}>{option.name}</option>
                          )}
                        </select>
                     
                      </div>
                    
                      <fieldset>

                        <div className="row">

                          <div className="col-12">
                            <label htmlFor="code_parent">Code parent</label>
                            <input type="text" name="code_parent" className="form-control" value={formData.code_parent} onChange={handleInputChange} required />
                            {errors.code_parent && <p className="text-danger">{errors.code_parent}</p>}
                          </div>

                        </div>
                      </fieldset>

                      <div className="col-12">
                        <div className="form-check">
                          <input className="form-check-input" name="terms" type="checkbox" checked={formData.terms} onChange={handleInputChange} />
                          <label className="form-check-label">
                            Je certifie sur mon honneur que tous les renseignements fournis ci-haut sont exacts <br />
                            et que je m'engage à respecter les règlements et statuts du Collège.
                          </label>
                          {errors.terms && <p className="text-danger">{errors.terms}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        className={`${`btn btn-white w-100 ${isLoading ? "loading" : ""}`} style-fr-0920e098`}

                        type="submit"
                        disabled={isLoading}>
                        
                        
                        {isLoading ? "Inscription en cours..." : "Soumettre ma demande"}
                      </button>
                    </div>
                    {successMessage && <p className="text-success text-center mt-2">{successMessage}</p>}
                    {errors.form && <p className="text-danger text-center mt-2">{errors.form}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>);

};

export default Inscriptionsecondaire;
