import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";


import styles from "./styles";

import drapeau from "../../../../assets/drapeau.png";
import embleme from "../../../../assets/embleme.png";

function getValidIntegerFromQuery(param, defaultValue = 0) {
    const value = new URLSearchParams(window.location.search).get(param);
    const integerValue = parseInt(value, 10);
    return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const AfficherBulletinSemestriel = () => {
    const [ecole, setEcole] = useState(null);
    const ecole_id = localStorage.getItem('ecole_id');
    const direction = localStorage.getItem('direction');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfoEcole = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/ecole/ecole_id/${ecole_id}`);
                setEcole(response.data.ecole);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations:", error);
            }
        };
  
        if (ecole_id) fetchInfoEcole();
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
    const bareme = 2;

    useEffect(() => {
        const fetchResultats = async () => {
            try {
                const response = await axios.get(
                    `https://api.ecolapp.cd/api/cotegenerale/eleve/resultat/semestre/${semestre_id}/annee/${annee_id}/eleve/${eleve_id}/bareme/${bareme}/ecole/${ecole_id}/direction/${direction}`
                );

                if (response.data.status === 200) {
                    const { data } = response;
                    setEleveInfo(data.eleve);
                    setPeriodes(data.periodes);
                    setCoursGroupes(data.cours_groupes);
                    setTotauxPeriode(data.totaux_periode);
                    setTotauxExam(data.totaux_exam);
                    setTotalSemestre(data.total_semestre);
                    setAnneeScolaire(data.annee_scolaire);
                    setPourcentageExam(data.pourcentage_exam);
                    setPourcentageTotal(data.pourcentage_total);
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
            setAuthenticated(!!userId);
        };

        checkSession();

        if (eleve_id && semestre_id && annee_id) {
            fetchResultats();
        } else {
            setErrors("Paramètres manquants.");
        }
    }, [eleve_id, semestre_id, annee_id, ecole_id, direction]);

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = "@media print { .no-print { display: none !important; } body { background: #fff; padding: 0; } }";
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    if (errors) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{errors}</div>;
    }

    if (!eleveInfo || !periodes || Object.keys(coursGroupes).length === 0 || !ecole) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement du bulletin semestriel...</div>;
    }

    const printBulletin = () => {
        window.print();
    };

    return (
        <div style={styles.pageWrapper}>
            <Helmet>
                <title>Bulletin Semestriel du Secondaire</title>
            </Helmet>

            <div style={styles.container}>
                
             
                <div style={styles.header}>
                    <img src={drapeau} alt="Drapeau" style={styles.logo} />
                    <div style={styles.headerTextContainer}>
                        <div style={styles.titleCountry}>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</div>
                        <div style={styles.titleMinistry}>MINISTÈRE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECHNIQUE</div>
                    </div>
                    <img src={embleme} alt="Emblème" style={styles.logo} />
                </div>

                <div style={styles.idGrid}>
                    <div style={styles.idLabel}>N° ID</div>
                    {[...Array(26)].map((_, i) => (
                        <div key={i} style={styles.idCell}></div>
                    ))}
                </div>

                <div style={styles.infoSection}>
                    <div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>PROVINCE :</span>
                            <div style={styles.infoDotted}>{ecole.province_educationnelle?.province?.name?.toUpperCase()}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>VILLE :</span>
                            <div style={styles.infoDotted}>{ecole.ville?.toUpperCase()}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>COMMUNE / TER (1) :</span>
                            <div style={styles.infoDotted}>{ecole.commune?.toUpperCase()}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>ÉCOLE :</span>
                            <div style={styles.infoDotted}>{ecole.name?.toUpperCase()}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Code :</span>
                            <div style={styles.infoDotted}></div>
                        </div>
                    </div>
                    <div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>ÉLÈVE :</span>
                            <div style={styles.infoDotted}>{eleveInfo.name?.toUpperCase()} {eleveInfo.last_name?.toUpperCase()} {eleveInfo.first_name?.toUpperCase()}</div>
                            <span style={{...styles.infoLabel, marginLeft: '10px'}}>SEXE :</span>
                            <div style={{...styles.infoDotted, width: '30px', flex: 'none', textAlign: 'center'}}>{eleveInfo.sexe?.toUpperCase()}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>NÉ(E) À :</span>
                            <div style={styles.infoDotted}>{eleveInfo.lieu_de_naissance?.toUpperCase()}</div>
                            <span style={{...styles.infoLabel, marginLeft: '10px'}}>LE :</span>
                            <div style={{...styles.infoDotted, width: '70px', flex: 'none', textAlign: 'center'}}>{eleveInfo.date_naissance}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>CLASSE :</span>
                            <div style={styles.infoDotted}>{eleveInfo.classe?.name?.toUpperCase()} {eleveInfo.option?.name?.toUpperCase()}</div>
                        </div>
                        <div style={{...styles.infoRow, marginTop: '12px'}}>
                            <span style={styles.infoLabel}>N° Perm.</span>
                            <div style={{...styles.idGrid, flex: 1, marginBottom: 0, marginLeft: '5px'}}>
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} style={{...styles.idCell, textAlign: 'center', lineHeight: '20px'}}>{eleveInfo.matricule ? eleveInfo.matricule[i] : ''}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

               
                <div style={styles.bulletinTitleBox}>
                    Bulletin du Semestre {semestre_id} — {eleveInfo.classe?.name?.toUpperCase()} {eleveInfo.option?.name?.toUpperCase()} — Année scolaire {anneeScolaire?.name}
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th rowSpan="3" style={{...styles.th, width: '220px'}}>Branches</th>
                            <th colSpan={periodes.length + 3} style={styles.th}>
                                RÉSULTATS DU SEMESTRE {semestre_id}
                            </th>
                            <th rowSpan="3" style={{...styles.th, width: '40px', backgroundColor: '#000'}}></th>
                            <th colSpan="2" style={styles.th}>Examen de Repêchage</th>
                        </tr>
                        <tr>
                            <th rowSpan="2" style={styles.thSub}>Max</th>
                            <th colSpan={periodes.length} style={styles.thSub}>Travaux Journaliers</th>
                            <th rowSpan="2" style={styles.thSub}>Examen</th>
                            <th rowSpan="2" style={styles.thSub}>Tot</th>
                            <th style={{...styles.thSub, backgroundColor: '#000'}}></th>
                            <th style={styles.thSub}>%</th>
                            <th style={styles.thSub}>Sign. Prof</th>
                        </tr>
                        <tr>
                            {periodes.map((periode) => (
                                <th key={periode.id} style={styles.thSub}>{periode.name}</th>
                            ))}
                            <th style={{backgroundColor: '#000'}}></th>
                            <th style={{backgroundColor: '#fff'}}></th>
                            <th style={{backgroundColor: '#fff'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(coursGroupes).map(([ponderation, groupe]) => (
                            <React.Fragment key={ponderation}>
                              
                                <tr style={styles.rowSubDomain}>
                                    <td style={{ ...styles.td, fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>Maxima</td>
                                    <td style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>{groupe.max}</td>
                                    {periodes.map((periode) => (
                                        <td key={periode.id} style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                            {Math.floor(groupe.max / periodes.length)}
                                        </td>
                                    ))}
                                    <td style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>{groupe.max}</td>
                                    <td style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>{groupe.max * periodes.length}</td>
                                    <td style={styles.tdBlackout}></td>
                                    <td style={styles.tdBlackout}></td>
                                    <td style={{...styles.tdCenter, backgroundColor: '#f2f2f2'}}></td>
                                    <td style={{...styles.tdCenter, backgroundColor: '#f2f2f2'}}></td>
                                </tr>
                                
                               
                                {groupe.cours.map((cours) => {
                                    const totalNotesJournal = Object.values(cours.notes).reduce((sum, n) => sum + (n?.note ?? 0), 0);
                                    const examNote = Math.floor(totauxExam[cours.id_cours]?.note_obtenue ?? 0);
                                    return (
                                        <tr key={cours.id_cours}>
                                            <td style={styles.td}>{cours.nom_cours}</td>
                                            <td style={styles.tdCenter}>{groupe.max}</td>
                                            {periodes.map((periode) => (
                                                <td key={periode.id} style={styles.tdCenter}>
                                                    {cours.notes[periode.id]?.note ?? 0}
                                                </td>
                                            ))}
                                            <td style={styles.tdCenter}>{examNote}</td>
                                            <td style={styles.tdCenter}>{Math.floor(cours.total_obtenu)}</td>
                                            <td style={styles.tdBlackout}></td>
                                            <td style={styles.tdBlackout}></td>
                                            <td style={styles.tdCenter}></td>
                                            <td style={styles.tdCenter}></td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}

                    
                        <tr>
                            <td style={{...styles.rowBoldLabel, backgroundColor: '#eee'}}>Total Général</td>
                            <td style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#eee' }}>-</td>
                            {periodes.map((periode) => (
                                <td key={periode.id} style={{ ...styles.tdCenter, fontWeight: 'bold' }}>
                                    {Math.floor(totauxPeriode[periode.id]?.obtenu ?? 0)}
                                </td>
                            ))}
                            <td style={{ ...styles.tdCenter, fontWeight: 'bold' }}>{Math.floor(totalSemestre.exam_obtenu ?? 0)}</td>
                            <td style={{ ...styles.tdCenter, fontWeight: 'bold' }}>{Math.floor((totalSemestre.obtenu ?? 0) + (totalSemestre.exam_obtenu ?? 0))}</td>
                            <td style={styles.tdBlackout}></td>
                            <td style={styles.tdBlackout}></td>
                            <td style={styles.tdCenter}></td>
                            <td style={styles.tdCenter}></td>
                        </tr>

                       
                        <tr>
                            <td style={styles.rowBoldLabel}>Pourcentage</td>
                            <td style={styles.tdCenter}>-</td>
                            {periodes.map((periode) => (
                                <td key={periode.id} style={styles.tdCenter}>
                                    {totauxPeriode[periode.id]?.max > 0
                                        ? ((totauxPeriode[periode.id]?.obtenu / totauxPeriode[periode.id]?.max) * 100).toFixed(2) + "%"
                                        : "-"}
                                </td>
                            ))}
                            <td style={styles.tdCenter}>{pourcentageExam.toFixed(2)}%</td>
                            <td style={styles.tdCenter}>{pourcentageTotal.toFixed(2)}%</td>
                            <td style={styles.tdBlackout}></td>
                            <td style={styles.tdBlackout}></td>
                            <td style={styles.tdCenter}></td>
                            <td style={styles.tdCenter}></td>
                        </tr>

                      
                        {['Place/Nbre d\'élèves', 'Application', 'Conduite', 'Signature du Responsable'].map((label, idx) => (
                            <tr key={idx}>
                                <td style={styles.rowBoldLabel}>{label}</td>
                                <td style={styles.tdBlackout}></td>
                                {periodes.map((p) => (
                                    <td key={p.id} style={styles.tdCenter}></td>
                                ))}
                                <td style={styles.tdBlackout}></td>
                                <td style={styles.tdCenter}></td>
                                <td style={styles.tdBlackout}></td>
                                <td style={styles.tdBlackout}></td>

                                {idx === 0 ? (
                                    <td colSpan="2" rowSpan="4" style={{...styles.td, verticalAlign: 'top', padding: '5px'}}>
                                        <div style={{fontWeight: 'bold', marginBottom: '4px'}}>• PASSE (1)</div>
                                        <div style={{fontWeight: 'bold', marginBottom: '8px'}}>• DOUBLE (1)</div>
                                        <div style={{fontSize: '9px'}}>LE ...... / ...... / 20...</div>
                                        <div style={{marginTop: '10px', textAlign: 'center', fontSize: '9px'}}>
                                            Le chef d'établissement<br/>Sceau de l'école
                                        </div>
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </tbody>
                </table>

              
                <div style={styles.footerSection}>
                    <div style={styles.footerRow}>- L'élève ne pourra passer dans la classe supérieure s'il n'a subi avec succès un examen de repêchage en ..................................................................................................................................................... (1)</div>
                    <div style={styles.footerRow}>- L'élève passe dans la classe supérieure (1)</div>
                    <div style={styles.footerRow}>- L'élève double la classe (1)</div>
                    
                    <div style={{textAlign: 'right', marginRight: '60px', marginTop: '5px'}}>
                        Fait à ..................................................... le ............ / ............ / 20...
                    </div>

                    <div style={styles.signaturesContainer}>
                        <div style={styles.signatureBlock}>
                            <div style={{fontWeight: 'bold'}}>Signature de l'élève</div>
                            <div style={styles.signatureSpace}></div>
                        </div>
                        <div style={styles.signatureBlock}>
                            <div style={{fontWeight: 'bold'}}>Sceau de l'école</div>
                            <div style={styles.signatureSpace}></div>
                        </div>
                        <div style={styles.signatureBlock}>
                            <div style={{fontWeight: 'bold'}}>Le Chef d'Établissement</div>
                            <div style={{...styles.signatureSpace, fontSize: '9px', fontStyle: 'italic', color: '#555'}}>Nom et Signature</div>
                        </div>
                    </div>

                    <div style={styles.noteImportante}>
                        (1) Biffer la mention inutile <br/>
                        <strong>Note importante :</strong> Le Bulletin est sans valeur s'il est raturé ou surchargé.
                        <span style={{float: 'right', fontSize: '8px'}}>IGE/P.S./010</span>
                    </div>
                </div>
            </div>

            <div className="no-print" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                <button 
                    onClick={printBulletin} 
                    style={{ backgroundColor: '#0d6efd', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Imprimer
                </button>
                {authenticated ? (
                    <button
                        style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', fontSize: '12px', display: 'inline-flex', alignItems: 'center' }} 
                        onClick={() => navigate(-1)}
                    >
                        Retour
                    </button>
                ) : (
                    <Link 
                        style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', fontSize: '12px', display: 'inline-flex', alignItems: 'center' }} 
                        to="/secondaire"
                    >
                        Quitter
                    </Link>
                )}
            </div>
        </div>
    );
};

export default AfficherBulletinSemestriel;