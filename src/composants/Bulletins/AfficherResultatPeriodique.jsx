import React, { useEffect, useState, useMemo } from "react";
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

const AfficherResultatPeriodique = () => {
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
    const [classe, setClasse] = useState('');
    const [periode, setPeriode] = useState('');
    const [anneeScolaire, setAnneeScolaire] = useState('');
    const [coursGroupes, setCoursGroupes] = useState([]);
    const [errors, setErrors] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const eleve_id = getValidIntegerFromQuery('eleve_id');
    const periode_id = getValidIntegerFromQuery('periode_id');
    const annee_id = getValidIntegerFromQuery('annee_id');

    const bareme = 2;

    useEffect(() => {
        const fetchResultats = async () => {
            try {
                const response = await axios.get(
                    `https://api.ecolapp.cd/api/cotegenerale/eleve/resultat/periode/${periode_id}/annee/${annee_id}/eleve/${eleve_id}/bareme/${bareme}/ecole/${ecole_id}/direction/${direction}`
                );

                if (response.data) {
                    setEleveInfo(response.data.eleve);
                    setClasse(response.data.classe);
                    setPeriode(response.data.periode);
                    setAnneeScolaire(response.data.annee_scolaire);
                    setCoursGroupes(response.data.cours_groupes || []);
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

        if (eleve_id && periode_id && annee_id) {
            fetchResultats();
        } else {
            setErrors("Paramètres manquants.");
        }
    }, [eleve_id, periode_id, annee_id, ecole_id, direction]);

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = "@media print { .no-print { display: none !important; } body { background: #fff; padding: 0; } }";
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const printBulletin = () => {
        window.print();
    };

    // Calculs statistiques de la période courante
    const stats = useMemo(() => {
        if (!coursGroupes || coursGroupes.length === 0) {
            return { totalGeneral: 0, totalObtenu: 0, pourcentage: "0.00" };
        }
        let totalGeneral = 0;
        let totalObtenu = 0;

        coursGroupes.forEach(groupe => {
            totalGeneral += parseFloat(groupe.max || 0);
            groupe.cours?.forEach(cours => {
                totalObtenu += parseFloat(cours.total_obtenu || 0);
            });
        });

        const pct = totalGeneral > 0 ? (totalObtenu / totalGeneral) * 100 : 0;
        return { totalGeneral, totalObtenu, pourcentage: pct.toFixed(2) };
    }, [coursGroupes]);

    if (errors) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{errors}</div>;
    }

    if (!eleveInfo || !periode || !ecole || !anneeScolaire) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement...</div>;
    }

    return (
        <div style={styles.pageWrapper}>
            <Helmet>
                <title>Bulletin Périodique du Secondaire</title>
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
                            <div style={styles.infoDotted}>{ecole.code_ecole || ""}</div>
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
                            <div style={styles.infoDotted}>{classe?.name?.toUpperCase()} {eleveInfo.option?.name?.toUpperCase()}</div>
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
                    Bulletin de la {classe?.name?.toUpperCase()} {eleveInfo.option?.name?.toUpperCase()} — {periode?.name?.toUpperCase()} — Année scolaire {anneeScolaire?.name}
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '350px'}}>Branches</th>
                            <th style={{...styles.th, width: '150px'}}>Maxima Fixés</th>
                            <th style={{...styles.th, width: '200px'}}>Points Obtenus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coursGroupes.map((groupe, idx) => (
                            <React.Fragment key={idx}>
                             
                                <tr style={styles.rowSubDomain}>
                                    <td style={{ ...styles.td, fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                        {groupe.nom_groupe?.toUpperCase()} (Maxima)
                                    </td>
                                    <td style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                        {groupe.max}
                                    </td>
                                    <td style={{ ...styles.tdCenter, backgroundColor: '#eee' }}></td>
                                </tr>
                                
                               
                                {groupe.cours?.map((cours) => (
                                    <tr key={cours.id_cours}>
                                        <td style={{...styles.td, paddingLeft: '15px'}}>{cours.nom_cours}</td>
                                        <td style={{...styles.tdCenter, color: '#999'}}>—</td>
                                        <td style={{...styles.tdCenter, fontWeight: 'bold'}}>{cours.total_obtenu ?? 0}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}

                        <tr>
                            <td style={{...styles.rowBoldLabel, backgroundColor: '#eee'}}>Total Général</td>
                            <td style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#eee' }}>{stats.totalGeneral}</td>
                            <td style={{ ...styles.tdCenter, fontWeight: 'bold', backgroundColor: '#eee' }}>{stats.totalObtenu}</td>
                        </tr>

                        <tr>
                            <td style={styles.rowBoldLabel}>Pourcentage</td>
                            <td colSpan="2" style={{...styles.tdCenter, fontWeight: 'bold', fontSize: '13px'}}>{stats.pourcentage}%</td>
                        </tr>

                      
                        {['Place / Nbre d\'élèves', 'Application', 'Conduite', 'Signature du Responsable'].map((label, idx) => (
                            <tr key={idx}>
                                <td style={styles.rowBoldLabel}>{label}</td>
                                <td style={styles.tdCenter}>
                                    {label === 'Place / Nbre d\'élèves' && `${eleveInfo.rang || "..."} e / ${classe?.total_eleves || "..."}`}
                                    {label === 'Application' && (eleveInfo.application || "................")}
                                    {label === 'Conduite' && (eleveInfo.conduite || "................")}
                                    {label === 'Signature du Responsable' && ""}
                                </td>
                                <td style={styles.tdBlackout}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- BAS DE PAGE STRUCTURE OFFICIELLE --- */}
                <div style={styles.footerSection}>
                    <div style={styles.footerRow}>- Observations du titulaire ou remarques de la direction : .....................................................................................................................................................</div>
                    
                    <div style={{textAlign: 'right', marginRight: '60px', marginTop: '15px'}}>
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
                    Imprimer la Période
                </button>
                <button
                    style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', fontSize: '12px', display: 'inline-flex', alignItems: 'center' }} 
                    onClick={() => navigate(-1)}
                >
                    Retour
                </button>
            </div>
        </div>
    );
};

export default AfficherResultatPeriodique;