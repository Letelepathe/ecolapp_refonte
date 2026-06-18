import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Table = ({ title, data, error }) => (
  <div>
    <div className="bg-white shadow text-center rounded p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h6 className="mb-0">{title}</h6>
          <Link className="text-center btn btn-success" to='/secondaire/creationcompte'><i className="bi bi-plus"></i> Créer un utilisateur</Link>
      </div>
      <div className="table-responsive">
        {error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div>
            {data && data.length > 0 ? (
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Id</th>
                    <th>Avatar</th>
                    <th>Utilisateur.trice</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                       <img 
                        src={`https://api.ecolapp.cd/public/imgUser/${item.file}`} 
                          className="rounded-circle flex-shrink-0" 
                          alt="Profil" 
                          style={{ width: '60px', height: '60px', objectFit : 'cover' }} 
                        />
                      </td>
                      <td>{item.first_name} {item.name}</td>
                      <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                      <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                      <td>{item.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
             ) : (
              <p>Aucun membre disponible.</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

const Infos = () => {

  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/all/ecole/${ecole_id}/direction/${direction}`);
        setMembers(response.data.userAll);
        console.log(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, [ecole_id, direction]);

  return (
    <div>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4 justify-content-between align-items-center">
          
          <div className="col-lg-12 col-12">
            
            <Table title="Membres" data={members} error={error} />
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Infos;
