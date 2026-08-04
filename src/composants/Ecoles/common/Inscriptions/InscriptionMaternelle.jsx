import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { choisirOptionCompatibilite, obtenirConfigCycle } from "../../../../config/cyclesScolaires";
import { getAgeEleveError } from "../validationAgeEleve";
import ImgDrapeau from "../../../../static/images/drapeau.png";
import ImgSymbole from "../../../../static/images/symb.png";

const API = "https://api.ecolapp.cd/api";

const creerFormulaire = (ecoleId, direction) => ({
  name: "",
  first_name: "",
  last_name: "",
  ecole_provenance: "Première inscription",
  percent: "0",
  classes_id: "",
  options_id: "",
  sexe: "Homme",
  date_naissance: "",
  lieu_de_naissance: "",
  nationalite: "Congolaise",
  adresse: "",
  code_parent: "",
  terms: false,
  ecole_id: ecoleId,
  direction,
});

const champsObligatoires = {
  name: "Nom requis",
  first_name: "Prénom requis",
  last_name: "Postnom requis",
  classes_id: "Niveau maternel requis",
  lieu_de_naissance: "Lieu de naissance requis",
  nationalite: "Nationalité requise",
  adresse: "Adresse requise",
};

const Champ = ({ label, name, value, onChange, error, type = "text", ...props }) => (
  <div className="col-12 col-lg-6">
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      className="form-control"
      value={value}
      onChange={onChange}
      {...props}
    />
    {error && <p className="text-danger">{error}</p>}
  </div>
);

