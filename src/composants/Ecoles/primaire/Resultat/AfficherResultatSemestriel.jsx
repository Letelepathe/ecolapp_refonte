import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ImgDrapeau from "../../../../static/images/drapeau.png";
import ImgSymbole from "../../../../static/images/symb.png";

function getValidIntegerFromQuery(param, defaultValue = 0) {
  const value = new URLSearchParams(window.location.search).get(param);
  const integerValue = parseInt(value, 10);
  return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const AfficherBulletinSemestriel = () => {
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
  const [periodes, setPeriodes] = useState([]);
  const [coursGroupes, setCoursGroupes] = useState({});
  const [totauxPeriode, setTotauxPeriode] = useState({});
  const [totauxExam, setTotauxExam] = useState({});
  const [totalSemestre, setTotalSemestre] = useState({});
  const [anneeScolaire, setAnneeScolaire] = useState('');
  const [pourcentageExam, setPourcentageExam] = useState(0);
  const [pourcentageTotal, setPourcentageTotal] = useState(0);
  const [errors, setErrors] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const eleve_id = getValidIntegerFromQuery('eleve_id');
  const semestre_id = getValidIntegerFromQuery('semestre_id');
  const annee_id = getValidIntegerFromQuery('annee_id');

  const bareme = 3;

  useEffect(() => {
    const fetchResultats = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cotegenerale/eleve/resultat/semestre/${semestre_id}/annee/${annee_id}/eleve/${eleve_id}/bareme/${bareme}/ecole/${ecole_id}/direction/${direction}`);

        if (response.data.status === 200) {
          setEleveInfo(response.data.eleve);
          setPeriodes(response.data.periodes);
          setCoursGroupes(response.data.cours_groupes);
          setTotauxPeriode(response.data.totaux_periode);
          setTotauxExam(response.data.totaux_exam);
          setTotalSemestre(response.data.total_semestre);
          setAnneeScolaire(response.data.annee_scolaire);
          setPourcentageExam(response.data.pourcentage_exam);
          setPourcentageTotal(response.data.pourcentage_total);

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

    checkSession();

    if (eleve_id && semestre_id) {
      fetchResultats();
    } else {
      setErrors("Paramètres manquants.");
    }
  }, [eleve_id, semestre_id, annee_id, ecole_id, direction]);

  if (errors) {
    return <div className="text-danger text-center">{errors}</div>;
  }

  if (!eleveInfo || !periodes || Object.keys(coursGroupes).length === 0) {
    return <div className="spinner"></div>;
  }

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
                <title>Bulletin du primaire</title>
            </Helmet>
            <div className="bulletin-eleve">
                <div className="bloc-bulletin">
                    <div className="header-bulletin">
                        <img src={ImgDrapeau} alt="Drapeau" />
                        <div className="pays-titre">
                            <h2>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h2>
                            <h2>MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE, primaire ET TECHNIQUE</h2>
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
                            <span>Matricule :</span> <span>{eleveInfo.matricule}</span>
                        </div>

                    </div>
                    <div className="bloc-2-bulletin">
                        <span>Bulletin de la {eleveInfo.classe.name.toUpperCase()} {eleveInfo.option.name.toUpperCase()} </span>
                        <span>Année scolaire {anneeScolaire.name} </span>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan="2">Branches</th>
                                    <th colSpan={periodes.length + 2}>Semestre {semestre_id}</th>
                                </tr>
                                <tr>
                                    {periodes.map((periode) =>
                  <th key={periode.id}>{periode.name}</th>
                  )}
                                    <th>Examen</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(coursGroupes).map(([ponderation, groupe]) =>
                <React.Fragment key={ponderation}>
                                        <tr className='bg-secondary text-white'>
                                            <td>Maxima</td>
                                            {periodes.map((periode) =>
                    <td key={periode.id}>{Math.floor(groupe.max / periodes.length)}</td>
                    )}
                                            <td>{groupe.max}</td>
                                            <td>{groupe.max * periodes.length}</td>
                                        </tr>
                                        {groupe.cours.map((cours) =>
                  <tr key={cours.id_cours}>
                                                <td>{cours.nom_cours}</td>
                                                {periodes.map((periode) =>
                    <td key={periode.id}>
                                                        {cours.notes[periode.id]?.note ?? 0}
                                                    </td>
                    )}
                                                <td>{Math.floor(totauxExam[cours.id_cours]?.note_obtenue ?? 0)}</td>
                                                <td>{Math.floor(cours.total_obtenu)}</td>
                                            </tr>
                  )}
                                    </React.Fragment>
                )}
                            </tbody>
                            <tfoot>
                                <tr className="total-row">
                                    <td>Total Général</td>
                                    {periodes.map((periode) =>
                  <td key={periode.id}>{Math.floor(totauxPeriode[periode.id]?.obtenu ?? 0)}</td>
                  )}
                                    <td>{Math.floor(totalSemestre.exam_obtenu)}</td>
                                    <td>{Math.floor(totalSemestre.obtenu + totalSemestre.exam_obtenu)}</td>
                                </tr>
                                <tr className="total-row">
                                    <td>Pourcentage</td>
                                    {periodes.map((periode) =>
                  <td key={periode.id}>
                                            {totauxPeriode[periode.id]?.max > 0 ?
                    (totauxPeriode[periode.id]?.obtenu / totauxPeriode[periode.id]?.max * 100).toFixed(2) + "%" :
                    "-"}
                                        </td>
                  )}
                                    <td>{pourcentageExam.toFixed(2)}%</td>
                                    <td>{pourcentageTotal.toFixed(2)}%</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="text-center py-2 mb-2 mt-2">
                    <button className="btn btn-primary hide-on-print" onClick={printBulletin}>
                        Imprimer
                    </button>
                </div>
                <div className="hide-on-print text-center mb-2 mt-2 py-2">
                    {authenticated ?
          <Link className="btn btn-warning text-white btn-sm u-style-420aab4e" to="/primaire/profil_user">
                            Retour
                        </Link> :

          <Link className="btn btn-warning text-white btn-sm u-style-420aab4e" to="/primaire">Quitter</Link>
          }
                </div>
            </div>
        </div>);

};

export default AfficherBulletinSemestriel;
