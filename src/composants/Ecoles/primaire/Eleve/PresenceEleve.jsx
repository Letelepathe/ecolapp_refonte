import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import SidebarLeft from "../Users/Profil/SidebarLeft";
import NavbarTop from "../Users/Profil/NavbarTop";

const PresenceEleve = () => {
    const ecole_id = localStorage.getItem('ecole_id');
    const direction = localStorage.getItem('direction');

    const { id_classe, id_eleve } = useParams();  
    const [details, setDetails] = useState(null);  // Détails des présences et statistiques
    const [error, setError] = useState("");
    const [filter, setFilter] = useState({ type: "mois", value: "" });
    const [eleve, setEleve] = useState(null);  

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/presences/ecole/${ecole_id}/direction/${direction}/eleve/${id_eleve}?filter=${JSON.stringify(filter)}`)
                if (response.data.status === 200) {
                    setDetails(response.data);  // Mettre à jour les détails des présences
                } else {
                    setError(response.data.error_msg); 
                }
            } catch (error) { 
                setError("Erreur lors de la récupération des détails de l'élève.");
            }
        };

        const fetchEleveById = async () => {
            try {
              const response = await axios.get(`https://api.ecolapp.cd/api/eleve/${id_eleve}`);
              setEleve(response.data.eleve);
            } catch (error) {
              setError("Erreur lors de la récupération des informations de l'élève.");
            }
          };

        fetchDetails();
        fetchEleveById();
    }, [id_eleve, filter, ecole_id, direction]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    if (error) return <div>{error}</div>;

    return (
        <div>
            <Helmet>
                <title>ecolapp | détails élève</title>
            </Helmet>
            <SidebarLeft />
            <div className="content">
                <NavbarTop />
                <div className="container">
                    <Link to={`/primaire/historique_presence_eleve/${id_classe}/${eleve?.options_id}`} className="btn  text-white mb-3">
                        Historique
                    </Link>
                  

                    {eleve ? (
                        <div className="eleve-info text-center">
                            <h4>Informations de l'Élève</h4>
                            <ul className="info-list container hide-on-print">
                                <li><strong>Nom:</strong> {eleve.name}</li>
                                <li><strong>Postnom:</strong> {eleve.last_name}</li>
                                <li><strong>Prénom:</strong> {eleve.first_name}</li>
                                <li><strong>Sexe:</strong> {eleve.sexe}</li>
                                <li><strong>Classe:</strong> {eleve.classe.name}</li>
                                <li><strong>Matricule:</strong> {eleve.matricule}</li>
                            </ul>
                        </div>
                    ) : (
                        <p>Chargement des informations de l'élève...</p> 
                    )}

                    {/* Filtrage */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Filtrer par :</label>
                            <select
                                className="form-control"
                                name="type"
                                value={filter.type}
                                onChange={handleFilterChange}
                            >
                                <option value="mois">Mois</option>
                                <option value="semaine">Semaine</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>{filter.type === "mois" ? "Sélectionnez le mois" : "Sélectionnez la semaine"} :</label>
                            <input
                                type="text"
                                className="form-control"
                                name="value"
                                value={filter.value}
                                onChange={handleFilterChange}
                                placeholder={`Entrez ${filter.type === "mois" ? "le mois (YYYY-MM)" : "les dates (YYYY-MM-DD à YYYY-MM-DD)"}`}
                            />
                        </div>
                    </div>

                    {/* Statistiques */}
                    <h3>Statistiques :</h3>
                    <div className='table-responsive'>
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th>Présences</th>
                                    <th>Absences</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{details?.stats?.presences}</td>
                                    <td>{details?.stats?.absences}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Historique */}
                    <h3>Historique :</h3>
                    <div className='table-responsive'>
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Présent</th>
                                    <th>Motif d'Absence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details?.historique && Object.entries(details.historique).map(([date, entries]) => (
                                    entries.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.date_presence}</td>
                                            <td>{entry.present ? "Oui" : "Non"}</td>
                                            <td>{entry.motif_absence ? entry.motif_absence.name : ""}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PresenceEleve;
