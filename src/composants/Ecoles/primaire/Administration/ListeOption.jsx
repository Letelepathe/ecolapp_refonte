import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "./SidebarLeft";
import NavbarTop from "./NavbarTop";

const ListeOption = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
        setOptions(response.data.optionAll);
      } catch (error) {
        setError("Erreur lors de la récupération des options");
      }
    };

    fetchOptions();
  }, [ecole_id, direction]);

  const handleDelete = async (id) => {
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/option/delete/${id}`);
      if (response.data.status === 200) {
        setSuccessMessage("Option supprimée avec succès !");
        setOptions(options.filter((option) => option.id !== id));
      } else {
        setError(response.data.status_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
     <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container">
          <div className="section d-flex flex-column align-items-center justify-content-center py-4">
            <div className="col-lg-8 col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="table-responsive">
                    <div className='d-flex align-items-center justify-content-between'>
                      <h6>Liste options</h6>
                    <Link className="btn btn-primary mb-2 mt-2" to='/primaire/ajouter_option'>Ajouter option</Link>
                    </div>
                  {successMessage && ( 
                        <p> {successMessage} </p>
                    )}
                    {error ? (
                      <p className="text-danger">{error}</p>
                    ) : options.length > 0 ? (
                      <table className="table text-start align-middle table-bordered table-hover mb-0">
                        <thead>
                          <tr className="text-dark">
                            <th>Id</th>
                            <th>Nom de l'option</th>
                            <th>Section</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {options.map((option) => (
                            <tr key={option.id}>
                              <td>{option.id}</td>
                              <td>{option.name}</td>
                              <td>{option.section.name}</td>
                              <td>
                                <Link onClick={() => handleDelete(option.id)} className='btn btn-danger'>Supprimer</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Aucune option trouvée.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeOption;
