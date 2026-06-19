import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const CreerQuiz = () => {
  const { courseId } = useParams();
  const [cours, setCours] = useState(null);

  const navigate = useNavigate();
  const [titre, setTitre] = useState('');
  const [nbQuestions, setNbQuestions] = useState(1);
  const [nbAssertions, setNbAssertions] = useState(2);
  const enseignant_id = localStorage.getItem('userId');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInfoCours = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cours/${courseId}`);
        setCours(response.data.cours);
        console.log(response.data.cours);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'élève :", error);
      }
    };
    fetchInfoCours();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/quizzes/create', {
        titre,
        enseignant_id: enseignant_id,
        cours_id: courseId,
        nombre_questions: nbQuestions,
        nombre_assertions: nbAssertions
      });
      if (response.data.status === 200) {
        navigate(`/quiz/ajouter_questions/${response.data.last_id}`);
      } else {
        console.log("Une erreur s'est produite lors de la création du quiz");
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cours) {
    return (
      <div className='spinner'></div>);

  }
  return (
    <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-12">
                    <div className="card ">
                        <div className="card-body">
                            <h4 className="text-center u-style-4789709b">{cours.name}</h4>
                            <h6 className="card-title text-center mb-4">Créer un Quiz</h6>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Titre du quiz :</label>
                                    <input
                    type="text"
                    className="form-control"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    required />
                  
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de questions :</label>
                                    <input
                    type="number"
                    className="form-control"
                    value={nbQuestions}
                    onChange={(e) => setNbQuestions(e.target.value)}
                    min="1"
                    required />
                  
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre d’assertions par question :</label>
                                    <input
                    type="number"
                    className="form-control"
                    value={nbAssertions}
                    onChange={(e) => setNbAssertions(e.target.value)}
                    min="2"
                    max="5"
                    required />
                  
                                </div>
                                <button
                  className="btn  u-style-2e6f0cdf"
                  type="submit"
                  disabled={isSubmitting}>







                  
                                    {isSubmitting ? 'Création en cours...' : 'Créer'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

};

export default CreerQuiz;
