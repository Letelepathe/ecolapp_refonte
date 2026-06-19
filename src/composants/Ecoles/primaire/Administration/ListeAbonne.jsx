import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListeAbonne = () => {
    const ecole_id = localStorage.getItem('ecole_id');
    const direction = localStorage.getItem('direction');
  
    const [abonnes, setAbonnes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAbonnes = async () => {
            try {
                const response = await axios.get(`https://api.ecolapp.cd/api/news/ecole/${ecole_id}/direction/${direction}`); 
                setAbonnes(response.data.Newsletter); 
                setLoading(false); 
            } catch (err) {
                setError('Erreur lors de la récupération des abonnés.');
                setLoading(false);
            }
        };
        fetchAbonnes(); 
    }, [ecole_id, direction]);

    if (loading) {
        return <div className='spinner'></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (abonnes.length === 0) {
        return <div>Aucun abonné trouvé.</div>;
    }

    return (
        <div className="container-fluid pt-4 px-4">
            <div className=" text-center rounded p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="mb-0">Abonnés</h6>
                </div>
                <div className="table-responsive">
                    
                    <table className="table text-start align-middle   mb-0">
                        <thead>
                            <tr className="text-dark">
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {abonnes.map(abonne => (
                                <tr key={abonne.id}>
                                    <td>{abonne.email}</td>
                                    <td>Actif</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListeAbonne;
