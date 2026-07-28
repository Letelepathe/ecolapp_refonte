import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import LigneEleve from "../../common/AjoutEleves/LigneEleve";
import {
  URL_API,
  chargerRefsEleves,
  creerEleveVide,
  majEleve,
  validerEleve,
} from "../../common/AjoutEleves/outilsAjoutEleves";
import {
  attribuerTypeEleve,
  creerContexteTypesEleves,
  listerTypesEleves,
} from "../../../../services/typesEleves/typesElevesService";
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const messageErreurApi = (error, fallback) => {
  if (error.response?.status === 405) {
    return "La modification de l'élève n'est pas disponible côté API: la route actuelle autorise seulement GET/HEAD.";
  }

  return (
    error.response?.data?.errors?.code_parent?.[0] ||
    error.response?.data?.errorsList?.code_parent?.[0] ||
    error.response?.data?.message ||
    error.response?.data?.error_msg ||
    fallback
  );
};

const normaliserEleve = (
  eleve,
  ecoleId,
  direction,
  codeParent = "",
  typeEleveParDefautId = ""
) => ({
  ...creerEleveVide(ecoleId, direction),
  ...eleve,
  classes_id: String(eleve.classes_id || eleve.classe?.id || ""),
  options_id: String(eleve.options_id || eleve.option?.id || ""),
  annee_id: String(eleve.annee_id || eleve.annee?.id || ""),
  code_parent: eleve.code_parent || codeParent,
  type_eleve_id: String(
    eleve.type_eleve_id ||
      eleve.type_eleve?.id ||
      eleve.typeEleve?.id ||
      typeEleveParDefautId ||
      ""
  ),
});

const ModifierEleve = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const userId = localStorage.getItem("userId");

  const [eleve, setEleve] = useState(creerEleveVide(ecoleId, direction));
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [typesEleves, setTypesEleves] = useState([]);
  const [err, setErr] = useState({});
  const [msgOk, setMsgOk] = useState("");
  const [msgErr, setMsgErr] = useState("");
  const [chargement, setChargement] = useState(true);
  const [soumission, setSoumission] = useState(false);

  useEffect(() => {
    const chargerDonnees = async () => {
      setChargement(true);
      setMsgErr("");

      try {
        const contexteTypes = creerContexteTypesEleves();
        const [refs, responseEleve, types] = await Promise.all([
          chargerRefsEleves(ecoleId, direction),
          axios.get(`${URL_API}/eleve/${id}`),
          listerTypesEleves(contexteTypes),
        ]);

        const eleveApi = responseEleve.data?.eleve;
        let codeParent = "";

        if (eleveApi?.parent_id) {
          try {
            const responseParent = await axios.get(`${URL_API}/parents/${eleveApi.parent_id}`);
            codeParent = responseParent.data?.parent?.code || "";
          } catch {
            codeParent = "";
          }
        }

        setClasses(refs.classes);
        setOptions(refs.options);
        setAnnees(refs.annees);
        setTypesEleves(types);
        const typeParDefaut =
          types.find((type) => type.estTypeParDefaut) || types[0] || null;
        setEleve(
          normaliserEleve(
            eleveApi || {},
            ecoleId,
            direction,
            codeParent,
            typeParDefaut?.id
          )
        );
      } catch (error) {
        setMsgErr("Erreur lors du chargement de l'élève.");
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, [direction, ecoleId, id]);

  const majChamp = (index, event) => {
    const { name, value } = event.target;
    setEleve((ancienEleve) => majEleve([ancienEleve], 0, name, value)[0]);
    setErr((ancienneErreur) => ({ ...ancienneErreur, [name]: "", form: "" }));
  };

  const envoyer = async (event) => {
    event.preventDefault();
    setMsgOk("");
    setMsgErr("");

    const erreurs = validerEleve(eleve, null);
    setErr(erreurs);

    if (Object.keys(erreurs).length > 0) return;

    setSoumission(true);

    try {
      // La page envoie uniquement les champs du formulaire élève.
      // Le champ code_parent bénéficie du même debounce que l'ajout d'élève
      // via LigneEleve, et aucune information des parents n'est modifiée ici.
      const data = {
        ...eleve,
        users_id: userId,
        ecole_id: ecoleId,
        direction,
      };

      await axios.put(`${URL_API}/eleve/edit/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (eleve.type_eleve_id && eleve.annee_id) {
        await attribuerTypeEleve(creerContexteTypesEleves(), {
          eleveId: id,
          anneeId: eleve.annee_id,
          typeEleveId: eleve.type_eleve_id,
          attribuePar: userId,
          source: "modification_admin",
        });
      }

      setMsgOk("Élève modifié avec succès.");
      setTimeout(() => navigate("/secondaire/liste_eleve"), 600);
    } catch (error) {
      setMsgErr(messageErreurApi(error, "Erreur lors de la modification de l'élève."));
    } finally {
      setSoumission(false);
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-11 col-md-12">
              <div className="card mb-3">
                <div className="container d-flex flex-wrap gap-2 justify-content-between align-items-center">
                  <Link to="/secondaire/liste_eleve" className="btn text-white">
                    Liste élèves
                  </Link>
                  <p className="text-center mb-0 u-style-951c0e5f">Modifier élève</p>
                </div>
                <div className="card-body">
                  {chargement ? (
                    <p className="text-center">Chargement...</p>
                  ) : (
                    <form className="needs-validation" onSubmit={envoyer} noValidate>
                      <LigneEleve
                        eleve={eleve}
                        index={0}
                        classes={classes}
                        options={options}
                        annees={annees}
                        typesEleves={typesEleves}
                        afficherOption
                        err={err}
                        peutRetirer={false}
                        majChamp={majChamp}
                        retirer={() => {}}
                        rechercheParentActive
                      />

                      <div className="d-flex flex-wrap gap-2 mt-2">
                        <Link to="/secondaire/liste_eleve" className="btn">
                          Annuler
                        </Link>
                        <button className={`btn flex-grow-1 ${soumission ? "loading" : ""}`} type="submit" disabled={soumission}>
                          {soumission ? "Enregistrement..." : "Enregistrer les modifications"}
                        </button>
                      </div>

                      {msgOk && <p className="text-success text-center mt-2">{msgOk}</p>}
                      {msgErr && <p className="text-danger text-center mt-2">{msgErr}</p>}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModifierEleve;
