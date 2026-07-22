import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AbonnesTable = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/news/ecole/${ecole_id}/direction/${direction}`);
        setSubscribers(response.data.Newsletter);
      } catch (error) {
        setError("Erreur lors de la récupération des abonnés");
      }
    };

    fetchSubscribers();
  }, [ecole_id, direction]);

  return (
    <div className="container-fluid pt-4 px-4">
      <div className=" text-center rounded p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h6 className="mb-0">Abonnés</h6>
        </div>
        
        <div className="table-responsive">
          {error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <table className="table text-start align-middle   mb-0">
              <thead>
                <tr className="text-dark">
                  <th>Id</th>
                  <th>E-mail</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>
                      <a href={`mailto:${sub.mail}`} target="_blank" rel="noopener noreferrer">{sub.mail}</a>
                    </td>
                    <td>{sub.date_abonnement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbonnesTable;
