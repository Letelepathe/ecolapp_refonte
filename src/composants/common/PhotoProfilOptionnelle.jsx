import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";

const estFemme = (sexe) =>
  ["femme", "f", "female"].includes(String(sexe || "").trim().toLowerCase());

const PhotoProfilOptionnelle = ({
  fichier,
  sexe,
  name = "photo",
  onChange,
  label = "Photo de profil",
}) => {
  const [apercu, setApercu] = useState("");

  useEffect(() => {
    if (!fichier) {
      setApercu("");
      return undefined;
    }

    const url = URL.createObjectURL(fichier);
    setApercu(url);
    return () => URL.revokeObjectURL(url);
  }, [fichier]);

  return (
    <div className="photo-profil-optionnelle">
      <div
        className={`photo-profil-optionnelle__avatar ${
          estFemme(sexe) ? "photo-profil-optionnelle__avatar--femme" : ""
        }`}
        aria-hidden="true"
      >
        {apercu ? <img src={apercu} alt="" /> : <FiUser />}
      </div>
      <div className="photo-profil-optionnelle__champ">
        <label htmlFor={name}>{label} <span>(optionnelle)</span></label>
        <input
          id={name}
          type="file"
          name={name}
          className="form-control"
          accept="image/png,image/jpeg,image/webp"
          onChange={onChange}
        />
        <small>
          Sans photo, l’avatar {estFemme(sexe) ? "féminin" : "masculin"} sera utilisé.
        </small>
      </div>
    </div>
  );
};

export default PhotoProfilOptionnelle;
