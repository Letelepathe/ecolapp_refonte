import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeMembres = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/all/ecole/${ecole_id}/direction/${direction}`);
        setMembers(response.data.userAll);
      } catch (error) {
        setError("Erreur lors de la récupération des membres");
      }
    };

    fetchMembers();
  }, [ecole_id, direction]);

  return (
      <div className="container-fluid position-relative bg-white d-flex p-0">
        <SidebarLeft/>
        <div className="content">
          <NavbarTop/>
          <div className="container-fluid pt-4 px-4">
            <div className="bg-white text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0">Membres</h6>
                <Link className="text-center btn btn-success" to='/primaire/creationcompte'><i className="bi bi-plus"></i> Créer un utilisateur</Link>
              </div>
              
              <div className="table-responsive">
                {error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <table className="table text-start align-middle table-bordered table-hover mb-0">
                    <thead>
                      <tr className="text-dark">
                        <th>Id</th>
                        <th>Photo</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Genre</th>
                        <th>Mail</th>
                        <th>Téléphone</th>
                        <th>Rôle</th>
                      
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id}>
                          <td>{m.id}</td>
                          <td>
                            <img 
                              src={`https://api.ecolapp.cd/public/imgUser/${m.file}`} 
                                className="rounded-circle flex-shrink-0" 
                                alt="Profil" 
                                style={{ width: '60px', height: '60px', objectFit : 'cover' }} 
                              />
                          </td>
                          <td>{m.name}</td>
                          <td>{m.last_name}</td>
                          <td>{m.sexe}</td>
                          <td><a href={`mailto:${m.mail}`}>{m.mail}</a></td>
                          <td><a href={`tel:${m.phone}`}>{m.phone}</a></td>
                          <td>{m.role}</td>
                        
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ListeMembres;
