import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from
'recharts';




const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#000'];

const StatEnseignant = ({ id }) => {
  const [statCours, steStatCours] = useState([]);
  const [statTravail, steStatTravail] = useState([]);

  useEffect(() => {
    const fetchStatCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/coursFichier/statEnseignant/enseignant/${id}`);
        steStatCours(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchStatCours();
  }, [id]);

  useEffect(() => {
    const fetchStattTravail = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/travail/statEnseignant/enseignant/${id}`);
        steStatTravail(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchStattTravail();
  }, [id]);




  return (
    <div className="w-full p-4 rounded-lg">
     
      <div className="row">
        {statCours.length > 0 &&
        <div className="col-lg-6 col-sm-6 col-12 mb-3 mt-3 chart-wrapper u-style-84534291">
            <h6 className="text-lg font-semibold mb-2 text-center">Cours</h6>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statCours} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#1769ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        }  
       {statTravail.length > 0 &&
        <div className="col-lg-6 col-sm-6 col-12 mb-3 mt-3 chart-wrapper u-style-84534291">
            <h6 className="text-lg font-semibold mb-2 text-center">Travaux</h6>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                data={statTravail}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label>
                
                  {statTravail.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        }
      </div>

    </div>);

};

export default StatEnseignant;
