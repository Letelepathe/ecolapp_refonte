import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListeMembreEffectif = () => {
  const [membres, setMembres] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getMembresEffectif');
        setMembres(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des membres effectifs.");
      }
    };

    fetchMembres();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center u-style-43ef163a">Liste des Membres Effectifs</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Postnom</th>
            <th>Prénom</th>
            <th>Sexe</th>
            <th>Fonction</th>
          </tr>
        </thead>
        <tbody>
          {membres.map((membre) =>
          <tr key={membre.id}>
              <td>{membre.nom}</td>
              <td>{membre.postnom}</td>
              <td>{membre.prenom}</td>
              <td>{membre.sexe}</td>
              <td>{membre.fonction}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>);

};

export default ListeMembreEffectif;
