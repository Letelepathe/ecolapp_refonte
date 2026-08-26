import React from "react";
import ResumeReglesType from "./ResumeReglesType";

const SelectTypeEleve = ({
  types,
  value,
  onChange,
  name = "type_eleve_id",
  label = "Type d'élève",
  afficherResume = true,
}) => {
  const selection = types.find((type) => String(type.id) === String(value));

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        className="form-control"
        value={value || ""}
        onChange={onChange}
      >
        {types.map((type) => (
          <option key={type.id} value={type.id}>
            {type.nom}{type.estTypeParDefaut ? " (par défaut)" : ""}
          </option>
        ))}
      </select>
      {afficherResume && (
        <ResumeReglesType typeEleve={selection} compact />
      )}
    </>
  );
};

export default SelectTypeEleve;
