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
  
    const [statEcoles, setStatEcoles] = useState([]);
    const [statAdmins, setStatAdmins] = useState([]);
    const [statEcolesGroupes, setStatEcolesGroupes] = useState([]);
    const [statProvinceEducationnelle, setStatProvinceEducationnelle] = useState([]);

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

        fetchData(`https://api.ecolapp.cd/api/ecole/stat`, setStatEcoles);
        fetchData(`https://api.ecolapp.cd/api/ecoleGroupe/stat`, setStatEcolesGroupes);
        fetchData(`https://api.ecolapp.cd/api/user/adminGeneral/stat/ecole/${ecole_id}/direction/${direction}`, setStatAdmins);
        fetchData(`https://api.ecolapp.cd/api/provinceEducationnelle/stat`, setStatProvinceEducationnelle);
    }, [ecole_id, direction]);

  return (
    <div className="stat-container">
      <div className="row">

        {statEcoles.length > 0 && (
          <div className="chart-wrapper">
            <h6 className="chart-title">Ecoles</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statEcoles}>
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

        {statAdmins.length > 0 && (
          <div className="chart-wrapper">
            <h6 className="chart-title">Admins</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statAdmins}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {statAdmins.map((entry, index) => (
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

        
        {statProvinceEducationnelle.length > 0 && (
          <div className="col-lg-12 chart-wrapper-2">
            <h6 className="chart-title">Provinces Educationnelles par province</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statProvinceEducationnelle}>
                  <XAxis dataKey="province_name" />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => {
                    const educationalProvinces = props.payload.educational_provinces.join(', ');
                    return [`${value}`, `Provinces Éducationnelles: ${educationalProvinces}`];
                  }} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#1769ff" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {statEcolesGroupes.length > 0 && (
          <div className="col-lg-12 chart-wrapper-2">
            <h6 className="chart-title">Ecoles par Province et Province éducationnelle</h6>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statEcolesGroupes}>
                  <XAxis dataKey={(entry) => `${entry.province} - ${entry.province_educationnelle}`} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}


        

       
        

      </div>
    </div>
  );
};

export default Statistique;
