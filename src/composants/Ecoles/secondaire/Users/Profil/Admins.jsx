import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admins = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/user/all/ecole/${ecole_id}/direction/${direction}`);
        setAdmins(response.data.admins);
      } catch (error) {
        console.error("Erreur lors de la récupération des administrateurs", error);
      }
    };

    fetchAdmins();
  }, [ecole_id, direction]);

  return (
    <section id="trainers" className="section trainers">
      <style>{`
        .member-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .member-info h6 {
          flex: 1;
          margin-bottom: 10px;
          text-align: center;
        }

        .member-info .btn {
          margin-top: auto;
          width: 100%;
        }
      `}</style>
      <div className="container">
        <h6 className="text-center">Admins</h6>
        <div className="row gy-5">
          {admins.map((admin) =>
          <div className="col-lg-6 col-md-6 col-12 py-2" key={admin.id}>
              <div className=' shadow bg-white justify-content-center align-items-center py-2'>
               
                <div className="member-info text-center p-3">
                  <img
                  src={`https://api.ecolapp.cd/public/imgUser/${admin.file}`}
                  className="justify-content-center align-items-center u-style-c01683e6"
                  alt={`${admin.first_name} ${admin.name}`} />

                
                  <h6 className="u-style-43ef163a">{admin.first_name} {admin.name}</h6>
                  <a href={`tel:${admin.phone}`} className="btn btn-white w-100 mt-2 text-white u-style-744f6380">Contacter</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default Admins;
