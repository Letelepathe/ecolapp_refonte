import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from
'recharts';




const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#000'];

const StatEleve = ({ id }) => {
  const [statPresence, steStatPresence] = useState([]);
  const [statPaiement, steStatPaiement] = useState([]);
  const [statTravail, steStatTravail] = useState([]);

  useEffect(() => {
    const fetchStatPresence = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/presences/statEleve/eleve/${id}`);
        steStatPresence(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchStatPresence();
  }, [id]);

  useEffect(() => {
    const fetchStatPaiement = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/paiement/statEleve/eleve/${id}`);
        steStatPaiement(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchStatPaiement();
  }, [id]);

  useEffect(() => {
    const fetchStatTravail = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/travailEffectue/statEleve/eleve/${id}`);
        steStatTravail(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchStatTravail();
  }, [id]);



  return (
    <div className="w-full p-4  rounded-lg">
     
      <div className="row">
        {statPresence.length > 0 &&
        <div className="col-lg-6 col-sm-6 col-12 mb-3 mt-3 chart-wrapper u-style-84534291">
            <h6 className="text-lg font-semibold mb-2 text-center">Présences</h6>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statPresence} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        }
        
       {statPaiement.length > 0 &&
        <div className="col-lg-6 col-12 mb-3 mt-3 chart-wrapper u-style-84534291">
            <h6 className="text-lg font-semibold mb-2 text-center">Paiements</h6>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                data={statPaiement}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label>
                
                  {statPaiement.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        }
        {statTravail.length > 0 &&
        <div className="col-12 mb-3 mt-3 chart-wrapper-2 u-style-84534291">
              <h6 className="text-lg font-semibold mb-2 text-center">Travaux effectués</h6>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statTravail} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#00C49F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        }


      </div>

    </div>);

};

export default StatEleve;
