import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LigneEleve from "./LigneEleve";
import {
  chargerRefsEleves,
  creerEleveVide,
  creerEleves,
  majEleve,
  retirerEleve,
  validerEleve } from
"./outilsAjoutEleves";

const AjoutEleves = ({ BarreGauche, NavHaut, lienListe }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const userId = localStorage.getItem("userId");

  const [eleves, setEleves] = useState([creerEleveVide(ecoleId, direction)]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [errs, setErrs] = useState([]);
  const [msgOk, setMsgOk] = useState("");
  const [msgErr, setMsgErr] = useState("");
  const [charg, setCharg] = useState(false);

  const anneeDef = () => {
    const anneeActive = annees.find((annee) => Number(annee.status) === 1) || annees[0];

    return anneeActive ? String(anneeActive.id) : "";
  };

  const creerLigneVide = () => ({
    ...creerEleveVide(ecoleId, direction),
    annee_id: anneeDef()
  });

  useEffect(() => {
    const chargerRefs = async () => {
      try {
        const refs = await chargerRefsEleves(ecoleId, direction);
        setClasses(refs.classes);
        setOptions(refs.options);
        setAnnees(refs.annees);

        const anneeActive = refs.annees.find((annee) => Number(annee.status) === 1) || refs.annees[0];

        if (anneeActive) {
          setEleves((liste) =>
          liste.map((eleve) => ({
            ...eleve,
            annee_id: eleve.annee_id || String(anneeActive.id)
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
    const erreurs = eleves.map(validerEleve);
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
        setMsgOk(`${ajoutes.length} élève(s) ajouté(s) avec succès. Ces lignes ne seront pas renvoyées.`);
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
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <BarreGauche />
      <div className="content">
        <NavHaut />
        <div className="container">
          <section className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-11 col-md-12">
              <div className="card mb-3">
                <div className="container d-flex flex-wrap gap-2 justify-content-between align-items-center">
                  <Link to={lienListe} className="btn btn-warning text-white">Liste élèves</Link>
                  <p className="text-center mb-0 u-style-951c0e5f">
                    Ajouter Élève(s)
                  </p>
                  <button type="button" className="btn btn-outline-primary" onClick={ajouterLigne}>
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
                      err={errs[index]}
                      peutRetirer={eleves.length > 1}
                      majChamp={majChamp}
                      retirer={retirer} />

                    )}

                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <button type="button" className="btn btn-outline-primary" onClick={ajouterLigne}>
                        + Ajouter un autre élève
                      </button>
                      <button
                        className={`btn btn-primary flex-grow-1 ${charg ? "loading" : ""}`}
                        type="submit"
                        disabled={charg}
                        style={{ backgroundColor: "#1769ff", border: "none", padding: "10px", borderRadius: "5px" }}>

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
