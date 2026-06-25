import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiShield, FiUserCheck, FiUserPlus, FiUserX } from "react-icons/fi";
import SidebarEcole from "./SidebarEcole";
import NavHautEcole from "./NavHautEcole";

const configurations = {
  creer: {
    titre: "Créer un administrateur",
    description: "Transformez un utilisateur existant en administrateur de l'établissement.",
    action: "Créer l'administrateur",
    endpoint: "creerAdmin",
    icone: FiUserPlus,
  },
  super: {
    titre: "Créer un super administrateur",
    description: "Attribuez les droits de super administration à un utilisateur existant.",
    action: "Créer le super administrateur",
    endpoint: "creerSuperAdmin",
    icone: FiUserCheck,
  },
  suspendre: {
    titre: "Suspendre un administrateur",
    description: "Retirez temporairement les droits administratifs d'un utilisateur.",
    action: "Suspendre l'administrateur",
    endpoint: "suspendreAdmin",
    icone: FiUserX,
  },
};

const ActionAdminEcole = ({ cycle, titreCycle, type }) => {
  const configuration = configurations[type] || configurations.creer;
  const Icone = configuration.icone;
  const [idUtilisateur, setIdUtilisateur] = useState("");
  const [message, setMessage] = useState("");
  const [soumission, setSoumission] = useState(false);

  const soumettre = async (event) => {
    event.preventDefault();
    setMessage("");
    setSoumission(true);

    try {
      const reponse = await axios.get(
        `https://api.ecolapp.cd/api/user/${configuration.endpoint}/${idUtilisateur}`
      );
      setMessage(reponse.data.message || "Opération terminée.");

      if (!reponse.data.success) {
        setIdUtilisateur("");
      }
    } catch {
      setMessage("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setSoumission(false);
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0 refonte-shell">
      <SidebarEcole cycle={cycle} titreCycle={titreCycle} />
      <div className="content refonte-content">
        <NavHautEcole cycle={cycle} />

        <main className="dashboard-form-page">
          <section className="dashboard-form-card">
            <div className="dashboard-form-icon">
              <Icone />
            </div>
            <span className="dashboard-form-kicker">Ecolapp · Gestion des accès</span>
            <h1>{configuration.titre}</h1>
            <p>{configuration.description}</p>

            <form onSubmit={soumettre}>
              <label htmlFor={`${cycle}-${type}-utilisateur`}>Identifiant de l'utilisateur</label>
              <input
                id={`${cycle}-${type}-utilisateur`}
                type="text"
                className="form-control"
                placeholder="Saisir l'identifiant"
                value={idUtilisateur}
                onChange={(event) => setIdUtilisateur(event.target.value)}
                required
              />

              <button type="submit" className="btn w-100" disabled={soumission}>
                <FiShield />
                {soumission ? "Traitement en cours..." : configuration.action}
              </button>
            </form>

            {message && <div className="dashboard-form-message">{message}</div>}

            <Link to={`/${cycle}/bureau_admin`} className="dashboard-form-back">
              Retour au bureau admin
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ActionAdminEcole;
