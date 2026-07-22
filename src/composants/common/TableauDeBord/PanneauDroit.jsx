import React from "react";

const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const creerJoursMois = (date) => {
  const annee = date.getFullYear();
  const mois = date.getMonth();
  const total = new Date(annee, mois + 1, 0).getDate();
  const debut = new Date(annee, mois, 1).getDay();
  const blancs = Array.from({ length: debut }, (_, index) => ({ id: `b${index}`, label: "" }));
  const dates = Array.from({ length: total }, (_, index) => ({ id: index + 1, label: index + 1 }));

  return [...blancs, ...dates];
};

const PanneauDroit = ({ actions = [] }) => {
  const date = new Date();
  const libelleDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(date);
  const joursMois = creerJoursMois(date);

  return (
    <aside className="dashboard-side-panel">
      <section className="dashboard-card dashboard-calendar">
        <strong>{libelleDate}</strong>
        <div className="dashboard-week">
          {jours.map((jour) => (
            <span key={jour}>{jour}</span>
          ))}
        </div>
        <div className="dashboard-days mt-2">
          {joursMois.map((jour) => (
            <span key={jour.id} className={jour.label === date.getDate() ? "actif" : ""}>
              {jour.label}
            </span>
          ))}
        </div>
      </section>

      <section className="dashboard-card">
        <h3 className="h6 mb-3">Actions rapides</h3>
        {(actions.length ? actions : [
          { titre: "Suivre les inscriptions", detail: "Élèves et dossiers récents" },
          { titre: "Contrôler les paiements", detail: "Frais et reçus du jour" },
          { titre: "Préparer les rapports", detail: "Statistiques et listes" },
        ]).map((action, index) => (
          <div className="dashboard-action mb-2" key={action.titre}>
            <span className="dashboard-action-icon">{index + 1}</span>
            <span>
              <strong>{action.titre}</strong>
              <span>{action.detail}</span>
            </span>
          </div>
        ))}
      </section>
    </aside>
  );
};

export default PanneauDroit;
