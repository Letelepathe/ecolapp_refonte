import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ImgDrapeau from '../../../../static/images/drapeau.png';
import ImgSymbole from '../../../../static/images/symb.png';

function getValidIntegerFromQuery(param, defaultValue = 0) {
  const value = new URLSearchParams(window.location.search).get(param);
  const integerValue = parseInt(value, 10);
  return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const AfficherResultatPeriodique = () => {
  const [ecole, setEcole] = useState(null);
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  useEffect(() => {
    const fetchInfoEcole = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/ecole/ecole_id/${ecole_id}`);
        setEcole(response.data.ecole);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations:", error);
      }
    };

    fetchInfoEcole();
  }, [ecole_id]);



  const [eleveInfo, setEleveInfo] = useState(null);
  const [classe, setClasse] = useState('');
  const [periode, setPeriode] = useState('');
  const [anneeScolaire, setAnneeScolaire] = useState('');
  const [coursGroupes, setCoursGroupes] = useState([]);
  const [errors, setErrors] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const eleve_id = getValidIntegerFromQuery('eleve_id', 0);
  const periode_id = getValidIntegerFromQuery('periode_id', 0);
  const annee_id = getValidIntegerFromQuery('annee_id', 0);

  const bareme = 3;

  useEffect(() => {
    const fetchResultats = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cotegenerale/eleve/resultat/periode/${periode_id}/annee/${annee_id}/eleve/${eleve_id}/bareme/${bareme}/ecole/${ecole_id}/direction/${direction}`);
        if (response.data) {
          const { eleve, classe, periode, annee_scolaire, cours_groupes } = response.data;
          setEleveInfo(eleve);
          setClasse(classe);
          setPeriode(periode);
          setAnneeScolaire(annee_scolaire);
          setCoursGroupes(cours_groupes);
          setErrors('');
        } else {
          setErrors("Les données récupérées ne sont pas valides.");
        }
      } catch (error) {
        setErrors("Erreur lors de la récupération des résultats.");
      }
    };

    const checkSession = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    };

    if (eleve_id && periode_id && annee_id) {
      fetchResultats();
    } else {
      setErrors("Paramètres manquants.");
    }

    checkSession();
  }, [eleve_id, periode_id, annee_id, ecole_id, direction]);

  if (errors) {
    return <div className="text-danger text-center">{errors}</div>;
  }

  if (!eleveInfo || !periode || !anneeScolaire || coursGroupes.length === 0) {
    return <div className="spinner"></div>;
  }

  const totalGeneral = coursGroupes.reduce((sum, groupe) => sum + parseFloat(groupe.max), 0);
  const totalObtenu = coursGroupes.reduce((sum, groupe) => sum + groupe.cours.reduce((acc, cours) => acc + parseFloat(cours.total_obtenu || 0), 0), 0);
  const pourcentage = (totalObtenu / totalGeneral * 100).toFixed(2);

  const printBulletin = () => {
    window.print();
  };

  if (!ecole) {
    return (
      <div className="spinner"></div>);

  }

  return (
    <div>
            <Helmet>
                <title>ecolapp | résultat maternelle</title>
            </Helmet>
            <div className='bulletin-eleve'>
                <div className="bloc-bulletin">

                    <div className="header-bulletin">
                        <img src={ImgDrapeau} alt="Drapeau" />
                        <div className="pays-titre">
                            <h2>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h2>
                            <h2>MINISTÈRE DE L'ENSEIGNEMENT maternelle, maternelle ET TECHNIQUE</h2>
                        </div>
                        <img src={ImgSymbole} alt="Symbole" />
                    </div>

                    <div className="bloc-responsive">
                        <div className="table-info">
                            <div>
                                <strong>PROVINCE :</strong> {ecole.province_educationnelle.province.name.toUpperCase()} <br /><br />
                                <strong>VILLE :</strong> {ecole.ville.toUpperCase()} <br /><br />
                                <strong>COMMUNE :</strong> {ecole.commune.toUpperCase()} <br /><br />
                                <strong>ÉCOLE :</strong> {ecole.name.toUpperCase()} <br /><br />
                            </div>
                            <div>
                                <strong>ÉLÈVE :</strong> {eleveInfo.name.toUpperCase()} {eleveInfo.last_name.toUpperCase()} {eleveInfo.first_name.toUpperCase()} <br /><br />
                                <strong>SEXE :</strong> {eleveInfo.sexe.toUpperCase()} <br /><br />
                                <strong>NE(E) A :</strong> {eleveInfo.lieu_de_naissance.toUpperCase()}, {eleveInfo.date_naissance}<br /><br />
                                <strong>CLASSE :</strong> {eleveInfo.classe.name.toUpperCase()}<br /><br />
                            </div>
                        </div>
                        <div className="bloc-2-bulletin">
                            <span>Matricule :</span>  <span>{eleveInfo.matricule}</span>
                        </div>

                    </div>
                    <div className="bloc-2-bulletin">
                        <span>Bulletin de la {classe.name.toUpperCase()} {eleveInfo.option.name.toUpperCase()} </span>
                        <span>Année scolaire {anneeScolaire.name} </span>
                    </div>

                    <div className="table-container">
                        <table>
                            <tr>
                                <th rowspan="2">Branches</th>
                                <th colspan="2">Semestre {periode.semestre_id}</th>
                            </tr>
                            <tr>
                                <th>{periode.name}</th>
                            </tr>
                            {coursGroupes.map((groupe, index) =>
              <React.Fragment key={index}>
                                    <tr className='bg-secondary text-white'>
                                        <td>Maxima</td>
                                        <td>{groupe.max}</td>
                                    </tr>
                                    {groupe.cours.map((cours) =>
                <tr key={cours.id_cours}>
                                            <td>{cours.nom_cours}</td>
                                            <td>{cours.total_obtenu || 0}</td>
                                        </tr>
                )}
                                </React.Fragment>
              )}

                            <tr className="total-row">
                                <td>Totaux généraux</td>
                                <td>{totalGeneral}</td>
                            </tr>
                            <tr className="total-row">
                                <td>Totaux obtenus</td>
                                <td>{totalObtenu}</td>
                            </tr>
                            <tr className="total-row">
                                <td>Pourcentage</td>
                                <td>{pourcentage}%</td>
                            </tr>
                        </table>
                    </div>

                </div>
            </div>
            <div className="text-center py-2 mb-2 mt-2">
                <button className="btn btn-primary hide-on-print" onClick={printBulletin}>
                    Imprimer
                </button>
            </div>
            <div className="hide-on-print text-center mb-2 mt-2 py-2">
                    {authenticated ?
        <Link className="btn btn-warning text-white btn-sm u-style-420aab4e" to="/maternelle/profil_user">
                            Retour
                        </Link> :

        <Link className="btn btn-warning text-white btn-sm u-style-420aab4e" to="/maternelle">Quitter</Link>
        }
            </div>
        </div>);

};

export default AfficherResultatPeriodique;
