import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const QuizByCours = () => {
  const { coursId } = useParams();
  const [cours, setCours] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfoCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cours/${coursId}`);
        setCours(response.data.cours);
        console.log(response.data.cours);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'élève :", error);
      }
    };
    fetchInfoCours();
  }, [coursId]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/courses/${coursId}/quizzes`);
        if (response.data.status === 200) {
          setQuizzes(response.data.quizzes);
        } else {
          console.log("Erreur lors de la récupération des quiz");
        }
      } catch (err) {
        setError("Erreur lors du chargement des quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [coursId]);

  if (!cours) {
    return (
      <div className='spinner'></div>);

  }
  return (
    <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-12">
            <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="text-center u-style-951c0e5f">{cours.name}</h4> 
                  <h6 className="mb-4 text-center">Liste des quiz</h6>

                  {loading &&
              <div className='spinner'></div>
              }

                  {error && <div className="alert alert-danger mt-3">{error}</div>}

                  {!loading && !error && quizzes.length === 0 &&
              <div className="alert alert-warning mt-3">Aucun quiz trouvé pour ce cours.</div>
              }

                  {!loading && !error && quizzes.length > 0 &&
              <ul className="list-group">
                      {quizzes.map((quiz) =>
                <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                          {quiz.titre}
                          <Link to={`/quiz/repondre/${quiz.id}`} className="btn btn-secondary btn-sm">
                            Faire ce quiz
                          </Link>
                        </li>
                )}
                    </ul>
              }
                </div>
              </div>
            </div>
        </div>
      </div>);

};

export default QuizByCours;
