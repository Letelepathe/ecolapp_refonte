import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import SidebarLeft from "../Users/Profil/SidebarLeft";
import NavbarTop from "../Users/Profil/NavbarTop";

const HistoriquePresenceEleve = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const { id_classe, id_option } = useParams();

  const [historique, setHistorique] = useState([]);
  const [stats, setStats] = useState([]);
  const [filter, setFilter] = useState({ type: "mois", value: "" });
  const [error, setError] = useState(null);

  // Fonction pour récupérer l'historique des présences
  const fetchHistorique = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/presences/ecole/${ecole_id}/direction/${direction}/classe/${id_classe}/option/${id_option}?filter=${JSON.stringify(filter)}`);

      if (response.data.status === 200) {
        setHistorique(response.data.data);
        setStats(response.data.stats);
      } else {
        setError(response.data.error_msg);
      }
      console.log(response.data.data);

    } catch (error) {
      setError("Erreur lors de la récupération de l'historique des présences.");
    }
  }, [filter, ecole_id, direction, id_classe, id_option]);

  useEffect(() => {
    fetchHistorique();
  }, [fetchHistorique]); // Ajout de fetchHistorique dans les dépendances de useEffect

  // Fonction pour gérer les changements de filtre
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
            <Helmet>
                <title>ecolapp | Historique des Présences</title>
            </Helmet>
            <SidebarLeft />
            <div className="content">
                <NavbarTop />
                <div className="container">
                    <div className="justify-content-between align-items-center d-flex">
                       <h5>Historique des Présences</h5>
                        <Link
              to={`/maternelle/ajouter_presence_eleve/${id_classe}/${id_option}`}
              className="btn  w-50 u-style-9761b3f7">

              
                            Ajouter présence
                        </Link>                    
                    </div>
                    {error &&
          <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
          }

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label>Filtrer par :</label>
                            <select
                className="form-control"
                name="type"
                value={filter.type}
                onChange={handleFilterChange}>
                
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
                placeholder={`Entrez ${filter.type === "mois" ? "le mois (YYYY-MM)" : "les dates (YYYY-MM-DD à YYYY-MM-DD)"}`} />
              
                        </div>
                    </div>

                    <h3>Statistiques :</h3>
                    <div className="table-responsive">
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Postnom</th>
                                    <th>Prénom</th>
                                    <th>Présences</th>
                                    <th>Absences</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map((stat, index) =>
                <tr key={index}>
                                        <td>{stat.eleve?.last_name}</td>
                                        <td>{stat.eleve?.last_name}</td>
                                        <td>{stat.eleve?.first_name || ""}</td>
                                        <td>{stat.presences}</td>
                                        <td>{stat.absences}</td>
                                        <td>
                                            <Link
                      to={`/maternelle/eleve/presence/${id_classe}/${stat.eleve_id}`}
                      className="btn   text-white w-50">
                      
                                                Détails
                                            </Link>
                                        </td>
                                    </tr>
                )}
                            </tbody>
                        </table>
                    </div>

                    <h3>Historique :</h3>
                    {historique.map((group, index) =>
          <div key={index} className="table-responsive">
                            <h5 className="mt-4">Date : {group.date}</h5>
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Postnom</th>
                                        <th>Prénom</th>
                                        <th>Présent</th>
                                        <th>Motif d'Absence</th>
                                        <th>Classe</th>
                                        <th>Année Scolaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.eleves.map((entry, i) =>
                <tr key={i}>
                                            <td>{entry.eleve?.last_name || ""}</td>
                                            <td>{entry.eleve?.last_name || ""}</td>
                                            <td>{entry.eleve?.first_name || ""}</td>
                                            <td>{entry.present ? "Oui" : "Non"}</td>
                                            <td>{entry.motif_absence ? entry.motif_absence.name : ""}</td>
                                            <td>{entry.eleve?.classe?.name || ""}</td>
                                            <td>{entry.annee?.name || ""}</td>
                                        </tr>
                )}
                                </tbody>

                            </table>
                        </div>
          )}
                </div>
            </div>

        </div>);

};

export default HistoriquePresenceEleve;
