import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImgDrapeau from "../../../../static/images/drapeau.png";
import ImgSymbole from "../../../../static/images/symb.png";
import { choisirOptionCompatibilite, obtenirConfigCycle } from "../../../../config/cyclesScolaires";
import {
  getAgeMinimumEleveError,
  getErreurPourcentageFacultatif,
  normaliserChampFacultatif,
  normaliserPourcentageFacultatif,
} from "../../common/validationAgeEleve";

const URL_API = "https://api.ecolapp.cd/api";
const configPrimaire = obtenirConfigCycle("primaire");

const creerFormulaire = (ecoleId, direction) => ({
  type_admission: "premiere_inscription",
  name: "",
  first_name: "",
  last_name: "",
  ecole_provenance: "",
  percent: "",
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

const InscriptionPrimaire = () => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const navigate = useNavigate();
  const [ecole, setEcole] = useState(null);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [formulaire, setFormulaire] = useState(() =>
    creerFormulaire(ecoleId, direction)
  );
  const [erreurs, setErreurs] = useState({});
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const [reponseEcole, reponseClasses, reponseOptions] = await Promise.all([
          axios.get(`${URL_API}/ecole/ecole_id/${ecoleId}`),
          axios.get(`${URL_API}/classe/ecole/${ecoleId}/direction/${direction}`),
          axios.get(`${URL_API}/option/ecole/${ecoleId}/direction/${direction}`),
        ]);
        const options = reponseOptions.data.optionAll || [];
        setEcole(reponseEcole.data.ecole);
        setClasses(reponseClasses.data.classesAll || []);
        setOptions(options);
        setFormulaire((courant) => ({
          ...courant,
          options_id: String(
            choisirOptionCompatibilite(options, "primaire") || ""
          ),
        }));
      } catch {
        setErreurs({ form: "Impossible de charger les informations de l'école." });
      }
    };
    charger();
  }, [direction, ecoleId]);

  const estTransfert = formulaire.type_admission === "transfert";

  const changerChamp = (event) => {
    const { name, value, type, checked } = event.target;
    setFormulaire((courant) => ({
      ...courant,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "type_admission" && value !== "transfert"
        ? { ecole_provenance: "", percent: "" }
        : {}),
    }));
    setErreurs((courant) => ({ ...courant, [name]: "", form: "" }));
  };

  const valider = () => {
    const nouvelles = {};
    const obligatoires = {
      name: "Nom requis",
      first_name: "Prénom requis",
      last_name: "Postnom requis",
      nationalite: "Nationalité requise",
      adresse: "Adresse requise",
      classes_id: "Classe primaire requise",
    };
    Object.entries(obligatoires).forEach(([champ, message]) => {
      if (!String(formulaire[champ] || "").trim()) nouvelles[champ] = message;
    });
    if (estTransfert && !formulaire.ecole_provenance.trim()) {
      nouvelles.ecole_provenance = "École de provenance requise pour un transfert";
    }
    const erreurPourcentage = getErreurPourcentageFacultatif(formulaire.percent);
    if (erreurPourcentage) nouvelles.percent = erreurPourcentage;
    const erreurAge = getAgeMinimumEleveError(
      formulaire.date_naissance,
      configPrimaire.ageMinimum
    );
    if (erreurAge) nouvelles.date_naissance = erreurAge;
    if (!formulaire.options_id) {
      nouvelles.form =
        "L'école doit d'abord configurer une option pour le primaire. Contactez l'administration.";
    }
    if (!formulaire.terms) {
      nouvelles.terms = "Vous devez certifier les informations fournies";
    }
    setErreurs(nouvelles);
    return Object.keys(nouvelles).length === 0;
  };

  const envoyer = async (event) => {
    event.preventDefault();
    setErreurs({});
    if (!valider()) return;

    setChargement(true);
    try {
      const payload = {
        ...formulaire,
        ecole_provenance: estTransfert
          ? formulaire.ecole_provenance.trim()
          : formulaire.type_admission === "reinscription"
            ? "Réinscription"
            : "Première inscription",
        percent: normaliserPourcentageFacultatif(formulaire.percent),
        date_naissance: normaliserChampFacultatif(formulaire.date_naissance),
        lieu_de_naissance: normaliserChampFacultatif(formulaire.lieu_de_naissance),
        code_parent: formulaire.code_parent.trim() || null,
      };
      const reponse = await axios.post(`${URL_API}/inscription/create`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (Number(reponse.data.status) !== 200) {
        setErreurs({
          form:
            reponse.data.error_msg ||
            reponse.data.status_msg ||
            "L'inscription n'a pas été enregistrée.",
        });
        return;
      }
      navigate(`/primaire/accueil_inscription_primaire/${reponse.data.last_id}`);
    } catch (erreur) {
      setErreurs({
        form:
          erreur.response?.data?.error_msg ||
          "Erreur de connexion pendant l'inscription.",
      });
    } finally {
      setChargement(false);
    }
  };

  if (!ecole && !erreurs.form) return <div className="spinner" />;

  return (
    <div>
      <Helmet>
        <title>{ecole?.name || "École primaire"} | Inscription primaire</title>
      </Helmet>
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-xl-9 col-lg-10 col-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <img src={ImgDrapeau} alt="Drapeau" className="u-style-4335d984" />
                    <div className="text-center">
                      <h1 className="h4 mb-1">{ecole?.name || "École primaire"}</h1>
                      <p className="mb-0">Demande d'inscription au primaire</p>
                    </div>
                    <img src={ImgSymbole} alt="Emblème" className="u-style-4335d984" />
                  </div>
                  <hr />
                  <p className="text-muted text-center">
                    Renseignez l'enfant et la classe primaire demandée. L'école vérifiera
                    la demande avant confirmation.
                  </p>

                  <form onSubmit={envoyer} noValidate>
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="type_admission">Situation de l'enfant</label>
                        <select
                          id="type_admission"
                          name="type_admission"
                          className="form-control"
                          value={formulaire.type_admission}
                          onChange={changerChamp}
                        >
                          <option value="premiere_inscription">Première inscription au primaire</option>
                          <option value="transfert">Transfert depuis une autre école</option>
                          <option value="reinscription">Réinscription dans l'école</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="name">Nom</label>
                        <input id="name" name="name" className="form-control" value={formulaire.name} onChange={changerChamp} />
                        {erreurs.name && <p className="text-danger">{erreurs.name}</p>}
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="last_name">Postnom</label>
                        <input id="last_name" name="last_name" className="form-control" value={formulaire.last_name} onChange={changerChamp} />
                        {erreurs.last_name && <p className="text-danger">{erreurs.last_name}</p>}
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="first_name">Prénom</label>
                        <input id="first_name" name="first_name" className="form-control" value={formulaire.first_name} onChange={changerChamp} />
                        {erreurs.first_name && <p className="text-danger">{erreurs.first_name}</p>}
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="sexe">Sexe</label>
                        <select id="sexe" name="sexe" className="form-control" value={formulaire.sexe} onChange={changerChamp}>
                          <option value="Homme">Garçon</option>
                          <option value="Femme">Fille</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="date_naissance">Date de naissance (facultatif)</label>
                        <input id="date_naissance" type="date" name="date_naissance" className="form-control" value={formulaire.date_naissance} onChange={changerChamp} />
                        {erreurs.date_naissance && <p className="text-danger">{erreurs.date_naissance}</p>}
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="lieu_de_naissance">Lieu de naissance (facultatif)</label>
                        <input id="lieu_de_naissance" name="lieu_de_naissance" className="form-control" value={formulaire.lieu_de_naissance} onChange={changerChamp} />
                        {erreurs.lieu_de_naissance && <p className="text-danger">{erreurs.lieu_de_naissance}</p>}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="nationalite">Nationalité</label>
                        <input id="nationalite" name="nationalite" className="form-control" value={formulaire.nationalite} onChange={changerChamp} />
                        {erreurs.nationalite && <p className="text-danger">{erreurs.nationalite}</p>}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="adresse">Adresse</label>
                        <input id="adresse" name="adresse" className="form-control" value={formulaire.adresse} onChange={changerChamp} />
                        {erreurs.adresse && <p className="text-danger">{erreurs.adresse}</p>}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="classes_id">Classe primaire demandée</label>
                        <select id="classes_id" name="classes_id" className="form-control" value={formulaire.classes_id} onChange={changerChamp}>
                          <option value="">Sélectionner une classe</option>
                          {classes.map((classe) => (
                            <option key={classe.id} value={classe.id}>{classe.name}</option>
                          ))}
                        </select>
                        {erreurs.classes_id && <p className="text-danger">{erreurs.classes_id}</p>}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="code_parent">Code parent ou tuteur (facultatif)</label>
                        <input id="code_parent" name="code_parent" className="form-control" value={formulaire.code_parent} onChange={changerChamp} />
                        <small className="text-muted">L'école pourra relier le parent plus tard.</small>
                      </div>

                      {estTransfert && (
                        <>
                          <div className="col-md-8">
                            <label htmlFor="ecole_provenance">École de provenance</label>
                            <input id="ecole_provenance" name="ecole_provenance" className="form-control" value={formulaire.ecole_provenance} onChange={changerChamp} />
                            {erreurs.ecole_provenance && <p className="text-danger">{erreurs.ecole_provenance}</p>}
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="percent">Dernier résultat (%) (facultatif)</label>
                            <input id="percent" type="text" inputMode="decimal" name="percent" className="form-control" value={formulaire.percent} onChange={changerChamp} placeholder="Ex. 75,5" />
                            {erreurs.percent && <p className="text-danger">{erreurs.percent}</p>}
                          </div>
                        </>
                      )}

                      <div className="col-12">
                        <div className="form-check">
                          <input id="terms" className="form-check-input" name="terms" type="checkbox" checked={formulaire.terms} onChange={changerChamp} />
                          <label className="form-check-label" htmlFor="terms">
                            Je certifie que les informations fournies sont exactes.
                          </label>
                        </div>
                        {erreurs.terms && <p className="text-danger">{erreurs.terms}</p>}
                      </div>
                    </div>

                    {erreurs.form && <div className="alert alert-danger mt-3">{erreurs.form}</div>}
                    <div className="mt-3">
                      <label htmlFor="options_id">Option / programme</label>
                      <select id="options_id" className="form-control" value={formulaire.options_id} disabled>
                        {!options.length && <option value="">Aucune option configurée</option>}
                        {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                      </select>
                      <small className="text-muted">Définie par l'administration pour ce cycle.</small>
                    </div>
                    <button type="submit" className="btn w-100 mt-4" disabled={chargement || !formulaire.options_id}>
                      {chargement ? "Envoi en cours…" : "Soumettre la demande"}
                    </button>
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

export default InscriptionPrimaire;
