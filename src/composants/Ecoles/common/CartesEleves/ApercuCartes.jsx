import React from "react";
import CarteEleve from "./CarteEleve";
import { idEleve } from "./outilsCarte";

const ApercuCartes = ({ zoneRef, eleves, ecole, photosKo, photoKo }) => (
  <section ref={zoneRef} className="zone-cartes">
    {eleves.length > 0 ? (
      eleves.map((eleve) => (
        <CarteEleve
          key={idEleve(eleve)}
          eleve={eleve}
          ecole={ecole}
          photosKo={photosKo}
          photoKo={photoKo}
        />
      ))
    ) : (
      <div className="carte-vide">
        Sélectionnez un ou plusieurs élèves pour afficher les cartes.
      </div>
    )}
  </section>
);

export default ApercuCartes;
