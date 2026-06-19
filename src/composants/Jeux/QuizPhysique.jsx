import React, { useState, useEffect } from 'react';
const QuizPhysique = () => {
  const [question, setQuestion] = useState(genererQuestion());
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');
  const [tempsRestant, setTempsRestant] = useState(15);
  const [score, setScore] = useState(0);

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
      { texte: "Quelle est la formule de l'énergie cinétique ?", reponse: "1/2 * m * v^2", options: ["m * g * h", "1/2 * m * v^2", "m * v", "F * d", "m * a"] },
      { texte: "Quelle est l'unité de mesure de la force ?", reponse: "Newton", options: ["Joule", "Watt", "Newton", "Pascal", "Hertz"] },
      { texte: "Quelle loi décrit la relation entre la force, la masse et l'accélération ?", reponse: "Deuxième loi de Newton", options: ["Première loi de Newton", "Deuxième loi de Newton", "Troisième loi de Newton", "Loi de la gravitation universelle", "Loi de Coulomb"] },
      { texte: "Quelle est la vitesse de la lumière dans le vide ?", reponse: "3 * 10^8 m/s", options: ["3 * 10^6 m/s", "3 * 10^7 m/s", "3 * 10^8 m/s", "3 * 10^9 m/s", "3 * 10^10 m/s"] },
      { texte: "Quel est le symbole de la charge électrique élémentaire ?", reponse: "e", options: ["q", "Q", "e", "C", "V"] },
      { texte: "Quelle est la formule de la deuxième loi de Newton ?", reponse: "F = m * a", options: ["F = m * v", "F = m * g", "F = m * a", "F = m * d", "F = m * t"] },
      { texte: "Quelle est l'unité de mesure de la puissance ?", reponse: "Watt", options: ["Joule", "Watt", "Newton", "Pascal", "Hertz"] },
      { texte: "Quelle est la formule de l'énergie potentielle gravitationnelle ?", reponse: "m * g * h", options: ["1/2 * m * v^2", "m * g * h", "F * d", "m * a", "m * v"] },
      { texte: "Quel est le symbole de la constante de gravitation universelle ?", reponse: "G", options: ["g", "c", "G", "h", "k"] },
      { texte: "Quelle est la formule de la troisième loi de Newton ?", reponse: "F_A = -F_B", options: ["F = m * a", "F = m * g", "F_A = -F_B", "F = m * v", "F = m * d"] },
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
      <div className="card p-4 ">
        <h1 className="text-center mb-4">Quiz Physique</h1>
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
          <button type="submit" className="btn ">
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

export default QuizPhysique;
