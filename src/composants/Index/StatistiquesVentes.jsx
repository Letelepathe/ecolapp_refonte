import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PolarAngleAxis, Radar, PolarGrid, PolarRadiusAxis, RadarChart } from
'recharts';

const data = [
{ name: 'Jan', ventes: 4000 },
{ name: 'Fév', ventes: 3000 },
{ name: 'Mar', ventes: 5000 },
{ name: 'Avr', ventes: 7000 },
{ name: 'Mai', ventes: 6000 }];


const pieData = [
{ name: 'Jan', value: 4000 },
{ name: 'Fév', value: 3000 },
{ name: 'Mar', value: 5000 },
{ name: 'Avr', value: 7000 },
{ name: 'Mai', value: 6000 }];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatistiquesVentes = () => {
  console.log("Données du graphique:", data);

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Statistiques des Ventes</h2>
      <div className="mb-6 u-style-cc65f0e8">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="Ventes" dataKey="ventes" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique en Barres */}
      <div className="mb-6 u-style-cc65f0e8">
        <h3 className="text-lg font-semibold mb-2">Graphique en Barres</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique en Courbes */}
      <div className="mb-6 u-style-cc65f0e8">
        <h3 className="text-lg font-semibold mb-2">Graphique en Courbes</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ventes" stroke="#00C49F" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique en Camembert */}
      <div className="u-style-cc65f0e8">
        <h3 className="text-lg font-semibold mb-2">Graphique en Camembert</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label>
              
              {pieData.map((entry, index) =>
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              )}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>);

};

export default StatistiquesVentes;
