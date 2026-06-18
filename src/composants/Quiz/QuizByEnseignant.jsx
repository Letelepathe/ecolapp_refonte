import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const QuizByEnseignant = () => {
  const enseignant_id = localStorage.getItem('userId');
  const [quizzes, setQuizzes] = useState([]);
  const [cours, setCours] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoursId, setSelectedCoursId] = useState('');

  useEffect(() => {
    fetchQuizzes();
    fetchCours();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, searchTerm, selectedCoursId]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/quiz/enseignant/${enseignant_id}/quizzes`);
      if (response.data.status === 200) {
        setQuizzes(response.data.quizzes);
      } else {
        setError("Erreur lors de la récupération des quiz.");
      }
    } catch (err) {
      setError("Erreur lors du chargement des quiz.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCours = async () => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/coursens/enseignant/${enseignant_id}`);
      setCours(response.data.cours);
    } catch (error) {
      setError("Erreur lors de la récupération des cours.");
    }
  };

  const filterQuizzes = () => {
    const filtered = quizzes.filter((quiz) => {
      const matchSearch = quiz.titre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCours = selectedCoursId ? quiz.cours_id === parseInt(selectedCoursId) : true;
      return matchSearch && matchCours;
    });
    setFilteredQuizzes(filtered);
  };

  const handleDelete = async (quizId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce quiz ?")) {
      try {
        await axios.delete(`https://api.ecolapp.cd/api/quizzes/delete/${quizId}`);
        setSuccessMsg("Quiz supprimé avec succès.");
        setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      } catch (error) {
        console.error("Erreur lors de la suppression du quiz :", error);
        setError("Impossible de supprimer le quiz.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="text-center mb-4 u-style-951c0e5f">Mes Quiz</h4>

              {loading && <div className='spinner'></div>}
              {error && <div className="alert alert-danger">{error}</div>}
              {successMsg && <div className="alert alert-success">{successMsg}</div>}

              {/* Recherche et filtrage */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    placeholder="Rechercher un quiz par titre..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                  
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={selectedCoursId}
                    onChange={(e) => setSelectedCoursId(e.target.value)}>
                    
                    <option value="">-- Filtrer par cours --</option>
                    <option value="">Tous les cours</option>
                    {cours.map((c) =>
                    <option key={c.id} value={c.cour.id}>{c.cour.name}</option>
                    )}
                  </select>
                </div>
              </div>

              {!loading && !error && filteredQuizzes.length === 0 &&
              <div className="alert alert-warning">Aucun quiz trouvé.</div>
              }

              {!loading && !error && filteredQuizzes.length > 0 &&
              <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="u-style-4845b56d">
                      <tr>
                        <th className="text-white">Id</th>
                        <th className="text-white">Titre</th>
                        <th className="text-white">Cours</th>
                        <th className="text-white">Date de création</th>
                        <th className="text-white text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((quiz, index) =>
                    <tr key={quiz.id}>
                          <td>{index + 1}</td>
                          <td>{quiz.titre}</td>
                          <td>{quiz.cours.name}</td>
                          <td>{new Date(quiz.created_at).toLocaleDateString()}</td>
                          <td className="d-flex justify-content-between align-items-center">
                            <Link to={`/quiz/repondre/${quiz.id}`} target='_blank' rel='noopener noreferrer' className="btn btn-secondary btn-sm me-2">
                              Faire ce quiz
                            </Link>
                            <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(quiz.id)}>
                          
                              Supprimer
                            </button>
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default QuizByEnseignant;
