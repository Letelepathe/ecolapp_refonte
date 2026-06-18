import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DeconnexionParent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutParent = async () => {
      localStorage.setItem('parentId', '');
      navigate('/');
    }
    logoutParent();
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <h4>Déconnexion en cours...</h4>
    </div>
  );
};

export default DeconnexionParent;
