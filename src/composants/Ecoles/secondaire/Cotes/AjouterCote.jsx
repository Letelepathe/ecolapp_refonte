import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";

const AjouterCote = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [eleves, setEleves] = useState([]);
  const [periodes, setPeriodes] = useState([]);
  const [cours, setCours] = useState([]);
  const [notes, setNotes] = useState({});
  const [typeEpreuve, setTypeEpreuve] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState('');
  const [eleveErrors, setEleveErrors] = useState({}); // Pour stocker les erreurs spécifiques aux élèves
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour gérer la soumission et l'animation de chargement

  // Fonction pour extraire un paramètre de la query string
  function getValidIntegerFromQuery(param, defaultValue = 0) {
    const value = new URLSearchParams(location.search).get(param);
    const integerValue = parseInt(value, 10);
    return Number.isInteger(integerValue) ? integerValue : defaultValue;
  }

  const classeId = getValidIntegerFromQuery('classe_id', 0);

  useEffect(() => {
    if (classeId === 0) {
      console.warn('classe_id est invalide ou manquant');
      setErrors('Classe invalide ou manquante.');
      return;
    }

    const fetchData = async () => {
      try {
        const [eleveRes, periodeRes, coursRes, TypeEpreuve] = await Promise.all([
        axios.get(`http://localhost/ecole-app/apis/getEleveByIdClasse?classe_id=${classeId}`),
        axios.get('http://localhost/ecole-app/apis/getPeriode'),
        axios.get(`http://localhost/ecole-app/apis/getCoursByClasse?classe_id=${classeId}`),
        axios.get('http://localhost/ecole-app/apis/getTypeTravail')]
        );

        if (eleveRes.data.success) {
          setEleves(eleveRes.data.data || []);
        } else {
          setErrors(eleveRes.data.message || 'Aucun élève trouvé.');
        }

        setPeriodes(periodeRes.data || []);
        setCours(coursRes.data || []);
        setTypeEpreuve(TypeEpreuve.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        setErrors('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, [classeId]);

  const handleNoteChange = (eleveId, note) => {
    setNotes({ ...notes, [eleveId]: note });
    // Efface l'erreur de l'élève concerné si elle existe
    setEleveErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[eleveId];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true); // Activation de l'animation de soumission

    // Vérification des notes par rapport au total général
    const newEleveErrors = {};
    for (const eleveId in notes) {
      if (parseFloat(notes[eleveId]) > parseFloat(totalGeneral)) {
        newEleveErrors[eleveId] = `La note de cet élève (${notes[eleveId]}) dépasse le total général (${totalGeneral}).`;
      }
    }

    if (Object.keys(newEleveErrors).length > 0) {
      setEleveErrors(newEleveErrors);
      setErrors('Veuillez corriger les erreurs avant de soumettre.');
      setIsSubmitting(false); // Désactivation de l'animation de soumission
      return;
    }

    // Préparation des données pour l'envoi
    const formData = Object.keys(notes).map((eleveId) => ({
      eleve_id: eleveId,
      note: notes[eleveId],
      classe_id: classeId,
      periode_id: e.target.periode.value,
      cours_id: e.target.cours.value,
      type_epreuve: e.target.type_epreuve.value,
      total_general: totalGeneral
    }));

    try {
      const response = await axios.post('http://localhost/ecole-app/apis/insertCote.php', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Cotes enregistrées avec succès !');
        navigate(`/secondaire/liste_cote?classe_id=${classeId}&periode_id=${e.target.periode.value}&cours_id=${e.target.cours.value}`);
      } else {
        setErrors(response.data.message || 'Erreur lors de l\'enregistrement des cotes.');
        console.log(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des cotes :', error);
      setErrors('Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false); // Désactivation de l'animation de soumission après l'opération
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container mt-5">
          <h2 className="text-center text-primary">Ajouter des Cotes</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Tableau des élèves */}
              <div className="col-lg-8 order-2 order-lg-1">
                <table className="table mt-3">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Note</th>
                      <th>Erreur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eleves.map((eleve) =>
                    <tr key={eleve.id}>
                        <td>{eleve.nom} {eleve.prenom}</td>
                        <td>
                          <input
                          type="number"
                          className={`form-control ${eleveErrors[eleve.id] ? 'is-invalid' : ''}`}
                          min="0"
                          value={notes[eleve.id] || ''}
                          onChange={(e) => handleNoteChange(eleve.id, e.target.value)} />

                        </td>
                        <td>
                          {eleveErrors[eleve.id] && <span className="text-danger">{eleveErrors[eleve.id]}</span>}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Formulaire des métadonnées */}
              <div className="col-lg-4 order-1 order-lg-2 u-style-9e2237d1">
                <div className="mb-3">
                  <label htmlFor="type_epreuve">Type épreuve</label>
                  <select id="type_epreuve" name="type_epreuve" className="form-control">
                    <option value="">Sélectionnez type épreuve</option>
                    {typeEpreuve.map((epreuve) =>
                    <option key={epreuve.id} value={epreuve.typeTravail}>{epreuve.typeTravail}</option>
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="total_general">Total général</label>
                  <input
                    type="number"
                    className="form-control"
                    id="total_general"
                    name="total_general"
                    value={totalGeneral}
                    onChange={(e) => setTotalGeneral(e.target.value)} />

                </div>
                <div className="mb-3">
                  <label htmlFor="periode">Période</label>
                  <select id="periode" name="periode" className="form-control">
                    <option value="">Sélectionnez une période</option>
                    {periodes.map((periode) =>
                    <option key={periode.id} value={periode.id}>{periode.periode}</option>
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="cours">Cours</label>
                  <select id="cours" name="cours" className="form-control">
                    <option value="">Sélectionnez un cours</option>
                    {cours.map((cour) =>
                    <option key={cour.id} value={cour.id}>{cour.nom}</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="d-grid mt-3">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ?
                <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Enregistrement...
                  </> :

                'Enregistrer'
                }
              </button>
            </div>

            {/* Messages de succès ou d'erreur */}
            {successMessage && <p className="text-success mt-2">{successMessage}</p>}
            {errors && <p className="text-danger mt-2">{errors}</p>}
          </form>
        </div>
      </div>
    </div>);

};

export default AjouterCote;
