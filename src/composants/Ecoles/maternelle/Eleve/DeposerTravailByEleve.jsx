import React, { useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from '../Users/Profil/NavbarTop';

const DeposerTravailByEleve = () => {
  const fileInputRef = useRef(null);

  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const { id_cours, id_travail } = useParams();
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const users_id = localStorage.getItem('userId');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!file || !description) {
      setMessage("Veuillez remplir tous les champs.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("id_cours", id_cours);
    formData.append("id_travail", id_travail);
    formData.append("description", description);
    formData.append("users_id", users_id);
    formData.append("file", file);
    formData.append('ecole_id', ecole_id);
    formData.append('direction', direction);

    try {
      const response = await axios.post(
        "https://api.ecolapp.cd/api/travailEffectue/depot",
        formData,
        { withCredentials: true }
      );

      console.log(response.data); // Vérifier la réponse

      if (response.data.status === 200) {
        setMessage("Travail déposé avec succès !");
        setDescription(""); // Réinitialise le champ description
        setFile(null); // Réinitialise le champ fichier
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        console.log(response.data.error_msg);
        setMessage(response.data.error_msg || "Erreur lors du dépôt du travail.");
      }
    } catch (error) {
      console.error(error); // Ajout de logs pour capturer l'erreur
      setMessage(
        error.response?.data?.error_msg || "Erreur de connexion au serveur."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container mt-5">
          <div className="justify-content-between align-items-center d-flex">
            <h2 className="text-primary">Déposer un Travail</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <Link to="/maternelle/liste_travail_by_eleve" className="btn btn-secondary mb-3">
              Voir mes travaux déposés
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required>
              </textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="file" className="form-label">Fichier</label>
              <input
                type="file"
                id="file"
                className="form-control"
                onChange={handleFileChange}
                ref={fileInputRef}
                required />
              
            </div>
            <button
              className="btn btn-primary w-100 u-style-2167c5af"
              type="submit"
              disabled={isSubmitting}>






              
              {isSubmitting ? 'Traitement en cours...' : 'Déposer'}
          </button>
          </form>
        </div>
      </div>
    </div>);

};

export default DeposerTravailByEleve;
