import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  {Link} from 'react-router-dom';

import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from  '../Users/Profil/NavbarTop';

const ListeCoursTitulaireByEnseignant = () => {
  const [cours, setCours] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/coursens/enseignant/${userId}`)
        setCours(response.data.cours);
        console.log(response.data.cours);
      } catch (error) {
        setError("Erreur lors de la récupération des travaux.");
      }
    };

    fetchCours();
  }, [userId]);
  
 
  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
        <SidebarLeft/>
        <div className="content">
          <NavbarTop/>
          <div className="container mt-4">
            <div className='d-flex justify-content-between align-items-center'>
              <h6 className="mb-4" style={{color:'#1769ff', fontWeight:'bold'}}>Liste des Cours dont vous êtes titulaire</h6>
              <Link className="btn btn-warning text-white" to='/primaire/ajouter_cours_by_enseignant'><i className='bi bi-plus'></i> Ajouter fichier cours </Link>
              <Link to={`/quiz/by_enseignant`} target='_blank' rel='noopener noreferrer' className="btn btn-primary me-2">Mes Quiz</Link>
            </div>
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead style={{background:'#1769ff', color: '#fff'}}>
                  <tr>
                    <th className='text-white'>#</th>
                    <th className='text-white'>Titre</th>
                    <th className='text-white'>Pondération</th>
                    <th className='text-white'>Classe</th>
                    <th className='text-white'>Option</th>
                    <th className='text-white'>Année</th>
                    <th className='text-white'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cours.length > 0 ? (
                    cours.map((c, index) => (
                      <tr key={c.id}>
                        <td>{index + 1}</td>
                        <td>{c.cour.name}</td>
                        <td>{c.cour.ponderation}</td>
                        <td>{c.cour.classe.name}</td>
                        <td>{c.cour.option.name}</td>
                        <td>{c.annee.name}</td>
                        <td className='d-flex justify-content-between align-items-center'>
                          <Link to={`/quiz/creer/${c.cour.id}/${c.cour.name.replace(/ /g, '+')}`} target='_blank' rel='noopener noreferrer' className="btn btn-warning text-white btn-sm me-2">Créer un Quiz</Link>
                          <Link to={`/quiz/cours/${c.cour.id}/${c.cour.name.replace(/ /g, '+')}`} target='_blank' rel='noopener noreferrer' className="btn btn-primary btn-sm me-2">Liste Quiz</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">Aucun travail trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ListeCoursTitulaireByEnseignant;
