import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const AjouterQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState({ nombre_questions: 0, nombre_assertions: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/quizzes/${quizId}`);
        setQuiz(response.data);
        setQuestions(Array.from({ length: response.data.nombre_questions }, () => ({
          texte: '',
          assertions: Array.from({ length: response.data.nombre_assertions }, () => ({ texte: '', est_correct: false }))
        })));
        setLoading(false); // Fin du chargement
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAddQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddAssertion = (questionIndex, assertionIndex, field, value) => {
    const newQuestions = [...questions];
    if (field === 'est_correct') {
      // Un seul peut être correct
      newQuestions[questionIndex].assertions = newQuestions[questionIndex].assertions.map((a, i) => ({
        ...a,
        est_correct: i === assertionIndex
      }));
    } else {
      newQuestions[questionIndex].assertions[assertionIndex][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      for (const question of questions) {
        const response = await axios.post('https://api.ecolapp.cd/api/questions/create', {
          texte: question.texte,
          quiz_id: quizId
        });
        const questionId = response.data.id;
        for (const assertion of question.assertions) {
          await axios.post('https://api.ecolapp.cd/api/assertions/create', {
            ...assertion,
            question_id: questionId
          });
        }
      }
      navigate(`/quiz/repondre/${quizId}`);
    } catch (error) {
      console.error('Erreur lors de la création des questions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='spinner'></div>);

  }

  return (
    <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-12">
                    <div className="card ">
                        <div className="card-body">
                            <h3 className="text-center mb-4 u-style-4789709b">
                             <i className="bi bi-quote"></i> {quiz.titre} <i className="bi bi-quote"></i>
                            </h3>
                            <h5 className="card-title text-center mb-4">Ajouter des Questions</h5>
                            <form onSubmit={handleSubmit}>
                                {questions.map((question, qIndex) =>
                <div key={qIndex} className="mb-4">
                                        <h6 className="mb-3">Question {qIndex + 1}</h6>
                                        <div className="mb-3">
                                            <label className="form-label">Texte de la question :</label>
                                            <input
                      type="text"
                      className="form-control"
                      value={question.texte}
                      onChange={(e) => handleAddQuestion(qIndex, 'texte', e.target.value)}
                      required />
                    
                                        </div>
                                        {question.assertions.map((assertion, aIndex) =>
                  <div key={aIndex} className="form-check d-flex align-items-center mb-2">
                                                <input
                      className="form-check-input me-2"
                      type="radio"
                      name={`correct_assertion_${qIndex}`}
                      onChange={() => handleAddAssertion(qIndex, aIndex, 'est_correct', true)}
                      checked={assertion.est_correct}
                      required />
                    
                                                <input
                      type="text"
                      className="form-control me-2"
                      value={assertion.texte}
                      onChange={(e) => handleAddAssertion(qIndex, aIndex, 'texte', e.target.value)}
                      required />
                    
                                                <span className="text-muted">(Cocher si c'est la bonne réponse)</span>
                                            </div>
                  )}
                                    </div>
                )}
                                <button
                  className="btn  u-style-2e6f0cdf"
                  type="submit"
                  disabled={isSubmitting}>







                  
                                    {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

};

export default AjouterQuestions;