const InscriptionMaternelle = ({ routeSucces }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const navigate = useNavigate();
  const config = obtenirConfigCycle("maternelle");
  const [ecole, setEcole] = useState(null);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState(() => creerFormulaire(ecoleId, direction));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dateMin = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - config.ageMaximum - 1);
    return date.toISOString().split("T")[0];
  }, [config.ageMaximum]);

  const dateMax = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - config.ageMinimum);
    return date.toISOString().split("T")[0];
  }, [config.ageMinimum]);

  useEffect(() => {
    const charger = async () => {
      try {
        const [ecoleResponse, classesResponse, optionsResponse] = await Promise.all([
          axios.get(`${API}/ecole/ecole_id/${ecoleId}`),
          axios.get(`${API}/classe/ecole/${ecoleId}/direction/${direction}`),
          axios.get(`${API}/option/ecole/${ecoleId}/direction/${direction}`),
        ]);
        const optionsCycle = optionsResponse.data.optionAll || [];
        const optionId = choisirOptionCompatibilite(
          optionsCycle,
          "maternelle"
        );

        setEcole(ecoleResponse.data.ecole);
        setClasses(classesResponse.data.classesAll || []);
        setOptions(optionsCycle);
        setFormData((current) => ({ ...current, options_id: optionId || "" }));
      } catch {
        setErrors({ form: "Impossible de charger la configuration de l'école." });
      }
    };

    charger();
  }, [ecoleId, direction]);

  const modifier = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: "", form: "" }));
  };

  const valider = () => {
    const prochainesErreurs = {};
    Object.entries(champsObligatoires).forEach(([champ, libelle]) => {
      if (!String(formData[champ] || "").trim()) prochainesErreurs[champ] = libelle;
    });

    const erreurAge = getAgeEleveError(
      formData.date_naissance,
      config.ageMinimum,
      config.ageMaximum
    );
    if (erreurAge) prochainesErreurs.date_naissance = erreurAge;
    if (!formData.options_id) {
      prochainesErreurs.form =
        "L'école doit d'abord configurer une option pour la maternelle. Contactez l'administration.";
    }
    if (!formData.terms) prochainesErreurs.terms = "Veuillez confirmer l'exactitude des informations.";

    setErrors(prochainesErreurs);
    return Object.keys(prochainesErreurs).length === 0;
  };

  const envoyer = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!valider()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        code_parent: formData.code_parent.trim() || null,
      };
      const response = await axios.post(`${API}/inscription/create`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status !== 200) {
        setErrors({ form: response.data.error_msg || response.data.errorsList || "Inscription refusée par le serveur." });
        return;
      }

      setMessage("Demande d'inscription enregistrée.");
      navigate(routeSucces(response.data.last_id));
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.error_msg ||
          "Erreur de connexion lors de l'inscription.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!ecole && !errors.form) return <div className="spinner" />;

  return (
    <div>
      <Helmet>
        <title>{ecole?.name || "École maternelle"} | inscription</title>
      </Helmet>
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-8 col-md-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="justify-content-between d-flex">
                    <img src={ImgDrapeau} alt="Drapeau de la RDC" className="u-style-4335d984" />
                    <div className="text-center">
                      <h3 className="u-style-951c0e5f">ecolapp</h3>
                      <h4 className="u-style-4789709b">{ecole?.name}</h4>
                      <h6>Demande d'inscription à la maternelle</h6>
                    </div>
                    <img src={ImgSymbole} alt="Emblème de la RDC" className="u-style-4335d984" />
                  </div>

                  <p className="text-center">
                    Cycle de trois années destiné aux enfants de 3 à 5 ans.
                  </p>

                  <form className="needs-validation inscription" onSubmit={envoyer} noValidate>
                    <div className="row">
                      <Champ label="Nom" name="name" value={formData.name} onChange={modifier} error={errors.name} />
                      <Champ label="Postnom" name="last_name" value={formData.last_name} onChange={modifier} error={errors.last_name} />
                      <Champ label="Prénom" name="first_name" value={formData.first_name} onChange={modifier} error={errors.first_name} />
                      <div className="col-12 col-lg-6">
                        <label htmlFor="sexe">Sexe</label>
                        <select id="sexe" name="sexe" className="form-control" value={formData.sexe} onChange={modifier}>
                          <option value="Homme">Garçon</option>
                          <option value="Femme">Fille</option>
                        </select>
                      </div>
                      <Champ
                        label="Date de naissance"
                        name="date_naissance"
                        type="date"
                        min={dateMin}
                        max={dateMax}
                        value={formData.date_naissance}
                        onChange={modifier}
                        error={errors.date_naissance}
                      />
                      <Champ label="Lieu de naissance" name="lieu_de_naissance" value={formData.lieu_de_naissance} onChange={modifier} error={errors.lieu_de_naissance} />
                      <Champ label="Nationalité" name="nationalite" value={formData.nationalite} onChange={modifier} error={errors.nationalite} />
                      <Champ label="Adresse familiale" name="adresse" value={formData.adresse} onChange={modifier} error={errors.adresse} />

                      <div className="col-12 col-lg-6">
                        <label htmlFor="classes_id">Niveau maternel</label>
                        <select id="classes_id" name="classes_id" className="form-control" value={formData.classes_id} onChange={modifier}>
                          <option value="">Sélectionner un niveau</option>
                          {classes.map((classe) => (
                            <option key={classe.id} value={classe.id}>{classe.name}</option>
                          ))}
                        </select>
                        {errors.classes_id && <p className="text-danger">{errors.classes_id}</p>}
                      </div>
                      <Champ
                        label="Code parent (facultatif)"
                        name="code_parent"
                        value={formData.code_parent}
                        onChange={modifier}
                        error={errors.code_parent}
                      />

                      <div className="col-12 mt-3">
                        <div className="form-check">
                          <input id="terms" className="form-check-input" name="terms" type="checkbox" checked={formData.terms} onChange={modifier} />
                          <label className="form-check-label" htmlFor="terms">
                            Je confirme que les renseignements fournis sont exacts.
                          </label>
                          {errors.terms && <p className="text-danger">{errors.terms}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label htmlFor="options_id">Option / programme pédagogique</label>
                      <select id="options_id" className="form-control" value={formData.options_id} disabled>
                        {!options.length && <option value="">Aucune option configurée</option>}
                        {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                      </select>
                      <small className="text-muted">Définie par l'administration pour ce cycle.</small>
                    </div>
                    <button className="btn btn-white w-100 mt-4" type="submit" disabled={isLoading || !formData.options_id}>
                      {isLoading ? "Inscription en cours..." : "Soumettre la demande"}
                    </button>
                    {message && <p className="text-success text-center mt-2">{message}</p>}
                    {errors.form && <p className="text-danger text-center mt-2">{errors.form}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default InscriptionMaternelle;
