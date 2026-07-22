import React from 'react';
import DeconnexionAvecConfirmation from '../common/DeconnexionAvecConfirmation';

const DeconnexionParent = () => (
  <DeconnexionAvecConfirmation redirection="/parent/login" champs={["parent_id"]} />
);

export default DeconnexionParent;
