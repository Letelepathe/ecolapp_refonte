import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Equipe = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {

    const fetchAdmins = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/user/all/direction/3');
        setAdmins(response.data.admins);
      } catch (error) {
        console.error("Erreur lors de la récupération des administrateurs", error);
      }
    };

    fetchAdmins();
  }, []);
  return (
    <section id="trainers" className="section trainers">
      <div className="container">
        <div className="row gy-5">
          {admins.map((admin) =>
          <div className="col-lg-3 col-md-6 member shadow bg-white py-2" key={admin.id}>
              <div>
                <img
                src={`https://api.ecolapp.cd/public/imgUser/${admin.file}`}
                className="w-100 img-membre-equipe u-style-2f8d99ec"
                alt={`${admin.first_name} ${admin.name}`} />

              
              </div>
              <div className="member-info text-center">
                <h4 className="u-style-43ef163a">{admin.first_name} {admin.name}</h4>
                <span className="u-style-4789709b"></span>
                <a href={`tel:${admin.phone}`} className="btn btn-primary w-100 mt-2">Contacter</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default Equipe;
