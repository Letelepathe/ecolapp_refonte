import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { register } from './serviceWorkerRegistration'; 
import { installerConfigurationApi } from './composants/api/api';

installerConfigurationApi();

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Appel de la fonction register
register({
  onUpdate: (registration) => {
    console.log('[SW] Mise à jour disponible', registration);
  },
  onSuccess: (registration) => {
    console.log('[SW] SW enregistré avec succès', registration);
  }
});
