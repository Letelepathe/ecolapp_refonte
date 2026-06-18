import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizGeographie = () => {
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
      { texte: "Quel est le plus long fleuve du monde ?", reponse: "Nil", options: ["Amazone", "Nil", "Yangtsé", "Mississippi", "Fleuve Jaune"] },
      { texte: "Quel est le plus haut sommet du monde ?", reponse: "Mont Everest", options: ["Mont Everest", "K2", "Kangchenjunga", "Lhotse", "Makalu"] },
      { texte: "Quel océan est le plus grand ?", reponse: "Océan Pacifique", options: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique", "Océan Austral"] },
      { texte: "Quel pays est le plus grand en superficie ?", reponse: "Russie", options: ["Canada", "Chine", "États-Unis", "Russie", "Brésil"] },
      { texte: "Quel continent est le plus grand ?", reponse: "Asie", options: ["Afrique", "Amérique du Nord", "Amérique du Sud", "Antarctique", "Asie"] },
      { texte: "Quelle est la capitale de l'Australie ?", reponse: "Canberra", options: ["Sydney", "Melbourne", "Brisbane", "Canberra", "Perth"] },
      { texte: "Quel désert est le plus grand du monde ?", reponse: "Sahara", options: ["Sahara", "Arctique", "Antarctique", "Gobi", "Kalahari"] },
      { texte: "Quel pays est connu comme le 'Pays du Soleil Levant' ?", reponse: "Japon", options: ["Chine", "Corée du Sud", "Japon", "Vietnam", "Thaïlande"] },
      { texte: "Quel est le plus grand lac du monde ?", reponse: "Mer Caspienne", options: ["Lac Supérieur", "Lac Victoria", "Mer Caspienne", "Lac Huron", "Grand Lac de l'Ours"] },
      { texte: "Quel pays est traversé par l'équateur et le tropique du Capricorne ?", reponse: "Brésil", options: ["Brésil", "Indonésie", "Kenya", "Équateur", "Colombie"] },
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
        <h1 className="text-center mb-4">Quiz Géographie</h1>
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

export default QuizGeographie;
