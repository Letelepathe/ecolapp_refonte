import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1769ff', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

const Statistique = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

    const [statInscription, setStatInscription] = useState([]);
    const [statPaiement, setStatPaiement] = useState([]);
    const [statUser, setStatUser] = useState([]);
    const [statEleve, setStatEleve] = useState([]);

    useEffect(() => {
        const fetchData = async (url, setter) => {
            try {
                const response = await axios.get(url);
                setter(response.data);
                console.log(`Données reçues de ${url}:`, response.data);
            } catch (error) {
                console.error(`Erreur lors de la récupération des données depuis ${url}:`, error);
            }
        };

        fetchData(`https://api.ecolapp.cd/api/inscription/stat/ecole/${ecole_id}/direction/${direction}`, setStatInscription);
        fetchData(`https://api.ecolapp.cd/api/paiement/stat/ecole/${ecole_id}/direction/${direction}`, setStatPaiement);
        fetchData(`https://api.ecolapp.cd/api/user/stat/ecole/${ecole_id}/direction/${direction}`, setStatUser);
        fetchData(`https://api.ecolapp.cd/api/eleve/statEleveClasseOption/ecole/${ecole_id}/direction/${direction}`, setStatEleve);
    }, [ecole_id, direction]);

  return (
    <div className="stat-container">
      <div className="row">

        {statInscription.length > 0 && (
          <div className="chart-wrapper">
            <h6 className="chart-title">Inscriptions élèves</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statInscription}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#1769ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {statUser.length > 0 && (
          <div className="chart-wrapper">
            <h6 className="chart-title">Utilisateurs</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statUser}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {statUser.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {statEleve.length > 0 && (
          <div className="chart-wrapper">
            <h6 className="chart-title">Nombre d'élèves par Classe et Option</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statEleve}>
                  <XAxis dataKey={(entry) => `${entry.classe} - ${entry.option}`} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {statPaiement.length > 0 && (
          <div className="chart-wrapper">
            <h6 className="chart-title">Paiements</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statPaiement}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#1769ff" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        

      </div>
    </div>
  );
};

export default Statistique;
