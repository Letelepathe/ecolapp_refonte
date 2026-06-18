import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          navigate('/');
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="style-fr-45d973f1">
      <div className="style-fr-bf22c5f7">
        <h1 className="style-fr-ae6779f4">404</h1>
        <p className="style-fr-2e61e24e">Page non trouvée</p>
        <p className="style-fr-75987f6c">Nous n'avons pas pu trouver la page que vous cherchez.</p>
        
        <p className="style-fr-7f0387b8">
          Vous serez redirigé automatiquement dans {countdown} secondes.
        </p>

        <Link to="/" className="style-fr-fb18fb29">
          Retourner à la page d'accueil
        </Link>
      </div>
    </div>);

};




















































export default NotFound;
