import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
const RepondreQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const userId = localStorage.getItem('userId');
  const ecole_id = parseInt(localStorage.getItem('ecole_id'), 0);
  const direction = parseInt(localStorage.getItem('direction'), 0);

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`https://api.ecolapp.cd/api/quizzes/${quizId}/questions`).
    then((response) => {
      setQuestions(response.data);
      setIsLoading(false);
    }).
    catch((error) => {
      console.error('Error fetching questions:', error);
      setIsLoading(false);
    });
  }, [quizId]);

  const handleResponseChange = (questionId, assertionId) => {
    setResponses((prev) => ({ ...prev, [questionId]: assertionId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/quiz/corriger', { reponse: responses });
      setScore(response.data.score);
      setCorrections(response.data.corrections);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de la soumission des réponses:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplay = () => {
    setResponses({});
    setScore(null);
    setCorrections([]);
    setIsSubmitted(false);
  };

  const handleQuit = () => {
    if (userId && ecole_id && direction) {
      const niveau = getNiveau(direction);
      navigate(`/${niveau}/profil_user`);
    } else {
      navigate('/');
    }
  };

  const getNiveau = (niveau) => {
    switch (niveau) {
      case 3:
        return 'secondaire';
      case 2:
        return 'primaire';
      case 1:
        return 'maternelle';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className='spinner'></div>);

  }

  return (
    <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-12">
                    <div className="card ">
                        <div className="card-body">
                            <h4 className="mb-4 text-center">Répondre au Quiz</h4>

                            {isSubmitted ?
              <div className='text-center'>
                                    <div className="alert alert-success" role="alert">
                                        Votre score est : {score} / {Object.keys(responses).length}
                                    </div>

                                    {corrections.length > 0 &&
                <div className="mt-4 text-start">
                                            <h5 className="mb-3">Résultats détaillés :</h5>
                                            {corrections.map((item, index) =>
                  <div key={index} className={`alert ${item.correct ? 'alert-success' : 'alert-danger'}`}>
                                                    <strong>Question :</strong> {item.question} <br />
                                                    <strong>Votre réponse :</strong> {item.reponse_utilisateur || "Non répondu"} <br />
                                                    <strong>Bonne réponse :</strong> {item.bonne_reponse}
                                                </div>
                  )}
                                        </div>
                }

                                    <div className="mt-4 text-center">
                                        <button className="btn  me-2" onClick={handleReplay}>Rejouer</button>
                                        <button className="btn " onClick={handleQuit}>Quitter</button>
                                    </div>
                                </div> :

              <form onSubmit={handleSubmit}>
                                    {questions.map((question) =>
                <div key={question.id} className="card mb-3">
                                            <div className="card-body">
                                                <h5 className="card-title">{question.texte}</h5>
                                                {question.assertions.map((assertion) => {
                      const inputId = `question-${question.id}-assertion-${assertion.id}`;
                      return (
                        <div key={assertion.id} className="form-check">
                                                            <input
                            className="form-check-input"
                            type="radio"
                            name={`reponse[${question.id}]`}
                            id={inputId}
                            value={assertion.id}
                            onChange={() => handleResponseChange(question.id, assertion.id)}
                            required />
                          
                                                            <label className="form-check-label" htmlFor={inputId}>
                                                                {assertion.texte}
                                                            </label>
                                                        </div>);

                    })}
                                            </div>
                                        </div>
                )}
                                    <button
                  className="btn  u-style-2e6f0cdf"
                  type="submit"
                  disabled={isSubmitting}>







                  
                                        {isSubmitting ? 'Correction en cours...' : 'Soumettre'}
                                    </button>
                                </form>
              }
                        </div>
                    </div>
                </div>
            </div>
        </div>);

};

export default RepondreQuiz;
