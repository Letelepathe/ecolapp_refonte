import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Deconnexion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      localStorage.setItem('userId', '');
      navigate('/secondaire');
    }
    logoutUser();
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <h4>Déconnexion en cours...</h4>
    </div>
  );
};

export default Deconnexion;
