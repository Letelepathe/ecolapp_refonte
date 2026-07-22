import React from 'react';
import DeconnexionAvecConfirmation from '../../../../common/DeconnexionAvecConfirmation';

const Deconnexion = () => (
  <DeconnexionAvecConfirmation redirection="/maternelle" champs={["userId"]} />
);

export default Deconnexion;
