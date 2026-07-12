import React from 'react';
import DeconnexionAvecConfirmation from '../common/DeconnexionAvecConfirmation';

const DeconnexionAdmin = () => (
  <DeconnexionAvecConfirmation redirection="/" champs={["userId", "adminId"]} />
);

export default DeconnexionAdmin;
