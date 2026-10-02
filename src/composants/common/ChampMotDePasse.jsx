import React, { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChampMotDePasse = forwardRef(
  (
    {
      conteneurClassName = "champ-mot-de-passe",
      boutonClassName = "champ-mot-de-passe__bouton",
      sansConteneur = false,
      ...proprietes
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const libelle = visible ? "Masquer le mot de passe" : "Afficher le mot de passe";

    const contenu = (
      <>
        <input {...proprietes} ref={ref} type={visible ? "text" : "password"} />
        <button
          type="button"
          className={boutonClassName}
          aria-label={libelle}
          aria-pressed={visible}
          title={libelle}
          onClick={() => setVisible((etat) => !etat)}
        >
          {visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
        </button>
      </>
    );

    return sansConteneur ? contenu : <div className={conteneurClassName}>{contenu}</div>;
  },
);

ChampMotDePasse.displayName = "ChampMotDePasse";

export default ChampMotDePasse;
