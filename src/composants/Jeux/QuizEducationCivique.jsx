import React, { useState, useEffect } from 'react';
const QuizEducationCivique = () => {
  const [question, setQuestion] = useState(genererQuestion());
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');
  const [tempsRestant, setTempsRestant] = useState(15);
  const [score, setScore] = useState(0);
  const [questionsPosees, setQuestionsPosees] = useState([]);

  useEffect(() => {
    if (tempsRestant > 0) {
      const timer = setTimeout(() => setTempsRestant(tempsRestant - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setMessage('Temps écoulé ! La réponse était : ' + question.reponse);
      setQuestion(genererQuestion());
      setTempsRestant(15);
    }
  }, [tempsRestant, question.reponse]);

  function genererQuestion() {
    const questions = [
      { texte: "Quels sont les trois principes de la République française ?", reponse: "Liberté, Égalité, Fraternité", options: ["Liberté, Égalité, Fraternité", "Justice, Paix, Prospérité", "Unité, Diversité, Solidarité", "Démocratie, Équité, Respect", "Honneur, Patrie, Devoir"] },
      { texte: "Quel est le rôle du Parlement dans un pays démocratique ?", reponse: "Voter les lois", options: ["Voter les lois", "Nommer le président", "Contrôler l'armée", "Gérer les finances publiques", "Déclarer la guerre"] },
      { texte: "Qu'est-ce que la laïcité ?", reponse: "Séparation de l'Église et de l'État", options: ["Séparation de l'Église et de l'État", "Liberté de culte", "Égalité des religions", "Neutralité religieuse", "Respect des croyances"] },
      // Ajoutez d'autres questions ici
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === question.reponse) {
      setMessage('Correct !');
      setScore(score + 1);
    } else {
      setMessage('Faux ! La réponse était : ' + question.reponse);
    }
    setQuestion(genererQuestion());
    setSelectedOption('');
    setTempsRestant(15);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow">
        <h1 className="text-center mb-4">Quiz Éducation Civique et Morale</h1>
        <div className="text-center mb-4">
          <p className="lead">{question.texte}</p>
          <p>Temps restant : {tempsRestant} secondes</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {question.options.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="options"
                  id={`option-${index}`}
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label className="form-check-label" htmlFor={`option-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            Soumettre
          </button>
        </form>
        {message && <div className="text-center text-danger mt-3">{message}</div>}
        <div className="text-center mt-4">
          <p>Score : {score}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizEducationCivique;
