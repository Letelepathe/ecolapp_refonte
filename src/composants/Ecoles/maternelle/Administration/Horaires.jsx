import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Horaires = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const [horaires, setHoraires] = useState([]);

  useEffect(() => {
    const fetchHoraires = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/horaire/ecole/${ecole_id}/direction/${direction}`);
        setHoraires(response.data.horaireAll);
      } catch (error) {
        console.error("Erreur lors de la récupération des horaires", error);
      }
    };

    fetchHoraires();
  }, [ecole_id, direction]);

  return (
    <div>
            <section className="container">
                <header className="section-header">
                    <h2>Horaires</h2>
                </header>
                <div className="row">
                    {horaires.map((horaire) =>
          <div className="col-lg-4 col-md-6 col-12" key={horaire.id}>
                            <div className="post-box"> 
                                <div className="post-img">
                                    <img src={`https://api.ecolapp.cd/public/imgHoraire/${horaire.image}`} className="img-fluid w-100 u-style-a38c38cd" alt="" />
                                </div>
                                <ul className="u-style-f2c6d55f">
                                    <li>
                                        Classe : {horaire.classe.name}
                                    </li>
                                    <li>
                                        Option : {horaire.option.name}
                                    </li>
                                    <li>
                                        Année scolaire : {horaire.annee.name}
                                    </li>
                                </ul>
                            </div>
                        </div>
          )}
                </div>
            </section>
        </div>);

};

export default Horaires;
