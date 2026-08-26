import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LigneEleve from "./LigneEleve";
import {
  creerContexteTypesEleves,
  attribuerTypeEleve,
  listerTypesEleves,
  obtenirTypeParDefaut,
} from "../../../../services/typesEleves/typesElevesService";
import {
  choisirOptionCompatibilite,
  obtenirConfigCycle,
} from "../../../../config/cyclesScolaires";
import {
  chargerRefsEleves,
  creerEleveVide,
  creerEleves,
  majEleve,
  retirerEleve,
  validerEleve
} from
  "./outilsAjoutEleves";

const AjoutEleves = ({
  BarreGauche,
  NavHaut,
  lienListe,
  cycle,
  rechercheParentActive = false,
}) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const userId = localStorage.getItem("userId");

  const [eleves, setEleves] = useState([creerEleveVide(ecoleId, direction)]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [typesEleves, setTypesEleves] = useState([]);
  const [errs, setErrs] = useState([]);
  const [msgOk, setMsgOk] = useState("");
  const [msgErr, setMsgErr] = useState("");
  const [charg, setCharg] = useState(false);
  const configCycle = obtenirConfigCycle(cycle);
  const ageMinimumEleve = configCycle.ageMinimum;
  const ageMaximumEleve = configCycle.ageMaximum;

  const anneeDef = () => {
    const anneeActive = annees.find((annee) => Number(annee.status) === 1) || annees[0];

    return anneeActive ? String(anneeActive.id) : "";
  };

  const creerLigneVide = () => ({
    ...creerEleveVide(ecoleId, direction),
    annee_id: anneeDef(),
    options_id:
      choisirOptionCompatibilite(options, cycle) || "",
    type_eleve_id:
      typesEleves.find((type) => type.estTypeParDefaut)?.id ||
      typesEleves[0]?.id ||
      "",
  });

  useEffect(() => {
    const chargerRefs = async () => {
      try {
        const contexteTypes = creerContexteTypesEleves();
        const [refs, types, typeParDefaut] = await Promise.all([
          chargerRefsEleves(ecoleId, direction),
          listerTypesEleves(contexteTypes),
          obtenirTypeParDefaut(contexteTypes),
        ]);
        console.log(refs, "ref ecoleId and Direction to ajoutEleves")
        setClasses(refs.classes);
        setOptions(refs.options);
        setAnnees(refs.annees);
        setTypesEleves(types);

        const anneeActive = refs.annees.find((annee) => Number(annee.status) === 1) || refs.annees[0];

        if (anneeActive) {
          const optionCompatibilite = choisirOptionCompatibilite(refs.options, cycle);
          setEleves((liste) =>
            liste.map((eleve) => ({
              ...eleve,
              annee_id: eleve.annee_id || String(anneeActive.id),
              options_id:
                eleve.options_id ||
                (optionCompatibilite ? String(optionCompatibilite) : ""),
              type_eleve_id: eleve.type_eleve_id || typeParDefaut?.id || "",
            }))
          );
        }
      } catch (erreurRefs) {
        setMsgErr("Erreur lors de la récupération des classes ou options.");
      }
    };

    chargerRefs();
  }, [ecoleId, direction]);

  const majChamp = (index, event) => {
    const { name, value } = event.target;

    setEleves((liste) => majEleve(liste, index, name, value));
    setErrs((listeErrs) =>
      listeErrs.map((err, rang) =>
        rang === index ? { ...err, [name]: "", form: "" } : err
      )
    );
  };

  const ajouterLigne = () => {
    setEleves((liste) => [...liste, creerLigneVide()]);
    setErrs((listeErrs) => [...listeErrs, {}]);
  };

  const retirer = (index) => {
    setEleves((liste) => retirerEleve(liste, index));
    setErrs((listeErrs) => retirerEleve(listeErrs, index));
  };

  const validerForm = () => {
    const erreurs = eleves.map((eleve) =>
      validerEleve(eleve, ageMinimumEleve, ageMaximumEleve)
    );
    setErrs(erreurs);

    return erreurs.every((erreur) => Object.keys(erreur).length === 0);
  };

  const envoyer = async (event) => {
    event.preventDefault();

    setMsgOk("");
    setMsgErr("");

    if (!validerForm()) return;

    setCharg(true);
    try {

      const resultats = await creerEleves({ eleves, userId, ecoleId, direction });
      const ajoutes = resultats.filter((resultat) => resultat.ok);
      const refus = resultats.filter((resultat) => !resultat.ok);

      if (ajoutes.length > 0) {
        const contexteTypes = creerContexteTypesEleves();
        await Promise.all(
          ajoutes
            .filter((resultat) => resultat.eleveId)
            .map((resultat) => {
              const eleve = eleves[resultat.index];
              const type = typesEleves.find(
                (element) => String(element.id) === String(eleve.type_eleve_id)
              );
              return attribuerTypeEleve(contexteTypes, {
                eleveId: resultat.eleveId,
                anneeId: eleve.annee_id,
                typeEleveId: type?.id,
                typeEleveNom: type?.nom,
                attribuePar: userId,
                source: "creation_admin",
                statut: "confirmee",
              });
            })
        );
        setMsgOk(
          `${ajoutes.length} élève${ajoutes.length > 1 ? "s" : ""} ` +
            `ajouté${ajoutes.length > 1 ? "s" : ""} avec succès. ` +
            "Ces lignes ne seront pas renvoyées."
        );
      }

      if (refus.length > 0) {
        const elevesRefuses = refus.map((resultat) => eleves[resultat.index]);
        const errsRefus = refus.map((resultat) => ({ form: resultat.msg }));

        setEleves(elevesRefuses);
        setErrs(errsRefus);
        // console.log(errsRefus , 'erreur refus')
        setMsgErr(
          `${refus.length} élève(s) non enregistré(s). Les lignes réussies ont été retirées; seules les lignes en échec restent à corriger ou réessayer.
          `
        );
      } else {
        setEleves([creerLigneVide()]);
        setErrs([]);
      }
    } catch (erreurAjout) {
      setMsgErr("Erreur de connexion au serveur.");
      setErrs(eleves.map(() => ({ form: "Envoi non confirmé. Vérifiez la connexion puis réessayez." })));
    } finally {
      setCharg(false);
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <BarreGauche />
      <div className="content">
        <NavHaut />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-11 col-md-12">
              <div className="card mb-3">
                <div className="container d-flex flex-wrap gap-2 justify-content-between align-items-center">
                  <Link to={lienListe} className="btn  text-white">Liste élèves</Link>
                  <p className="text-center mb-0 u-style-951c0e5f">
                    Ajouter Élève(s)
                  </p>
                  <button type="button" className="btn " onClick={ajouterLigne}>
                    + Ajouter une ligne
                  </button>
                </div>
                <div className="card-body">
                  <p className="text-center">Remplissez une ou plusieurs lignes puis envoyez tout en une fois.</p>
                  <form className="needs-validation" onSubmit={envoyer} noValidate>
                    {eleves.map((eleve, index) =>
                      <LigneEleve
                        key={index}
                        eleve={eleve}
                        index={index}
                        classes={classes}
                        options={options}
                        annees={annees}
                        typesEleves={typesEleves}
                        afficherOption={configCycle.utiliseOptions}
                        err={errs[index]}
                        peutRetirer={eleves.length > 1}
                        majChamp={majChamp}
                        retirer={retirer}
                        rechercheParentActive={rechercheParentActive} />

                    )}
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <button type="button" className="btn " onClick={ajouterLigne}>
                        + Ajouter un autre élève
                      </button>
                      <button
                        className={`${`btn  flex-grow-1 ${charg ? "loading" : ""}`} style-fr-0b1f4524`}
                        type="submit"
                        disabled={charg}>
                        {charg ? "Traitement en cours..." : `Ajouter ${eleves.length} élève(s)`}
                      </button>
                    </div>
                    {msgOk && <p className="text-success text-center mt-2">{msgOk}</p>}
                    {msgErr && <p className="text-danger text-center mt-2">{msgErr}</p>}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);

};

export default AjoutEleves;
