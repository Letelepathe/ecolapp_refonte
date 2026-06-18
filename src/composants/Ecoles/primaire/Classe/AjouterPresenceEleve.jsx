import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import SidebarLeft from "../Users/Profil/SidebarLeft";
import NavbarTop from "../Users/Profil/NavbarTop";

const AjouterPresenceEleve = () => {
    const ecole_id = localStorage.getItem('ecole_id');
    const direction = localStorage.getItem('direction');
    
    const { id_classe, id_option } = useParams();
    const [eleves, setEleves] = useState([]);
    const [presences, setPresences] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [motifs, setMotifs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEleves = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/classes/eleves/ecole/${ecole_id}/direction/${direction}/classe/${id_classe}/option/${id_option}`);
                if (response.data.status === 200) {
                    setEleves(response.data.eleves);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError("Erreur lors de la récupération des élèves.");
            }
        };

        const fetchMotifs = async () => {
            try {
              const response = await axios.get(`https://api.ecolapp.cd/api/motif_absence/ecole/${ecole_id}/direction/${direction}`);
              setMotifs(response.data.motifAll);
            } catch (error) {
              setError("Erreur lors de la récupération des motifs d'absence");
            }
        };

        fetchMotifs();
        fetchEleves();
    }, [id_classe, id_option, ecole_id, direction]);

    const handleChange = (id, field, value) => {
        setPresences(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setMessage("");
        setError("");
        setIsSubmitting(true);

        // Construction des données à envoyer
        const data = eleves.map(eleve => ({
            ecole_id : ecole_id, 
            direction : direction,
            eleve_id: eleve.id,
            date_presence: new Date().toISOString().split("T")[0], // Format de date : 'yyyy-mm-dd'
            present: presences[eleve.id]?.present === true ? 1 : (presences[eleve.id]?.present === false ? 0 : null),
            motif_absence: presences[eleve.id]?.motif_absence ? presences[eleve.id]?.motif_absence : null
        }));

        // Validation
        for (let entry of data) {
            // Vérification si la présence a été définie (soit 0, soit 1)
            if (entry.present === null) {
                setError("Veuillez cocher soit Présent soit Absent pour tous les élèves.");
                setIsSubmitting(false);
                return;
            }

            // Si l'élève est absent, le motif d'absence doit être renseigné
            if (entry.present === 0 && (!entry.motif_absence || entry.motif_absence.trim() === "")) {
                setError("Veuillez renseigner le motif d'absence pour tous les élèves marqués comme absents.");
                setIsSubmitting(false);
                return;
            }
        }

        // Si la validation est correcte, envoyer les données au serveur
        try {
            const response = await axios.post("https://api.ecolapp.cd/api/presences/create", { presences: data });
            if (response.data.status === 200) {
                setMessage("Présences enregistrées avec succès.");
                setPresences({}); // Réinitialiser les présences après succès
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Erreur lors de l'enregistrement des présences.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Affichage des erreurs
    if (error && eleves.length === 0) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <Helmet>
                <title>ecolapp | Ajouter Présence</title>
            </Helmet>
            <SidebarLeft />
            <div className="content">
                <NavbarTop />
                <div className="container">
                    <div className="justify-content-between align-items-center d-flex">
                     <Link to={`/primaire/historique_presence_eleve/${id_classe}/${id_option}`} className="btn btn-warning text-white ">Historique</Link>
                     <h5 className="my-4">Ajouter Présence des Élèves</h5>
                    </div>
                    
                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}                   
                    <div className="table-responsive justify-content-center align-items-center">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Postnom</th>
                                    <th>Prénom</th>
                                    <th>Présent</th>
                                    <th>Absent</th>
                                    <th>Motif d'Absence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eleves.map(eleve => (
                                    <tr key={eleve.id}>
                                        <td>{eleve.name}</td>
                                        <td>{eleve.last_name}</td>
                                        <td>{eleve.first_name}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={presences[eleve.id]?.present === true}
                                                onChange={() =>
                                                    handleChange(eleve.id, "present", true)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={presences[eleve.id]?.present === false}
                                                onChange={() =>
                                                    handleChange(eleve.id, "present", false)
                                                }
                                            />
                                        </td>
                                        <td>
                                            {presences[eleve.id]?.present === false && (
                                                
                                                <div className="mb-3">
                                                    <select name="id_option" className="form-control" value={presences[eleve.id]?.motif_absence || ""} onChange={e =>
                                                        handleChange(eleve.id, "motif_absence", e.target.value)
                                                    } required>
                                                        <option value="">Sélectionner un motif</option>
                                                        {motifs.map(motif => (
                                                        <option key={motif.id} value={motif.id}>{motif.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-center justify-content-center align-items-center">
                            <button disabled={isSubmitting} className="btn btn-primary mt-3" onClick={handleSave}>
                            {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AjouterPresenceEleve;
