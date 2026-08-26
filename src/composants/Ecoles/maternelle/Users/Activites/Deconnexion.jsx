import React from 'react';
import DeconnexionAvecConfirmation from '../../../../common/DeconnexionAvecConfirmation';

const Deconnexion = () => (
  <DeconnexionAvecConfirmation redirection="/maternelle" champs={["userId", "auth_token"]} />
);

export default Deconnexion;
