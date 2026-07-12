import React from 'react';
import DeconnexionAvecConfirmation from '../../../../common/DeconnexionAvecConfirmation';

const Deconnexion = () => (
  <DeconnexionAvecConfirmation redirection="/primaire" champs={["userId"]} />
);

export default Deconnexion;
