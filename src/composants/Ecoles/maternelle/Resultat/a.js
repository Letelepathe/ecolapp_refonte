import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./Bulletin.css";

import ImgDrapeau from "../../../static/images/drapeau.png";
import ImgSymbole from "../../../static/images/symb.png";

// Function to get valid integer from URL query
function getValidIntegerFromQuery(param, defaultValue = 0) {
    const value = new URLSearchParams(window.location.search).get(param);
    const integerValue = parseInt(value, 10);
    return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const AfficherBulletinSemestriel = () => {
    const [eleveInfo, setEleveInfo] = useState(null);
    const [classe, setClasse] = useState('');
    const [semestre, setSemestre] = useState('');
    const [periodes, setPeriodes] = useState([]);
    const [coursCotes, setCoursCotes] = useState([]);
    const [totalGeneral, setTotalGeneral] = useState({});
    const [errors, setErrors] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const eleve_id = getValidIntegerFromQuery('eleve_id');
    const semestre_id = getValidIntegerFromQuery('semestre_id');
    const annee_id = getValidIntegerFromQuery('annee_id');

    // Fetching results on component mount
    useEffect(() => {
        const fetchResultats = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/cotegenerale/eleve/resultat/semestre/${semestre_id}/annee/${annee_id}/eleve/${eleve_id}/direction/3`);
                console.log(response.data); // Debugging response structure

                if (response.data) {
                    const { eleve, classe, semestre, periodes, coursCotes, totalGeneral } = response.data;
                    setEleveInfo(eleve);
                    setClasse(classe);
                    setSemestre(semestre);
                    setPeriodes(periodes || []);  // Default empty array for periods
                    setCoursCotes(coursCotes || []);  // Default empty array for courses
                    setTotalGeneral(totalGeneral);
                    setErrors('');
                } else {
                    setErrors("Les données récupérées ne sont pas valides.");
                }
            } catch (error) {
                setErrors("Erreur lors de la récupération des résultats.");
            }
        };

        const checkSession = () => {
            setAuthenticated(!!localStorage.getItem('userId'));
        };

        if (eleve_id && semestre_id) {
            fetchResultats();
        } else {
            setErrors("Paramètres manquants.");
        }
        checkSession();
    }, [eleve_id, semestre_id, annee_id]);

    // Handle error if there's any
    if (errors) {
        return <div className="text-danger text-center">{errors}</div>;
    }

    // Show loading state until data is fetched
    if (!eleveInfo || !semestre || !periodes.length || !coursCotes.length) {
        return <div className="spinner"></div>;
    }

    const printBulletin = () => {
        window.print();
    };

    return (
        <div>
            <Helmet>
                <title>ecolapp | Bulletin semestriel</title>
            </Helmet>
            <div className='bulletin-eleve'>
                <div className="bloc-bulletin">
                    {/* Header Section */}
                    <div className="header-bulletin">
                        <img src={ImgDrapeau} alt="Drapeau" />
                        <div className="pays-titre">
                            <h2>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h2>
                            <h2>MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECHNIQUE</h2>
                        </div>
                        <img src={ImgSymbole} alt="Symbole" />
                    </div>

                    {/* Information Section */}
                    <div className="table-info">
                        <div>
                            <strong>ÉLÈVE :</strong> {eleveInfo.name} {eleveInfo.last_name} <br />
                            <strong>SEXE :</strong> {eleveInfo.sexe} <br />
                            <strong>CLASSE :</strong> {classe.name} <br />
                        </div>
                    </div>

                    {/* Grades Table Section */}
                    <div className="table-container">
                        <h3>{semestre.name}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Branches</th>
                                    {periodes.length > 0 ? (
                                        periodes.map((periode) => (
                                            <th key={periode.id}>{periode.name}</th>
                                        ))
                                    ) : (
                                        <th colSpan="4">Aucune période disponible</th>
                                    )}
                                    <th>Examen</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coursCotes.length > 0 ? (
                                    coursCotes.map((cours) => (
                                        <tr key={cours.id_cours}>
                                            <td>{cours.nom_cours}</td>
                                            {periodes.map((periode) => (
                                                <td key={periode.id}>{cours.notes ? cours.notes[periode.id] || 0 : 0}</td>
                                            ))}
                                            <td>{cours.examen || 0}</td>
                                            <td>{cours.total_obtenu}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6">Aucun cours disponible</td></tr>
                                )}

                                {/* Total Row */}
                                <tr className="total-row">
                                    <td>Total Général</td>
                                    {periodes.map((periode) => (
                                        <td key={periode.id}>{totalGeneral[periode.id] || 0}</td>
                                    ))}
                                    <td>{totalGeneral.examen || 0}</td>
                                    <td>{totalGeneral.obtenu}</td>
                                </tr>

                                {/* Percentage Row */}
                                <tr className="total-row">
                                    <td>Pourcentage</td>
                                    {periodes.map((periode) => (
                                        <td key={periode.id}>
                                            {totalGeneral[periode.id]
                                                ? ((totalGeneral[periode.id] / totalGeneral.max) * 100).toFixed(2) + '%'
                                                : '-'}
                                        </td>
                                    ))}
                                    <td>
                                        {totalGeneral.examen
                                            ? ((totalGeneral.examen / totalGeneral.max) * 100).toFixed(2) + '%'
                                            : '-'}
                                    </td>
                                    <td>{((totalGeneral.obtenu / totalGeneral.max) * 100).toFixed(2)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Print and Navigation Buttons */}
                    <div className="text-center py-2 mb-2 mt-2">
                        <button className="btn btn-primary hide-on-print" onClick={printBulletin}>Imprimer</button>
                    </div>
                    <div className="hide-on-print text-center mb-2 mt-2 py-2">
                        <Link className="btn btn-warning text-white btn-sm" to={authenticated ? "/secondaire/profil_user" : "/secondaire"}>Retour</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AfficherBulletinSemestriel;
