import React from "react";

const ResumeReglesType = ({ typeEleve, compact = false }) => {
  if (!typeEleve) return null;

  return (
    <div className={compact ? "small mt-2" : "mt-3"}>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <strong>{typeEleve.nom}</strong>
        {typeEleve.estTypeParDefaut && (
          <span className="badge bg-secondary">Par défaut</span>
        )}
      </div>
      {typeEleve.description && (
        <p className="text-muted mb-1">{typeEleve.description}</p>
      )}
      <p className="mb-0 text-muted">
        Les montants applicables sont définis dans chaque tranche.
      </p>
    </div>
  );
};

export default ResumeReglesType;
