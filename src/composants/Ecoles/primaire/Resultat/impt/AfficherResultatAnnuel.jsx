import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./Bulletin.css";

import ImgDrapeau from "../../../static/images/drapeau.png";
import ImgSymbole from "../../../static/images/symb.png";

function getValidIntegerFromQuery(param, defaultValue = 0) {
    const value = new URLSearchParams(window.location.search).get(param);
    const integerValue = parseInt(value, 10);
    return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const AfficherBulletinAnnuel = () => {
    const [eleveInfo, setEleveInfo] = useState(null);
    const [dataSemestres, setDataSemestres] = useState([]);
    const [coursGroupes, setCoursGroupes] = useState({});
    const [totalAnnuel, setTotalAnnuel] = useState({});
    const [pourcentageAnnuel, setPourcentageAnnuel] = useState(0);
    const [errors, setErrors] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const eleve_id = getValidIntegerFromQuery('eleve_id');
    const annee_id = getValidIntegerFromQuery('annee_id');
    const direction = getValidIntegerFromQuery('direction', 3);

    useEffect(() => {
        const fetchResultats = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/cotegenerale/eleve/resultat/annee/${annee_id}/eleve/${eleve_id}/direction/${direction}`
                );

                if (response.data.status === 200) {
                    setEleveInfo(response.data.eleve);
                    setDataSemestres(response.data.data_semestres);
                    setCoursGroupes(response.data.cours_groupes);
                    setTotalAnnuel(response.data.total_annuel);
                    setPourcentageAnnuel(response.data.pourcentage_annuel);
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

        if (eleve_id && annee_id) {
            fetchResultats();
        } else {
            setErrors("Paramètres manquants.");
        }
    }, [eleve_id, annee_id, direction]);

    if (errors) {
        return <div className="text-danger text-center">{errors}</div>;
    }

    if (!eleveInfo || !dataSemestres) {
        return <div className="spinner"></div>;
    }

    const printBulletin = () => {
        window.print();
    };

    return (
        <div>
            <Helmet>
                <title>Bulletin Annuel du Secondaire</title>
            </Helmet>
            <div className="bulletin-eleve">
                <div className="bloc-bulletin">
                    <div className="header-bulletin">
                        <img src={ImgDrapeau} alt="Drapeau" />
                        <div className="pays-titre">
                            <h2>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h2>
                            <h2>MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECHNIQUE</h2>
                        </div>
                        <img src={ImgSymbole} alt="Symbole" />
                    </div>

                    <div className="bloc-responsive">
                        <div className="table-info">
                            <div>
                                <strong>PROVINCE :</strong> Kinshasa <br /><br />
                                <strong>VILLE :</strong> Kinshasa <br /><br />
                                <strong>COMMUNE :</strong> Gombe <br /><br />
                                <strong>ÉCOLE :</strong> Institut de l'Avenir <br /><br />
                            </div>
                            <div>
                                <strong>ÉLÈVE :</strong> {eleveInfo.nom} {eleveInfo.prenom} <br /><br />
                                <strong>SEXE :</strong> {eleveInfo.sexe} <br /><br />
                                <strong>NE(E) A :</strong> Kinshasa, {eleveInfo.date_naissance}<br /><br />
                                <strong>CLASSE :</strong> {eleveInfo.classe}<br /><br />
                            </div>
                        </div>
                        <div className="bloc-2-bulletin">
                            <span>Matricule :</span> <span>{eleveInfo.matricule}</span>
                        </div>

                        <div className="bloc-2-bulletin">
                            <span>Classe : {eleveInfo.classe}</span>
                            <span>Option : {eleveInfo.option}</span>
                        </div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan="2">Branches</th>
                                    {Object.keys(dataSemestres).map((semestre_id) => (
                                        <th key={semestre_id} colSpan={dataSemestres[semestre_id].periodes.length + 2}>
                                            {dataSemestres[semestre_id].nom_semestre}
                                        </th>
                                    ))}
                                    <th rowSpan="2">Total Année</th>
                                </tr>
                                <tr>
                                    {Object.keys(dataSemestres).map((semestre_id) => (
                                        <React.Fragment key={semestre_id}>
                                            {dataSemestres[semestre_id].periodes.map((periode) => (
                                                <th key={periode.id}>{periode.name}</th>
                                            ))}
                                            <th>Examen</th>
                                            <th>Total</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(coursGroupes).map(([ponderation, groupe]) => (
                                    <React.Fragment key={ponderation}>
                                        <tr>
                                            <td>Max</td>
                                            {Object.keys(dataSemestres).map((semestre_id) => (
                                                <React.Fragment key={semestre_id}>
                                                    {dataSemestres[semestre_id].periodes.map((periode) => (
                                                        <td key={periode.id}>{groupe.max / dataSemestres[semestre_id].periodes.length}</td>
                                                    ))}
                                                    <td>{groupe.max}</td>
                                                    <td>{groupe.max}</td>
                                                </React.Fragment>
                                            ))}
                                            <td>{groupe.max * Object.keys(dataSemestres).length}</td>
                                        </tr>
                                        {groupe.cours.map((cours) => (
                                            <tr key={cours.id_cours}>
                                                <td>{cours.nom_cours}</td>
                                                {Object.keys(dataSemestres).map((semestre_id) => (
                                                    <React.Fragment key={semestre_id}>
                                                        {dataSemestres[semestre_id].periodes.map((periode) => (
                                                            <td key={periode.id}>
                                                                {cours.notes[periode.id]?.note ?? 0}
                                                            </td>
                                                        ))}
                                                        <td>{cours.total_obtenu - Object.values(cours.notes).reduce((sum, note) => sum + (note?.note ?? 0), 0)}</td>
                                                        <td>{cours.total_obtenu}</td>
                                                    </React.Fragment>
                                                ))}
                                                <td>{cours.total_obtenu * Object.keys(dataSemestres).length}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="total-row">
                                    <td>Total Général</td>
                                    {Object.keys(dataSemestres).map((semestre_id) => (
                                        <React.Fragment key={semestre_id}>
                                            {dataSemestres[semestre_id].periodes.map((periode) => (
                                                <td key={periode.id}>{dataSemestres[semestre_id].totaux_periode[periode.id]?.obtenu ?? 0}</td>
                                            ))}
                                            <td>{dataSemestres[semestre_id].total_semestre.exam_obtenu}</td>
                                            <td>{dataSemestres[semestre_id].total_semestre.obtenu + dataSemestres[semestre_id].total_semestre.exam_obtenu}</td>
                                        </React.Fragment>
                                    ))}
                                    <td>{totalAnnuel.obtenu + totalAnnuel.exam_obtenu}</td>
                                </tr>
                                <tr className="total-row">
                                    <td>Pourcentage</td>
                                    {Object.keys(dataSemestres).map((semestre_id) => (
                                        <React.Fragment key={semestre_id}>
                                            {dataSemestres[semestre_id].periodes.map((periode) => (
                                                <td key={periode.id}>
                                                    {dataSemestres[semestre_id].totaux_periode[periode.id]?.max > 0
                                                        ? ((dataSemestres[semestre_id].totaux_periode[periode.id]?.obtenu / dataSemestres[semestre_id].totaux_periode[periode.id]?.max) * 100).toFixed(2) + "%"
                                                        : "-"}
                                                </td>
                                            ))}
                                            <td>
                                                {dataSemestres[semestre_id].total_semestre.exam_max > 0
                                                    ? ((dataSemestres[semestre_id].total_semestre.exam_obtenu / dataSemestres[semestre_id].total_semestre.exam_max) * 100).toFixed(2) + "%"
                                                    : "-"}
                                            </td>
                                            <td>
                                                {(dataSemestres[semestre_id].total_semestre.max + dataSemestres[semestre_id].total_semestre.exam_max) > 0
                                                    ? ((dataSemestres[semestre_id].total_semestre.obtenu + dataSemestres[semestre_id].total_semestre.exam_obtenu) /
                                                    (dataSemestres[semestre_id].total_semestre.max + dataSemestres[semestre_id].total_semestre.exam_max) * 100).toFixed(2) + "%"
                                                    : "-"}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                    <td>{pourcentageAnnuel.toFixed(2)}%</td>
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
                    {authenticated ? (
                        <Link className="btn btn-warning text-white btn-sm" style={{ borderRadius: '10px' }} to="/secondaire/profil_user">
                            Retour
                        </Link>
                    ) : (
                        <Link className="btn btn-warning text-white btn-sm" style={{ borderRadius: '10px' }} to="/secondaire">Quitter</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AfficherBulletinAnnuel;
