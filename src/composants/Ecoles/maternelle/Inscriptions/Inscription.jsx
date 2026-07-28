import React from "react";
import InscriptionMaternelle from "../../common/Inscriptions/InscriptionMaternelle";

const Inscription = () => (
  <InscriptionMaternelle
    routeSucces={(inscriptionId) =>
      `/maternelle/accueil_inscription_maternelle/${inscriptionId}`
    }
  />
);

export default Inscription;
