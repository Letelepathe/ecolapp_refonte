import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import LigneEleve from "./LigneEleve";
import {
  URL_API,
  chargerRefsEleves,
  creerEleveVide,
  majEleve,
  validerEleve,
} from "./outilsAjoutEleves";
import {
  attribuerTypeEleve,
  creerContexteTypesEleves,
  listerTypesEleves,
} from "../../../../services/typesEleves/typesElevesService";
import { obtenirDirectionCycle } from "../../../../services/cycles/cyclesScolaires";

const extraireMessageErreur = (error) => {
  const data = error?.response?.data;
  const validations = data?.errorsList || data?.errors;
  if (validations) return Object.values(validations).flat().join(" ");
  return data?.message || data?.error_msg || "Erreur lors de la modification de l'élève.";
};

const normaliserEleve = (eleve, ecoleId, direction, codeParent, typeParDefautId) => ({
  ...creerEleveVide(ecoleId, direction),
  ...eleve,
  classes_id: String(eleve.classes_id || eleve.classe?.id || ""),
  options_id: String(eleve.options_id || eleve.option?.id || ""),
  annee_id: String(eleve.annee_id || eleve.annee?.id || ""),
  code_parent: eleve.code_parent || codeParent || "",
  type_eleve_id: String(
    eleve.type_eleve_id || eleve.type_eleve?.id || eleve.typeEleve?.id || typeParDefautId || ""
  ),
});

const ModifierEleveCycle = ({ cycle, SidebarLeft, NavbarTop }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ecoleId = localStorage.getItem("ecole_id");
  const userId = localStorage.getItem("userId");
  const direction = obtenirDirectionCycle(cycle);
  const routeListe = `/${cycle}/liste_eleve`;

  const [eleve, setEleve] = useState(() => creerEleveVide(ecoleId, direction));
  const [references, setReferences] = useState({ classes: [], options: [], annees: [], types: [] });
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState({ type: "", texte: "" });
  const [chargement, setChargement] = useState(true);
  const [soumission, setSoumission] = useState(false);

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      try {
        const contexteTypes = creerContexteTypesEleves();
        const [refs, responseEleve, types] = await Promise.all([
          chargerRefsEleves(ecoleId, direction),
          axios.get(`${URL_API}/eleve/${id}`),
          listerTypesEleves(contexteTypes),
        ]);
        const eleveApi = responseEleve.data?.eleve;
        if (!eleveApi) throw new Error("Élève introuvable");

        let codeParent = "";
        if (eleveApi.parent_id) {
          try {
            const parent = await axios.get(`${URL_API}/parents/${eleveApi.parent_id}`);
            codeParent = parent.data?.parent?.code || "";
          } catch { codeParent = ""; }
        }

        const typeParDefaut = types.find((type) => type.estTypeParDefaut) || types[0];
        setReferences({ ...refs, types });
        setEleve(normaliserEleve(eleveApi, ecoleId, direction, codeParent, typeParDefaut?.id));
      } catch (error) {
        setMessage({ type: "danger", texte: extraireMessageErreur(error) });
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [direction, ecoleId, id]);

  const changerChamp = (_index, event) => {
    const { name, value } = event.target;
    setEleve((courant) => majEleve([courant], 0, name, value)[0]);
    setErreurs((courantes) => ({ ...courantes, [name]: "", form: "" }));
  };

  const envoyer = async (event) => {
    event.preventDefault();
    setMessage({ type: "", texte: "" });
    const prochainesErreurs = validerEleve(eleve, null);
    setErreurs(prochainesErreurs);
    if (Object.keys(prochainesErreurs).length) return;

    setSoumission(true);
    try {
      await axios.put(`${URL_API}/eleve/edit/${id}`, {
        ...eleve, users_id: userId, ecole_id: ecoleId, direction,
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
      setMessage({ type: "success", texte: "Élève modifié avec succès." });
      setTimeout(() => navigate(routeListe), 600);
    } catch (error) {
      setMessage({ type: "danger", texte: extraireMessageErreur(error) });
    } finally {
      setSoumission(false);
    }
  };

  return <div className="container-fluid position-relative d-flex p-0">
    <SidebarLeft />
    <div className="content">
      <NavbarTop />
      <div className="container py-4">
        <section className="section d-flex justify-content-center">
          <div className="col-lg-11 col-12 card"><div className="card-body">
            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
              <Link to={routeListe} className="btn text-white">Liste des élèves</Link>
              <h6 className="mb-0">Modifier l'élève</h6>
            </div>
            {chargement ? <p className="text-center">Chargement…</p> : <form onSubmit={envoyer} noValidate>
              <LigneEleve
                eleve={eleve} index={0}
                classes={references.classes} options={references.options} annees={references.annees}
                typesEleves={references.types} afficherOption
                err={erreurs} peutRetirer={false} majChamp={changerChamp} retirer={() => {}}
                rechercheParentActive
              />
              {!references.options.length && <div className="alert alert-warning mt-3">
                Configurez d'abord une option pour ce cycle avant de modifier cet élève.
              </div>}
              <div className="d-flex flex-wrap gap-2 mt-3">
                <Link to={routeListe} className="btn">Annuler</Link>
                <button className="btn flex-grow-1" disabled={soumission || !references.options.length}>
                  {soumission ? "Enregistrement…" : "Enregistrer les modifications"}
                </button>
              </div>
              {message.texte && <div className={`alert alert-${message.type} mt-3`}>{message.texte}</div>}
            </form>}
          </div></div>
        </section>
      </div>
    </div>
  </div>;
};

export default ModifierEleveCycle;
