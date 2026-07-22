import React, { useState } from 'react';
import axios from 'axios';

const Abonnement = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      setError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post("https://api.ecolapp.cd/api/news/create", { email, ecole_id: ecole_id, direction: direction });
      if (response.data.status_msg) {
        setSuccessMessage(response.data.status_msg);
        setEmail('');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("Cette adresse email est déjà abonnée.");
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Données invalides.");
      } else {
        console.error("Erreur lors de la requête:", error);
        setError("Impossible de s'abonner pour le moment. Veuillez réessayer plus tard.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="abonnement">
      <div className="newsletter-form">
        <input
          type="email"
          placeholder="Votre e-mail..."

          value={email}
          onChange={handleChange} className="u-style-4392f332" />
        
        <input
          type="submit"
          className="abonne"
          value={isLoading ? "Traitement..." : "Souscrire"}
          disabled={isLoading} />
        
      </div>
      <div className="my-3">
        {error && <p id="erreur_abonne" className="text-white py-2 text-center bg-danger">{error}</p>}
        {successMessage && <p className="text-white py-2 text-center bg-success">{successMessage}</p>}
      </div>
      
    </form>);

};

export default Abonnement;
