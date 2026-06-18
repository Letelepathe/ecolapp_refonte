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
    <div style={styles.container}>
      <div style={styles.messageBox}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.subHeading}>Page non trouvée</p>
        <p style={styles.description}>Nous n'avons pas pu trouver la page que vous cherchez.</p>
        
        <p style={styles.autoRedirectInfo}>
          Vous serez redirigé automatiquement dans {countdown} secondes.
        </p>

        <Link to="/" style={styles.homeLink}>
          Retourner à la page d'accueil
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  },
  messageBox: {
    textAlign: 'center',
    padding: '40px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  heading: {
    fontSize: '80px',
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  subHeading: {
    fontSize: '24px',
    color: '#333',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    margin: '20px 0',
  },
  homeLink: {
    display: 'inline-block',
    padding: '10px 20px',
    marginTop: '20px',
    backgroundColor: '#1769ff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  autoRedirectInfo: {
    fontSize: '14px',
    color: '#999',
    marginTop: '10px',
  },
};

export default NotFound;
