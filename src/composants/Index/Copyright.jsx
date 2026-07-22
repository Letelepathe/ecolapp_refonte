import React from 'react';

const Copyright = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <p className='text-primary'>
      &copy; <span>{currentYear}</span> 
      <strong className="px-1">ecolapp</strong> 
      <span>Tous droits réservés</span>
    </p>
  );
};

export default Copyright; 
